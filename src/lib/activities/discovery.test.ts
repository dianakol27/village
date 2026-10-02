import { describe, expect, it } from "vitest";
import {
  activityIdFromSlug,
  activitySlug,
  ageRangeMatches,
  audienceForExperience,
  getDateCandidateWindow,
  parseExploreFilters,
  priceMatches,
  resolveSessionPrice,
  selectNextUpcomingSession,
} from "./discovery";

describe("explore filter parsing", () => {
  it("normalizes supported URL parameters and uses the first repeated value", () => {
    expect(parseExploreFilters({
      experience: ["me", "family"],
      category: " ART-MAKING ",
      date: "2026-10-02",
      age: "preschool",
      price: "free",
    })).toEqual({
      experience: "me",
      category: "art-making",
      date: "2026-10-02",
      age: "preschool",
      price: "free",
    });
  });

  it("falls back safely when filter values are invalid", () => {
    expect(parseExploreFilters({
      experience: "villagers",
      category: "art/making",
      date: "2026-02-30",
      age: "newborn",
      price: "cheap",
    })).toEqual({ experience: "kids" });
  });

  it("maps the three product experiences onto the persisted activity audiences", () => {
    expect(audienceForExperience("kids")).toBe("CHILDREN");
    expect(audienceForExperience("me")).toBe("PARENTS");
    expect(audienceForExperience("family")).toBe("FAMILIES");
  });
});

describe("activity age and price compatibility", () => {
  it("matches intersecting ranges and treats absent age guidance as unspecified", () => {
    expect(ageRangeMatches(48, 83, "preschool")).toBe(true);
    expect(ageRangeMatches(84, 155, "preschool")).toBe(false);
    expect(ageRangeMatches(null, 47, "toddler")).toBe(true);
    expect(ageRangeMatches(48, null, "school")).toBe(true);
    expect(ageRangeMatches(null, null, "baby")).toBe(true);
    expect(ageRangeMatches(48, 83, undefined)).toBe(true);
  });

  it("separates free, paid, and unknown prices without treating unknown as paid", () => {
    expect(priceMatches(0, "free")).toBe(true);
    expect(priceMatches(1_200, "free")).toBe(false);
    expect(priceMatches(1_200, "paid")).toBe(true);
    expect(priceMatches(null, "paid")).toBe(false);
    expect(priceMatches(null, undefined)).toBe(true);
  });

  it("uses a session price override for display and free/paid matching", () => {
    const freeOverride = resolveSessionPrice(1_200, 0);
    const inheritedPaid = resolveSessionPrice(1_200, null);
    expect(freeOverride).toBe(0);
    expect(priceMatches(freeOverride, "free")).toBe(true);
    expect(priceMatches(freeOverride, "paid")).toBe(false);
    expect(inheritedPaid).toBe(1_200);
    expect(priceMatches(inheritedPaid, "paid")).toBe(true);
  });
});

describe("upcoming session selection", () => {
  const now = new Date("2026-10-02T10:00:00.000Z");
  const sessions = [
    { id: "past", startsAt: new Date("2026-10-02T09:59:00.000Z") },
    { id: "later", startsAt: new Date("2026-10-04T10:00:00.000Z") },
    { id: "next", startsAt: new Date("2026-10-02T12:00:00.000Z") },
    { id: "amsterdam-same-day", startsAt: new Date("2026-10-01T22:30:00.000Z") },
  ];

  it("selects the earliest future session, not the first unsorted item", () => {
    expect(selectNextUpcomingSession(sessions, now, { timeZone: "Europe/Amsterdam" })?.id).toBe("next");
  });

  it("selects the earliest future session on the requested local calendar date", () => {
    expect(selectNextUpcomingSession(sessions, now, {
      date: "2026-10-02",
      timeZone: "Europe/Amsterdam",
    })?.id).toBe("next");
  });

  it("uses the activity timezone when a local day begins on the previous UTC date", () => {
    expect(selectNextUpcomingSession(sessions, new Date("2026-10-01T21:00:00.000Z"), {
      date: "2026-10-02",
      timeZone: "Europe/Amsterdam",
    })?.id).toBe("amsterdam-same-day");
  });

  it("returns null when nothing upcoming matches the selected day", () => {
    expect(selectNextUpcomingSession(sessions, now, {
      date: "2026-10-03",
      timeZone: "Europe/Amsterdam",
    })).toBeNull();
  });

  it("widens UTC candidate bounds for sessions around local midnight", () => {
    const window = getDateCandidateWindow("2026-10-02");
    expect(window.startsAt.toISOString()).toBe("2026-10-01T10:00:00.000Z");
    expect(window.endsAt.toISOString()).toBe("2026-10-03T12:00:00.000Z");
  });
});

describe("readable activity route slugs", () => {
  it("keeps a readable title while preserving the exact activity id", () => {
    const slug = activitySlug("Little Makers Art Morning", "activity-little-makers");
    expect(slug).toBe("little-makers-art-morning--activity-little-makers");
    expect(activityIdFromSlug(slug)).toEqual({
      readable: "little-makers-art-morning",
      id: "activity-little-makers",
    });
  });

  it("rejects malformed slugs", () => {
    expect(activityIdFromSlug("not-an-activity")).toBeNull();
    expect(activityIdFromSlug("friendly-title--id/../other")).toBeNull();
  });
});
