import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Development-only seed data. Every person, organizer, activity, venue, Circle,
 * and meetup here is fictional; example.test addresses cannot receive mail.
 * This script is idempotent and upserts only its stable fixture IDs.
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Set DATABASE_URL in .env before running the development seed.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const timeZone = "Europe/Amsterdam";

const interestData = [
  { id: "interest-art", name: "Art", slug: "art", scope: "BOTH" },
  { id: "interest-animals", name: "Animals", slug: "animals", scope: "CHILD" },
  { id: "interest-nature", name: "Nature", slug: "nature", scope: "BOTH" },
  { id: "interest-football", name: "Football", slug: "football", scope: "CHILD" },
  { id: "interest-swimming", name: "Swimming", slug: "swimming", scope: "CHILD" },
  { id: "interest-music", name: "Music", slug: "music", scope: "BOTH" },
  { id: "interest-science", name: "Science", slug: "science", scope: "CHILD" },
  { id: "interest-running", name: "Running", slug: "running", scope: "PARENT" },
  { id: "interest-yoga", name: "Yoga", slug: "yoga", scope: "PARENT" },
  { id: "interest-wellbeing", name: "Wellbeing", slug: "wellbeing", scope: "PARENT" },
  { id: "interest-coffee", name: "Coffee", slug: "coffee", scope: "PARENT" },
  { id: "interest-books", name: "Books", slug: "books", scope: "BOTH" },
] as const;

const categoryData = [
  { id: "category-art", name: "Art & making", slug: "art-making" },
  { id: "category-nature", name: "Nature", slug: "nature" },
  { id: "category-sports", name: "Sports", slug: "sports" },
  { id: "category-music", name: "Music", slug: "music" },
  { id: "category-running", name: "Running", slug: "running" },
  { id: "category-wellbeing", name: "Wellbeing", slug: "wellbeing" },
  { id: "category-social", name: "Coffee & social", slug: "coffee-social" },
  { id: "category-family", name: "Family days", slug: "family-days" },
  { id: "category-science", name: "Science", slug: "science" },
] as const;

const userData = [
  {
    id: "user-mila-dekker",
    email: "mila.dekker@example.test",
    displayName: "Mila Dekker",
    role: "USER",
    onboardingStatus: "COMPLETED",
    homeCity: "Dordrecht",
    homeArea: "Centrum",
  },
  {
    id: "user-noor-smit",
    email: "noor.smit@example.test",
    displayName: "Noor Smit",
    role: "USER",
    onboardingStatus: "COMPLETED",
    homeCity: "Dordrecht",
    homeArea: "Reeland",
  },
  {
    id: "user-jules-visser",
    email: "jules.visser@example.test",
    displayName: "Jules Visser",
    role: "USER",
    onboardingStatus: "COMPLETED",
    homeCity: "Dordrecht",
    homeArea: "Stadspolders",
  },
] as const;

const childData = [
  { id: "child-emma-dekker", userId: "user-mila-dekker", nickname: "Emma", birthYear: 2022, birthMonth: 4 },
  { id: "child-finn-dekker", userId: "user-mila-dekker", nickname: "Finn", birthYear: 2020, birthMonth: 11 },
  { id: "child-lotte-smit", userId: "user-noor-smit", nickname: "Lotte", birthYear: 2021, birthMonth: 8 },
  { id: "child-sam-visser", userId: "user-jules-visser", nickname: "Sam", birthYear: 2023, birthMonth: 2 },
] as const;

const organizerData = [
  {
    id: "organizer-demo-willow",
    name: "Fictional Willow Workshop",
    description: "A fictional development-only organizer for sample creative activities.",
    publicContactEmail: "willow@example.test",
    verificationStatus: "UNVERIFIED",
    createdByUserId: "user-mila-dekker",
  },
  {
    id: "organizer-demo-river",
    name: "Fictional River & Field Club",
    description: "A fictional development-only organizer for sample outdoor activities.",
    publicContactEmail: "river-field@example.test",
    verificationStatus: "UNVERIFIED",
    createdByUserId: "user-noor-smit",
  },
  {
    id: "organizer-demo-lantern",
    name: "Fictional Lantern Community Studio",
    description: "A fictional development-only organizer for sample parent and family events.",
    publicContactEmail: "lantern@example.test",
    verificationStatus: "UNVERIFIED",
    createdByUserId: "user-jules-visser",
  },
] as const;

