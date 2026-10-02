import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin, UsersRound } from "lucide-react";
import { ActivityIllustration } from "@/components/activities/activity-illustration";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button-link";
import {
  ageGroups,
  type AgeGroup,
  type Experience,
  type ExploreFilters,
} from "@/lib/activities/discovery";
import type {
  ActivityCategoryOption,
  ActivitySummary,
  SessionSummary,
} from "@/lib/activities/queries";

const experienceOptions: { value: Experience; label: string; description: string }[] = [
  { value: "kids", label: "For kids", description: "Little adventures and new interests" },
  { value: "me", label: "For me", description: "A little room for your own plans" },
  { value: "family", label: "Family", description: "Good things to do together" },
];

const ageOptions: { value: AgeGroup; label: string }[] = [
  { value: "baby", label: "Under 2 years" },
  { value: "toddler", label: "2–3 years" },
  { value: "preschool", label: "4–6 years" },
  { value: "school", label: "7–12 years" },
];

function hrefForExperience(experience: Experience, filters: ExploreFilters) {
  const params = new URLSearchParams({ experience });
  if (filters.category) params.set("category", filters.category);
  if (filters.date) params.set("date", filters.date);
  if (filters.age) params.set("age", filters.age);
  if (filters.price) params.set("price", filters.price);
  return `/explore?${params.toString()}`;
}

