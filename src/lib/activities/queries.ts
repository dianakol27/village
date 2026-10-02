import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { ActivityAudience, ActivitySessionStatus, ActivityStatus, BookingStatus } from "@/generated/prisma/enums";
import { ageRangeLabel, activityIdFromSlug, activitySlug, audienceForExperience, getAgeGroupBounds, getDateCandidateWindow, resolveSessionPrice, selectNextUpcomingSession, type ExploreFilters } from "@/lib/activities/discovery";
import { prisma } from "@/lib/database/prisma";

const activitySelect = (sessionWhere: Prisma.ActivitySessionWhereInput, sessionTake?: number) =>
  ({
    id: true,
    title: true,
    description: true,
    audience: true,
    childrenWelcome: true,
    minAgeMonths: true,
    maxAgeMonths: true,
    priceMinorUnits: true,
    currencyCode: true,
    timeZone: true,
    category: { select: { name: true, slug: true } },
    organizer: { select: { name: true } },
    venue: { select: { name: true, city: true, addressLine1: true } },
    interests: { select: { interest: { select: { name: true, slug: true } } } },
    sessions: {
      where: sessionWhere,
      orderBy: { startsAt: "asc" },
      ...(sessionTake === undefined ? {} : { take: sessionTake }),
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        capacity: true,
        priceMinorUnitsOverride: true,
        venue: { select: { name: true, city: true, addressLine1: true } },
      },
    },
  }) satisfies Prisma.ActivitySelect;

type ActivityRow = Prisma.ActivityGetPayload<{ select: ReturnType<typeof activitySelect> }>;
type ActivitySessionRow = ActivityRow["sessions"][number];
type VenueSummary = { name: string; city: string; addressLine1: string };

export type SessionSummary = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number | null;
  bookedPlaces: number;
  placesRemaining: number | null;
  priceMinorUnits: number | null;
  venue: VenueSummary | null;
};

export type ActivitySummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  audience: ActivityAudience;
  childrenWelcome: boolean;
  categoryName: string;
  categorySlug: string;
  organizerName: string;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  ageLabel: string;
  priceMinorUnits: number | null;
  currencyCode: string;
  timeZone: string;
  venue: VenueSummary | null;
  interests: { name: string; slug: string }[];
  sessions: SessionSummary[];
  nextSession: SessionSummary | null;
};

export type ActivityCategoryOption = { id: string; name: string; slug: string };