const venueData = [
  {
    id: "venue-demo-willow-room",
    name: "Demo Willow Workshop Room",
    addressLine1: "12 Example Lane",
    city: "Dordrecht",
    postalCode: "3311 ZZ",
    countryCode: "NL",
    latitude: 51.8134,
    longitude: 4.6692,
  },
  {
    id: "venue-demo-river-garden",
    name: "Demo River Garden",
    addressLine1: "4 Sample Quay",
    city: "Dordrecht",
    postalCode: "3311 ZX",
    countryCode: "NL",
    latitude: 51.8171,
    longitude: 4.6753,
  },
  {
    id: "venue-demo-meadow-pitch",
    name: "Demo Meadow Sports Pitch",
    addressLine1: "20 Fiction Street",
    city: "Dordrecht",
    postalCode: "3312 ZZ",
    countryCode: "NL",
    latitude: 51.8058,
    longitude: 4.6841,
  },
  {
    id: "venue-demo-lantern-hall",
    name: "Demo Lantern Community Hall",
    addressLine1: "7 Sample Garden Road",
    city: "Dordrecht",
    postalCode: "3313 ZZ",
    countryCode: "NL",
    latitude: 51.8022,
    longitude: 4.6615,
  },
  {
    id: "venue-demo-quiet-cafe",
    name: "Demo Quiet Corner Café",
    addressLine1: "3 Imaginary Square",
    city: "Dordrecht",
    postalCode: "3311 ZY",
    countryCode: "NL",
    latitude: 51.8112,
    longitude: 4.6578,
  },
] as const;

type ActivitySeed = {
  id: string;
  organizerId: string;
  categoryId: string;
  venueId: string;
  title: string;
  description: string;
  audience: "CHILDREN" | "PARENTS" | "FAMILIES";
  childrenWelcome: boolean;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  priceMinorUnits: number | null;
  currencyCode: string;
  interests: readonly string[];
};