export function ExperienceSwitcher({ filters }: { filters: ExploreFilters }) {
  return (
    <nav aria-label="Choose an activity experience" className="grid grid-cols-3 gap-2 rounded-2xl border border-border/75 bg-card/70 p-2">
      {experienceOptions.map((option) => {
        const selected = filters.experience === option.value;
        return (
          <Link
            key={option.value}
            href={hrefForExperience(option.value, filters)}
            aria-current={selected ? "page" : undefined}
            className={`rounded-xl px-2 py-3 text-center transition-colors sm:px-4 sm:py-3.5 ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-secondary"}`}
          >
            <span className="block text-sm font-semibold sm:text-base">{option.label}</span>
            <span className={`mt-1 hidden text-xs leading-5 sm:block ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
              {option.description}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function ActivityFilters({
  filters,
  categories,
}: {
  filters: ExploreFilters;
  categories: ActivityCategoryOption[];
}) {
  return (
    <form action="/explore" method="get" className="rounded-2xl border border-border/75 bg-card p-4 shadow-[0_12px_35px_-32px_oklch(0.24_0.04_60/50%)] sm:p-5">
      <input type="hidden" name="experience" value={filters.experience} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-end">
        <label className="grid gap-1.5 text-xs font-semibold text-foreground/85">
          Category
          <select
            name="category"
            defaultValue={filters.category ?? ""}
            className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-semibold text-foreground/85">
          Date
          <input
            type="date"
            name="date"
            defaultValue={filters.date ?? ""}
            className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="grid gap-1.5 text-xs font-semibold text-foreground/85">
          Child age
          <select
            name="age"
            defaultValue={filters.age ?? ""}
            className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Any age</option>
            {ageOptions.filter((option) => ageGroups.includes(option.value)).map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-semibold text-foreground/85">
          Price
          <select
            name="price"
            defaultValue={filters.price ?? ""}
            className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Any price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </label>

        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring">
          Apply filters
        </button>
      </div>
      <div className="mt-3 flex justify-end">
        <Link href={`/explore?experience=${filters.experience}`} className="rounded-sm text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          Clear filters
        </Link>
      </div>
    </form>
  );
}

function experienceLabel(audience: ActivitySummary["audience"]) {
  if (audience === "CHILDREN") return "For kids";
  if (audience === "PARENTS") return "For parents";
  return "For families";
}

function artworkForCategory(categorySlug: string) {
  if (["art-making", "science"].includes(categorySlug)) return "makers" as const;
  if (["wellbeing", "family-days"].includes(categorySlug)) return "yoga" as const;
  return "forest" as const;
}

export function formatPrice(priceMinorUnits: number | null, currencyCode: string) {
  if (priceMinorUnits === null) return "Price to be confirmed";
  if (priceMinorUnits === 0) return "Free";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(priceMinorUnits / 100);
  } catch {
    return `${(priceMinorUnits / 100).toFixed(2)} ${currencyCode}`;
  }
}

export function formatSessionDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(date);
}

function sessionAvailability(session: SessionSummary) {
  if (session.capacity === null) return "Capacity not listed";
  if (session.placesRemaining === 0) return "Currently full";
  return `${session.placesRemaining} ${session.placesRemaining === 1 ? "place" : "places"} left`;
}

export function ExploreActivityCard({ activity }: { activity: ActivitySummary }) {
  const session = activity.nextSession;
  if (!session) return null;
  const ageOrWelcome = activity.audience === "PARENTS"
    ? activity.childrenWelcome ? "Little ones welcome" : "Adults only"
    : activity.ageLabel;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/75 bg-card shadow-[0_12px_35px_-30px_oklch(0.24_0.04_60/50%)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_oklch(0.24_0.04_60/45%)]">
      <div className="relative overflow-hidden">
        <ActivityIllustration artwork={artworkForCategory(activity.categorySlug)} className="block h-40 w-full transition-transform duration-300 group-hover:scale-[1.025] sm:h-44" />
        <Badge tone={activity.audience === "FAMILIES" ? "clay" : "green"} className="absolute left-4 top-4 border border-white/55 shadow-sm">
          {experienceLabel(activity.audience)}
        </Badge>
        <Badge tone="outline" className="absolute right-4 top-4 border-white/70 bg-card/90">
          {activity.categoryName}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-muted-foreground">With {activity.organizerName}</p>
        <h2 className="mt-1.5 font-display text-[1.4rem] leading-tight tracking-[-0.025em] text-foreground">
          <Link href={`/activities/${activity.slug}`} className="rounded-sm after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            {activity.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{activity.description}</p>

        <div className="mt-4 grid gap-2 text-sm font-medium text-foreground/85">
          <span className="inline-flex items-start gap-2">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.8} />
            <span>{formatSessionDate(session.startsAt, activity.timeZone)}</span>
          </span>
          <span className="inline-flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.8} />
            <span>{session.venue ? `${session.venue.name} · ${session.venue.city}` : "Venue to be confirmed"}</span>
          </span>
          {activity.audience === "PARENTS" ? (
            <span className="inline-flex items-start gap-2">
              <UsersRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.8} />
              <span>{ageOrWelcome}</span>
            </span>
          ) : (
            <span className="inline-flex items-start gap-2">
              <UsersRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.8} />
              <span>{ageOrWelcome}</span>
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4 mt-5">
          <div>
            <p className="text-xs text-muted-foreground">Next session</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{sessionAvailability(session)}</p>
          </div>
          <p className="shrink-0 text-sm font-bold text-foreground">{formatPrice(session.priceMinorUnits, activity.currencyCode)}</p>
          <span className="sr-only">View activity details</span>
        </div>
      </div>
    </article>
  );
}

export function ActivitySessionList({ activity }: { activity: ActivitySummary }) {
  if (activity.sessions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/70 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Dates are on their way</p>
        <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground">No upcoming sessions just yet.</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          This activity is part of Village, but its next dates have not been posted. Check back soon or explore another local idea.
        </p>
        <ButtonLink href="/explore" variant="outline" className="mt-5">
          Back to explore <ArrowRight aria-hidden="true" className="size-4" />
        </ButtonLink>
      </section>
    );
  }

  return (
    <section aria-labelledby="upcoming-sessions" className="grid gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Make a little plan</p>
        <h2 id="upcoming-sessions" className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground sm:text-3xl">Upcoming sessions</h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {activity.sessions.map((session) => (
          <li key={session.id} className="rounded-2xl border border-border/75 bg-card p-4 sm:p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock3 aria-hidden="true" className="size-4 text-primary" />
              {formatSessionDate(session.startsAt, activity.timeZone)}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              {session.venue ? `${session.venue.name}, ${session.venue.addressLine1}, ${session.venue.city}` : "Venue to be confirmed"}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-sm">
              <span className="font-medium text-foreground">{sessionAvailability(session)}</span>
              <span className="font-bold text-foreground">{formatPrice(session.priceMinorUnits, activity.currencyCode)}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ActivityDetail({ activity }: { activity: ActivitySummary }) {
  const ageOrWelcome = activity.audience === "PARENTS"
    ? activity.childrenWelcome ? "Little ones welcome" : "Adults only"
    : activity.ageLabel;

  return (
    <>
      <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-12">
        <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-[0_22px_60px_-45px_oklch(0.25_0.04_145/50%)]">
          <ActivityIllustration artwork={artworkForCategory(activity.categorySlug)} className="block h-52 w-full sm:h-72" />
          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge tone={activity.audience === "FAMILIES" ? "clay" : "green"}>{experienceLabel(activity.audience)}</Badge>
              <Badge tone="outline">{activity.categoryName}</Badge>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.5rem]">
              {activity.title}
            </h1>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">By {activity.organizerName}</p>
            <p className="mt-5 whitespace-pre-line text-base leading-7 text-foreground/80">{activity.description}</p>
          </div>
        </div>

        <aside className="grid gap-3 rounded-[1.5rem] border border-border/75 bg-card p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Good to know</p>
            <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground">The little details</h2>
          </div>
          <dl className="grid gap-3 text-sm">
            <div className="flex items-start justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="text-muted-foreground">Age</dt><dd className="text-right font-semibold text-foreground">{ageOrWelcome}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="text-muted-foreground">Typical price</dt><dd className="text-right font-semibold text-foreground">{formatPrice(activity.priceMinorUnits, activity.currencyCode)}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="text-muted-foreground">Venue</dt><dd className="max-w-[65%] text-right font-semibold text-foreground">{activity.venue ? `${activity.venue.name}, ${activity.venue.city}` : "Shared with each session"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="text-muted-foreground">Organized by</dt><dd className="max-w-[65%] text-right font-semibold text-foreground">{activity.organizerName}</dd>
            </div>
          </dl>
          {activity.interests.length ? (
            <div className="border-t border-border/70 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Interests</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {activity.interests.map((interest) => <li key={interest.slug}><Badge tone="clay">{interest.name}</Badge></li>)}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-10 sm:mt-14">
        <ActivitySessionList activity={activity} />
      </div>
      <div className="mt-8">
        <Link href="/explore" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-primary hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring">
          Back to all activities <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </>
  );
}