export async function getActivityCategories(): Promise<ActivityCategoryOption[]> {
  return prisma.activityCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

function upcomingSessionWhere(now: Date, filters?: ExploreFilters): Prisma.ActivitySessionWhereInput {
  const conditions: Prisma.ActivitySessionWhereInput[] = [
    {
      status: ActivitySessionStatus.SCHEDULED,
      startsAt: { gte: now },
    },
  ];

  if (filters?.date) {
    const window = getDateCandidateWindow(filters.date);
    conditions.push({
      startsAt: {
        gte: window.startsAt > now ? window.startsAt : now,
        lt: window.endsAt,
      },
    });
  }

  if (filters?.price === "free") {
    conditions.push({
      OR: [
        { priceMinorUnitsOverride: 0 },
        { priceMinorUnitsOverride: null, activity: { is: { priceMinorUnits: 0 } } },
      ],
    });
  } else if (filters?.price === "paid") {
    conditions.push({
      OR: [
        { priceMinorUnitsOverride: { gt: 0 } },
        { priceMinorUnitsOverride: null, activity: { is: { priceMinorUnits: { gt: 0 } } } },
      ],
    });
  }

  return { AND: conditions };
}

function activityWhere(filters: ExploreFilters, now: Date): Prisma.ActivityWhereInput {
  const ageBounds = filters.age ? getAgeGroupBounds(filters.age) : undefined;
  const ageConditions: Prisma.ActivityWhereInput[] = ageBounds
    ? [
        { OR: [{ minAgeMonths: null }, { minAgeMonths: { lte: ageBounds.maxMonths } }] },
        { OR: [{ maxAgeMonths: null }, { maxAgeMonths: { gte: ageBounds.minMonths } }] },
      ]
    : [];

  return {
    status: ActivityStatus.PUBLISHED,
    audience: audienceForExperience(filters.experience),
    ...(filters.category ? { category: { is: { slug: filters.category } } } : {}),
    ...(ageConditions.length ? { AND: ageConditions } : {}),
    sessions: { some: upcomingSessionWhere(now, filters) },
  };
}

function venueForSession(session: ActivitySessionRow, activityVenue: VenueSummary | null) {
  return session.venue ?? activityVenue;
}

async function countActiveBookings(sessionIds: string[], now: Date) {
  if (!sessionIds.length) return new Map<string, number>();

  const counts = await prisma.booking.groupBy({
    by: ["sessionId"],
    where: {
      sessionId: { in: sessionIds },
      OR: [
        { status: BookingStatus.CONFIRMED },
        {
          status: BookingStatus.PENDING,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      ],
    },
    _count: { _all: true },
  });

  return new Map(counts.map(({ sessionId, _count }) => [sessionId, _count._all]));
}

function mapSession(
  session: ActivitySessionRow,
  activity: ActivityRow,
  bookedPlaces: number,
): SessionSummary {
  return {
    id: session.id,
    startsAt: session.startsAt,
    endsAt: session.endsAt,
    capacity: session.capacity,
    bookedPlaces,
    placesRemaining:
      session.capacity === null ? null : Math.max(0, session.capacity - bookedPlaces),
    priceMinorUnits: resolveSessionPrice(activity.priceMinorUnits, session.priceMinorUnitsOverride),
    venue: venueForSession(session, activity.venue),
  };
}

function mapActivity(
  row: ActivityRow,
  sessions: ActivitySessionRow[],
  bookingCounts: Map<string, number>,
): ActivitySummary {
  const mappedSessions = sessions.map((session) =>
    mapSession(session, row, bookingCounts.get(session.id) ?? 0),
  );
  return {
    id: row.id,
    slug: activitySlug(row.title, row.id),
    title: row.title,
    description: row.description,
    audience: row.audience,
    childrenWelcome: row.childrenWelcome,
    categoryName: row.category.name,
    categorySlug: row.category.slug,
    organizerName: row.organizer.name,
    minAgeMonths: row.minAgeMonths,
    maxAgeMonths: row.maxAgeMonths,
    ageLabel: ageRangeLabel(row.minAgeMonths, row.maxAgeMonths),
    priceMinorUnits: row.priceMinorUnits,
    currencyCode: row.currencyCode.trim(),
    timeZone: row.timeZone,
    venue: row.venue,
    interests: row.interests.map(({ interest }) => interest),
    sessions: mappedSessions,
    nextSession: mappedSessions[0] ?? null,
  };
}

export async function getExploreActivities(filters: ExploreFilters, now = new Date()) {
  const sessionWhere = upcomingSessionWhere(now, filters);
  const select = activitySelect(sessionWhere, filters.date ? undefined : 1);
  const rows = await prisma.activity.findMany({
    where: activityWhere(filters, now),
    orderBy: [{ title: "asc" }, { id: "asc" }],
    select,
  });

  const matchingRows = rows.flatMap((row) => {
    const nextSession = selectNextUpcomingSession(row.sessions, now, {
      ...(filters.date ? { date: filters.date } : {}),
      timeZone: row.timeZone,
    });
    return nextSession ? [{ row, sessions: [nextSession] }] : [];
  });

  const sessionIds = matchingRows.flatMap(({ sessions }) => sessions.map(({ id }) => id));
  const bookingCounts = await countActiveBookings(sessionIds, now);

  return matchingRows
    .map(({ row, sessions }) => mapActivity(row, sessions, bookingCounts))
    .sort((left, right) => {
      const nextSessionOrder =
        (left.nextSession?.startsAt.getTime() ?? Infinity) -
        (right.nextSession?.startsAt.getTime() ?? Infinity);
      return nextSessionOrder || left.title.localeCompare(right.title);
    });
}

export async function getActivityDetails(slug: string, now = new Date()) {
  const parsedSlug = activityIdFromSlug(slug);
  if (!parsedSlug) return null;

  const sessionWhere = upcomingSessionWhere(now);
  const select = activitySelect(sessionWhere, 24);
  const row = await prisma.activity.findFirst({
    where: { id: parsedSlug.id, status: ActivityStatus.PUBLISHED },
    select,
  });
  if (!row || activitySlug(row.title, row.id) !== slug) return null;

  const sessionIds = row.sessions.map(({ id }) => id);
  const bookingCounts = await countActiveBookings(sessionIds, now);
  return mapActivity(row, row.sessions, bookingCounts);
}