const activityData: readonly ActivitySeed[] = [
  {
    id: "activity-little-makers",
    organizerId: "organizer-demo-willow",
    categoryId: "category-art",
    venueId: "venue-demo-willow-room",
    title: "Little Makers Art Morning",
    description: "A fictional, hands-on sample session for color, clay, and small discoveries.",
    audience: "CHILDREN",
    childrenWelcome: true,
    minAgeMonths: 36,
    maxAgeMonths: 84,
    priceMinorUnits: 1200,
    currencyCode: "EUR",
    interests: ["interest-art", "interest-science"],
  },
  {
    id: "activity-river-explorers",
    organizerId: "organizer-demo-river",
    categoryId: "category-nature",
    venueId: "venue-demo-river-garden",
    title: "Riverbank Nature Explorers",
    description: "A fictional sample nature walk with leaves, birds, and tiny observations.",
    audience: "CHILDREN",
    childrenWelcome: true,
    minAgeMonths: 48,
    maxAgeMonths: 108,
    priceMinorUnits: 0,
    currencyCode: "EUR",
    interests: ["interest-nature", "interest-animals"],
  },
  {
    id: "activity-mini-football",
    organizerId: "organizer-demo-river",
    categoryId: "category-sports",
    venueId: "venue-demo-meadow-pitch",
    title: "Mini Football & Movement",
    description: "A fictional sample play session focused on friendly movement and ball skills.",
    audience: "CHILDREN",
    childrenWelcome: true,
    minAgeMonths: 48,
    maxAgeMonths: 96,
    priceMinorUnits: 800,
    currencyCode: "EUR",
    interests: ["interest-football", "interest-nature"],
  },
  {
    id: "activity-singing-circle",
    organizerId: "organizer-demo-lantern",
    categoryId: "category-music",
    venueId: "venue-demo-lantern-hall",
    title: "Little Voices Music Circle",
    description: "A fictional sample music hour with rhythm games and familiar songs.",
    audience: "CHILDREN",
    childrenWelcome: true,
    minAgeMonths: 18,
    maxAgeMonths: 60,
    priceMinorUnits: 900,
    currencyCode: "EUR",
    interests: ["interest-music", "interest-books"],
  },
  {
    id: "activity-parent-run",
    organizerId: "organizer-demo-river",
    categoryId: "category-running",
    venueId: "venue-demo-river-garden",
    title: "Canal Path Parent Run",
    description: "A fictional easy-pace social run; children in strollers are welcome.",
    audience: "PARENTS",
    childrenWelcome: true,
    minAgeMonths: null,
    maxAgeMonths: null,
    priceMinorUnits: 0,
    currencyCode: "EUR",
    interests: ["interest-running", "interest-nature"],
  },
  {
    id: "activity-parent-yoga",
    organizerId: "organizer-demo-lantern",
    categoryId: "category-wellbeing",
    venueId: "venue-demo-lantern-hall",
    title: "Gentle Morning Yoga for Parents",
    description: "A fictional adults-only sample class for stretching and a slower start.",
    audience: "PARENTS",
    childrenWelcome: false,
    minAgeMonths: null,
    maxAgeMonths: null,
    priceMinorUnits: 1000,
    currencyCode: "EUR",
    interests: ["interest-yoga", "interest-wellbeing"],
  },
  {
    id: "activity-parent-coffee",
    organizerId: "organizer-demo-lantern",
    categoryId: "category-social",
    venueId: "venue-demo-quiet-cafe",
    title: "Coffee & New Neighbours",
    description: "A fictional informal social meetup for parents; little ones may join.",
    audience: "PARENTS",
    childrenWelcome: true,
    minAgeMonths: null,
    maxAgeMonths: null,
    priceMinorUnits: null,
    currencyCode: "EUR",
    interests: ["interest-coffee", "interest-books"],
  },
  {
    id: "activity-family-garden-day",
    organizerId: "organizer-demo-willow",
    categoryId: "category-family",
    venueId: "venue-demo-river-garden",
    title: "Family Garden Discovery Day",
    description: "A fictional family activity with a shared nature trail and simple crafts.",
    audience: "FAMILIES",
    childrenWelcome: true,
    minAgeMonths: 24,
    maxAgeMonths: 120,
    priceMinorUnits: 1500,
    currencyCode: "EUR",
    interests: ["interest-nature", "interest-art", "interest-animals"],
  },
  {
    id: "activity-family-science",
    organizerId: "organizer-demo-willow",
    categoryId: "category-science",
    venueId: "venue-demo-willow-room",
    title: "Family Science Table",
    description: "A fictional family workshop with safe, playful water and light experiments.",
    audience: "FAMILIES",
    childrenWelcome: true,
    minAgeMonths: 60,
    maxAgeMonths: 144,
    priceMinorUnits: 1800,
    currencyCode: "EUR",
    interests: ["interest-science", "interest-art"],
  },
];

type LocalSchedule = {
  day: number;
  hour: number;
  minute: number;
  weeksLater?: number;
};

type SessionSeed = {
  id: string;
  activityId: string;
  venueId?: string;
  schedule: LocalSchedule;
  durationMinutes: number;
  capacity: number | null;
  priceMinorUnitsOverride?: number | null;
};

