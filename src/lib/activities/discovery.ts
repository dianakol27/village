import { z } from "zod";

export const experiences = ["kids", "me", "family"] as const;
export type Experience = (typeof experiences)[number];

export const ageGroups = ["baby", "toddler", "preschool", "school"] as const;
export type AgeGroup = (typeof ageGroups)[number];
export type PriceFilter = "free" | "paid";

export type ExploreFilters = {
  experience: Experience;
  category?: string;
  date?: string;
  age?: AgeGroup;
  price?: PriceFilter;
};

export type ExploreSearchParams = Record<string, string | string[] | undefined>;

const categorySlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .optional()
  .catch(undefined);

function isValidDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const filterSchema = z.object({
  experience: z.enum(experiences).catch("kids"),
  category: categorySlugSchema,
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(isValidDate)
    .optional()
    .catch(undefined),
  age: z.enum(ageGroups).optional().catch(undefined),
  price: z.enum(["free", "paid"]).optional().catch(undefined),
});

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Parse URL input into a safe, normalized filter set; invalid optional filters are ignored. */
export function parseExploreFilters(params: ExploreSearchParams): ExploreFilters {
  const parsed = filterSchema.parse({
    experience: firstValue(params.experience),
    category: firstValue(params.category),
    date: firstValue(params.date),
    age: firstValue(params.age),
    price: firstValue(params.price),
  });
  return {
    experience: parsed.experience,
    ...(parsed.category === undefined ? {} : { category: parsed.category }),
    ...(parsed.date === undefined ? {} : { date: parsed.date }),
    ...(parsed.age === undefined ? {} : { age: parsed.age }),
    ...(parsed.price === undefined ? {} : { price: parsed.price }),
  };
}

export function audienceForExperience(experience: Experience) {
  switch (experience) {
    case "kids":
      return "CHILDREN" as const;
    case "me":
      return "PARENTS" as const;
    case "family":
      return "FAMILIES" as const;
  }
}

const ageGroupBounds: Record<AgeGroup, { minMonths: number; maxMonths: number }> = {
  baby: { minMonths: 0, maxMonths: 23 },
  toddler: { minMonths: 24, maxMonths: 47 },
  preschool: { minMonths: 48, maxMonths: 83 },
  school: { minMonths: 84, maxMonths: 155 },
};

export function getAgeGroupBounds(age: AgeGroup) {
  return ageGroupBounds[age];
}

/** True when an activity's age range overlaps the selected family age band. */
export function ageRangeMatches(
  minAgeMonths: number | null,
  maxAgeMonths: number | null,
  age: AgeGroup | undefined,
) {
  if (!age) return true;
  const selected = getAgeGroupBounds(age);
  if (minAgeMonths !== null && minAgeMonths > selected.maxMonths) return false;
  if (maxAgeMonths !== null && maxAgeMonths < selected.minMonths) return false;
  return true;
}

export function priceMatches(priceMinorUnits: number | null, filter: PriceFilter | undefined) {
  if (filter === "free") return priceMinorUnits === 0;
  if (filter === "paid") return priceMinorUnits !== null && priceMinorUnits > 0;
  return true;
}

export function resolveSessionPrice(
  activityPriceMinorUnits: number | null,
  sessionPriceMinorUnitsOverride: number | null,
) {
  return sessionPriceMinorUnitsOverride ?? activityPriceMinorUnits;
}

export type UpcomingSessionLike = { startsAt: Date };

function dateInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function sessionIsOnDate(date: Date, calendarDate: string, timeZone: string) {
  return dateInTimeZone(date, timeZone) === calendarDate;
}

export function selectNextUpcomingSession<T extends UpcomingSessionLike>(
  sessions: readonly T[],
  now: Date,
  options: { date?: string; timeZone: string },
) {
  return (
    sessions
      .filter(
        (session) =>
          session.startsAt > now &&
          (!options.date || sessionIsOnDate(session.startsAt, options.date, options.timeZone)),
      )
      .toSorted((left, right) => left.startsAt.getTime() - right.startsAt.getTime())[0] ?? null
  );
}

/** UTC bounds widened to include every IANA timezone; exact local-day matching happens in JS. */
export function getDateCandidateWindow(date: string) {
  const midnightUtc = new Date(`${date}T00:00:00.000Z`);
  const nextMidnightUtc = new Date(midnightUtc.getTime() + 24 * 60 * 60 * 1000);
  return {
    startsAt: new Date(midnightUtc.getTime() - 14 * 60 * 60 * 1000),
    endsAt: new Date(nextMidnightUtc.getTime() + 12 * 60 * 60 * 1000),
  };
}

export function ageRangeLabel(minAgeMonths: number | null, maxAgeMonths: number | null) {
  if (minAgeMonths === null && maxAgeMonths === null) return "Age guidance not listed";
  const format = (months: number) => {
    const years = Math.floor(months / 12);
    const remainder = months % 12;
    if (years === 0) return `${months} ${months === 1 ? "month" : "months"}`;
    if (remainder === 0) return `${years} ${years === 1 ? "year" : "years"}`;
    return `${years}y ${remainder}m`;
  };
  if (minAgeMonths === null && maxAgeMonths !== null) return `Up to ${format(maxAgeMonths)}`;
  if (maxAgeMonths === null && minAgeMonths !== null) return `From ${format(minAgeMonths)}`;
  if (minAgeMonths === null || maxAgeMonths === null) return "Age guidance not listed";
  return `${format(minAgeMonths)}–${format(maxAgeMonths)}`;
}

export function activitySlug(title: string, id: string) {
  const readable = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${readable}--${id}`;
}

export function activityIdFromSlug(slug: string) {
  const separatorIndex = slug.lastIndexOf("--");
  if (separatorIndex < 1) return null;
  const readable = slug.slice(0, separatorIndex);
  const id = slug.slice(separatorIndex + 2);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(readable)) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  return { readable, id };
}
