import type { Metadata } from "next";
import { ArrowDown, Leaf } from "lucide-react";
import { ActivityFilters, ExperienceSwitcher, ExploreActivityCard } from "@/components/activities/activity-browser";
import { ButtonLink } from "@/components/shared/button-link";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { parseExploreFilters, type ExploreSearchParams } from "@/lib/activities/discovery";
import { getActivityCategories, getExploreActivities } from "@/lib/activities/queries";

export const metadata: Metadata = {
  title: "Explore local activities | Village",
  description: "Find thoughtful activities for your children, yourself, and your family, close to home.",
};

type ExplorePageProps = {
  searchParams: Promise<ExploreSearchParams>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const filters = parseExploreFilters(await searchParams);
  const [categories, activities] = await Promise.all([
    getActivityCategories(),
    getExploreActivities(filters),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader product />
      <main>
        <section className="bg-[#f1eee6] pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pt-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-primary">
                <Leaf aria-hidden="true" className="size-4" /> A good place to start
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.04] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.65rem]">
                Find a little something <span className="text-primary">close to home.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Art mornings, fresh air, a good stretch, or a new family tradition. Start with what sounds right for you today.
              </p>
            </div>

            <div className="mt-7 max-w-4xl sm:mt-9">
              <ExperienceSwitcher filters={filters} />
            </div>
            <div className="mt-4 max-w-7xl">
              <ActivityFilters filters={filters} categories={categories} />
            </div>
            <a href="#activity-results" className="mt-5 inline-flex items-center gap-2 rounded-sm text-xs font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              See what’s coming up <ArrowDown aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </section>

        <section id="activity-results" className="scroll-mt-6 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A little inspiration</p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.035em] text-foreground sm:text-4xl">
                  {activities.length ? "Coming up nearby" : "A quieter week, perhaps?"}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {activities.length} {activities.length === 1 ? "activity" : "activities"} to explore
              </p>
            </div>

            {activities.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {activities.map((activity) => <ExploreActivityCard key={activity.id} activity={activity} />)}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-[#f1eee6]/75 px-5 py-10 text-center sm:px-10 sm:py-14">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#e5ece2] text-primary">
                  <Leaf aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-2xl tracking-[-0.03em] text-foreground">No activities match those filters yet.</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Try another day or age group, or clear the filters to see more local ideas.
                </p>
                <ButtonLink href={`/explore?experience=${filters.experience}`} variant="outline" className="mt-5">
                  Clear filters
                </ButtonLink>
              </div>
            )}

          </div>
        </section>
      </main>
      <SiteFooter product />
    </div>
  );
}