const sessionData: readonly SessionSeed[] = [
  { id: "session-makers-1", activityId: "activity-little-makers", schedule: { day: 6, hour: 10, minute: 30 }, durationMinutes: 90, capacity: 10 },
  { id: "session-makers-2", activityId: "activity-little-makers", schedule: { day: 6, hour: 10, minute: 30, weeksLater: 1 }, durationMinutes: 90, capacity: 10 },
  { id: "session-river-1", activityId: "activity-river-explorers", schedule: { day: 6, hour: 14, minute: 0 }, durationMinutes: 90, capacity: 14 },
  { id: "session-football-1", activityId: "activity-mini-football", schedule: { day: 3, hour: 16, minute: 0 }, durationMinutes: 60, capacity: 12 },
  { id: "session-music-1", activityId: "activity-singing-circle", schedule: { day: 4, hour: 15, minute: 30 }, durationMinutes: 45, capacity: 10 },
  { id: "session-run-1", activityId: "activity-parent-run", schedule: { day: 2, hour: 9, minute: 0 }, durationMinutes: 60, capacity: 16 },
  { id: "session-yoga-1", activityId: "activity-parent-yoga", schedule: { day: 4, hour: 9, minute: 30 }, durationMinutes: 60, capacity: 8 },
  { id: "session-coffee-1", activityId: "activity-parent-coffee", schedule: { day: 5, hour: 10, minute: 0 }, durationMinutes: 90, capacity: 12 },
  { id: "session-garden-1", activityId: "activity-family-garden-day", schedule: { day: 6, hour: 11, minute: 0 }, durationMinutes: 120, capacity: 20 },
  { id: "session-science-1", activityId: "activity-family-science", schedule: { day: 0, hour: 10, minute: 0 }, durationMinutes: 90, capacity: 12 },
  { id: "session-science-2", activityId: "activity-family-science", schedule: { day: 0, hour: 10, minute: 0, weeksLater: 1 }, durationMinutes: 90, capacity: 12 },
  { id: "session-football-2", activityId: "activity-mini-football", venueId: "venue-demo-river-garden", schedule: { day: 3, hour: 16, minute: 0, weeksLater: 1 }, durationMinutes: 60, capacity: 12 },
];

const circleData = [
  {
    id: "circle-demo-dordrecht-families",
    name: "Sample Dordrecht Families 3–5",
    description: "Fictional development-only Circle for parents of preschool-aged children.",
    city: "Dordrecht",
    area: "Centrum",
    visibility: "PUBLIC",
    createdByUserId: "user-mila-dekker",
  },
  {
    id: "circle-demo-outdoor-families",
    name: "Sample Outdoor Families",
    description: "Fictional development-only Circle for families who like nearby nature.",
    city: "Dordrecht",
    area: "Reeland",
    visibility: "PUBLIC",
    createdByUserId: "user-noor-smit",
  },
  {
    id: "circle-demo-coffee-parents",
    name: "Sample Coffee & Parent Chats",
    description: "Fictional development-only Circle for casual parent meetups.",
    city: "Dordrecht",
    area: "Stadspolders",
    visibility: "PRIVATE",
    createdByUserId: "user-jules-visser",
  },
] as const;

const membershipData = [
  { circleId: "circle-demo-dordrecht-families", userId: "user-mila-dekker", role: "OWNER" },
  { circleId: "circle-demo-dordrecht-families", userId: "user-noor-smit", role: "MODERATOR" },
  { circleId: "circle-demo-dordrecht-families", userId: "user-jules-visser", role: "MEMBER" },
  { circleId: "circle-demo-outdoor-families", userId: "user-noor-smit", role: "OWNER" },
  { circleId: "circle-demo-outdoor-families", userId: "user-mila-dekker", role: "MEMBER" },
  { circleId: "circle-demo-outdoor-families", userId: "user-jules-visser", role: "MEMBER" },
  { circleId: "circle-demo-coffee-parents", userId: "user-jules-visser", role: "OWNER" },
  { circleId: "circle-demo-coffee-parents", userId: "user-mila-dekker", role: "MEMBER" },
] as const;

const meetupData = [
  {
    id: "meetup-demo-playground-coffee",
    circleId: "circle-demo-dordrecht-families",
    venueId: "venue-demo-quiet-cafe",
    creatorUserId: "user-mila-dekker",
    title: "Sample Coffee + Playground Morning",
    description: "Fictional development meetup for seed data.",
    schedule: { day: 6, hour: 9, minute: 30 },
    durationMinutes: 90,
    capacity: 10,
    status: "SCHEDULED",
  },
  {
    id: "meetup-demo-story-time",
    circleId: "circle-demo-dordrecht-families",
    venueId: "venue-demo-lantern-hall",
    creatorUserId: "user-noor-smit",
    title: "Sample Story & Song Hour",
    description: "Fictional development meetup for seed data.",
    schedule: { day: 0, hour: 10, minute: 30 },
    durationMinutes: 60,
    capacity: 14,
    status: "SCHEDULED",
  },
  {
    id: "meetup-demo-river-walk",
    circleId: "circle-demo-outdoor-families",
    venueId: "venue-demo-river-garden",
    creatorUserId: "user-noor-smit",
    title: "Sample Riverside Nature Walk",
    description: "Fictional development meetup for seed data.",
    schedule: { day: 6, hour: 13, minute: 30, weeksLater: 1 },
    durationMinutes: 90,
    capacity: 12,
    status: "SCHEDULED",
  },
  {
    id: "meetup-demo-leaf-collage",
    circleId: "circle-demo-outdoor-families",
    venueId: "venue-demo-willow-room",
    creatorUserId: "user-jules-visser",
    title: "Sample Leaf Collage Table",
    description: "Fictional development meetup for seed data.",
    schedule: { day: 0, hour: 14, minute: 0 },
    durationMinutes: 75,
    capacity: 10,
    status: "SCHEDULED",
  },
  {
    id: "meetup-demo-parent-coffee",
    circleId: "circle-demo-coffee-parents",
    venueId: "venue-demo-quiet-cafe",
    creatorUserId: "user-jules-visser",
    title: "Sample New Parent Coffee Chat",
    description: "Fictional development meetup for seed data.",
    schedule: { day: 5, hour: 10, minute: 0 },
    durationMinutes: 90,
    capacity: 8,
    status: "SCHEDULED",
  },
  {
    id: "meetup-demo-evening-stroll",
    circleId: "circle-demo-coffee-parents",
    venueId: "venue-demo-river-garden",
    creatorUserId: "user-mila-dekker",
    title: "Sample Early Evening Stroll",
    description: "Fictional development meetup for seed data.",
    schedule: { day: 3, hour: 17, minute: 0, weeksLater: 1 },
    durationMinutes: 60,
    capacity: 10,
    status: "SCHEDULED",
  },
] as const;

const membershipInterests = [
  { userId: "user-mila-dekker", interestIds: ["interest-art", "interest-coffee", "interest-books"] },
  { userId: "user-noor-smit", interestIds: ["interest-nature", "interest-running", "interest-yoga"] },
  { userId: "user-jules-visser", interestIds: ["interest-music", "interest-wellbeing", "interest-coffee"] },
] as const;

const childInterests = [
  { childId: "child-emma-dekker", interestIds: ["interest-art", "interest-animals", "interest-books"] },
  { childId: "child-finn-dekker", interestIds: ["interest-football", "interest-nature", "interest-science"] },
  { childId: "child-lotte-smit", interestIds: ["interest-swimming", "interest-music", "interest-nature"] },
  { childId: "child-sam-visser", interestIds: ["interest-music", "interest-animals", "interest-art"] },
] as const;

const savedActivityData = [
  { userId: "user-mila-dekker", activityId: "activity-little-makers" },
  { userId: "user-mila-dekker", activityId: "activity-family-garden-day" },
  { userId: "user-noor-smit", activityId: "activity-river-explorers" },
  { userId: "user-noor-smit", activityId: "activity-parent-run" },
  { userId: "user-jules-visser", activityId: "activity-singing-circle" },
] as const;

const bookingData = [
  { id: "booking-demo-emma-art", sessionId: "session-makers-1", userId: "user-mila-dekker", childId: "child-emma-dekker", status: "CONFIRMED" },
  { id: "booking-demo-finn-football", sessionId: "session-football-1", userId: "user-mila-dekker", childId: "child-finn-dekker", status: "CONFIRMED" },
  { id: "booking-demo-noor-run", sessionId: "session-run-1", userId: "user-noor-smit", childId: null, status: "CONFIRMED" },
  { id: "booking-demo-jules-yoga", sessionId: "session-yoga-1", userId: "user-jules-visser", childId: null, status: "PENDING" },
  { id: "booking-demo-lotte-music", sessionId: "session-music-1", userId: "user-noor-smit", childId: "child-lotte-smit", status: "CONFIRMED" },
] as const;

const meetupAttendeeData = [
  { meetupId: "meetup-demo-playground-coffee", userId: "user-mila-dekker", status: "GOING" },
  { meetupId: "meetup-demo-playground-coffee", userId: "user-noor-smit", status: "GOING" },
  { meetupId: "meetup-demo-story-time", userId: "user-jules-visser", status: "GOING" },
  { meetupId: "meetup-demo-river-walk", userId: "user-noor-smit", status: "GOING" },
  { meetupId: "meetup-demo-river-walk", userId: "user-mila-dekker", status: "GOING" },
  { meetupId: "meetup-demo-leaf-collage", userId: "user-jules-visser", status: "GOING" },
  { meetupId: "meetup-demo-parent-coffee", userId: "user-mila-dekker", status: "GOING" },
  { meetupId: "meetup-demo-evening-stroll", userId: "user-noor-smit", status: "WAITLISTED" },
] as const;

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function localDateParts(date: Date) {
  const parts = timeFormatter.formatToParts(date);
  const value = (type: "year" | "month" | "day") => {
    const part = parts.find((item) => item.type === type)?.value;
    if (!part) throw new Error(`Missing ${type} while building local seed dates.`);
    return Number(part);
  };

  return { year: value("year"), month: value("month"), day: value("day") };
}

function localDateTimeToUtc(year: number, month: number, day: number, hour: number, minute: number) {
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const offsetParts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date(wallClockAsUtc));
  const get = (type: string) => Number(offsetParts.find((part) => part.type === type)?.value);
  const renderedAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  const offset = renderedAsUtc - wallClockAsUtc;

  return new Date(wallClockAsUtc - offset);
}

function nextLocalOccurrence(schedule: LocalSchedule) {
  const now = new Date();
  const today = localDateParts(now);
  const targetDate = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const daysUntilTarget = (schedule.day - targetDate.getUTCDay() + 7) % 7;
  targetDate.setUTCDate(targetDate.getUTCDate() + daysUntilTarget + (schedule.weeksLater ?? 0) * 7);

  let occurrence = localDateTimeToUtc(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate(),
    schedule.hour,
    schedule.minute,
  );

  if (occurrence <= now) {
    targetDate.setUTCDate(targetDate.getUTCDate() + 7);
    occurrence = localDateTimeToUtc(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth() + 1,
      targetDate.getUTCDate(),
      schedule.hour,
      schedule.minute,
    );
  }

  return occurrence;
}

async function main() {
  for (const interest of interestData) {
    await prisma.interest.upsert({
      where: { id: interest.id },
      create: interest,
      update: interest,
    });
  }

  for (const category of categoryData) {
    await prisma.activityCategory.upsert({
      where: { id: category.id },
      create: category,
      update: category,
    });
  }

  for (const user of userData) {
    await prisma.user.upsert({ where: { id: user.id }, create: user, update: user });
  }

  for (const child of childData) {
    await prisma.child.upsert({ where: { id: child.id }, create: child, update: child });
  }

  for (const organizer of organizerData) {
    await prisma.organizer.upsert({
      where: { id: organizer.id },
      create: organizer,
      update: organizer,
    });
  }

  for (const venue of venueData) {
    const coordinates = { latitude: venue.latitude, longitude: venue.longitude };
    await prisma.venue.upsert({
      where: { id: venue.id },
      create: { ...venue, ...coordinates },
      update: { ...venue, ...coordinates },
    });
  }

  for (const activity of activityData) {
    const { interests: _interests, ...activityFields } = activity;
    void _interests;
    await prisma.activity.upsert({
      where: { id: activity.id },
      create: { ...activityFields, status: "PUBLISHED", timeZone },
      update: { ...activityFields, status: "PUBLISHED", timeZone },
    });

    for (const interestId of activity.interests) {
      await prisma.activityInterest.upsert({
        where: { activityId_interestId: { activityId: activity.id, interestId } },
        create: { activityId: activity.id, interestId },
        update: {},
      });
    }
  }

  const activityById = new Map(activityData.map((activity) => [activity.id, activity]));
  for (const session of sessionData) {
    const startAt = nextLocalOccurrence(session.schedule);
    const activity = activityById.get(session.activityId);
    if (!activity) throw new Error(`Missing activity fixture: ${session.activityId}`);
    const venueId = session.venueId ?? activity.venueId;
    const endsAt = new Date(startAt.getTime() + session.durationMinutes * 60_000);

    await prisma.activitySession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        activityId: session.activityId,
        venueId,
        startsAt: startAt,
        endsAt,
        capacity: session.capacity,
        ...(session.priceMinorUnitsOverride === undefined
          ? {}
          : { priceMinorUnitsOverride: session.priceMinorUnitsOverride }),
        status: "SCHEDULED",
      },
      update: {
        venueId,
        startsAt: startAt,
        endsAt,
        capacity: session.capacity,
        ...(session.priceMinorUnitsOverride === undefined
          ? {}
          : { priceMinorUnitsOverride: session.priceMinorUnitsOverride }),
        status: "SCHEDULED",
      },
    });
  }

  for (const assignment of membershipInterests) {
    for (const interestId of assignment.interestIds) {
      await prisma.userInterest.upsert({
        where: { userId_interestId: { userId: assignment.userId, interestId } },
        create: { userId: assignment.userId, interestId },
        update: {},
      });
    }
  }

  for (const assignment of childInterests) {
    for (const interestId of assignment.interestIds) {
      await prisma.childInterest.upsert({
        where: { childId_interestId: { childId: assignment.childId, interestId } },
        create: { childId: assignment.childId, interestId },
        update: {},
      });
    }
  }

  for (const saved of savedActivityData) {
    await prisma.savedActivity.upsert({
      where: { userId_activityId: saved },
      create: saved,
      update: {},
    });
  }

  for (const booking of bookingData) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      create: { ...booking, expiresAt: booking.status === "PENDING" ? new Date(Date.now() + 30 * 60_000) : null },
      update: { childId: booking.childId, status: booking.status, expiresAt: booking.status === "PENDING" ? new Date(Date.now() + 30 * 60_000) : null },
    });
  }

  for (const circle of circleData) {
    await prisma.circle.upsert({ where: { id: circle.id }, create: circle, update: circle });
  }

  for (const membership of membershipData) {
    await prisma.circleMembership.upsert({
      where: { circleId_userId: { circleId: membership.circleId, userId: membership.userId } },
      create: membership,
      update: { role: membership.role },
    });
  }

  for (const meetup of meetupData) {
    const { schedule, durationMinutes, ...meetupFields } = meetup;
    const startsAt = nextLocalOccurrence(schedule);
    const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);
    await prisma.meetup.upsert({
      where: { id: meetup.id },
      create: { ...meetupFields, startsAt, endsAt },
      update: { ...meetupFields, startsAt, endsAt },
    });
  }

  for (const attendee of meetupAttendeeData) {
    await prisma.meetupAttendee.upsert({
      where: { meetupId_userId: { meetupId: attendee.meetupId, userId: attendee.userId } },
      create: attendee,
      update: { status: attendee.status },
    });
  }

  console.info(
    `Seeded ${userData.length} fictional parents, ${childData.length} children, ${organizerData.length} fictional organizers, ${venueData.length} demo venues, ${activityData.length} activities, ${sessionData.length} sessions, ${circleData.length} sample Circles, and ${meetupData.length} meetups.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Development seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
