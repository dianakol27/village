import { CalendarDays, ChevronRight, MapPin, Sparkles, UsersRound } from "lucide-react";
import { landingActivities, localCircle, parentActivities } from "@/lib/landing-page-data";
import { ActivityIllustration } from "@/components/activities/activity-illustration";
import { Badge } from "@/components/shared/badge";

export function MobileProductPreview() {
  const kidsActivity = landingActivities[0];
  const parentActivity = parentActivities[0];

  if (!kidsActivity || !parentActivity) return null;

  return (
    <div className="relative mx-auto w-full max-w-[22rem] rotate-[1deg] rounded-[2.35rem] bg-[#26362d] p-[0.45rem] shadow-[0_34px_75px_-35px_oklch(0.19_0.04_65/62%)] sm:max-w-[23rem]">
      <div className="overflow-hidden rounded-[1.95rem] bg-[#fbfaf7]">
        <div className="flex h-8 items-center justify-center bg-[#fbfaf7]">
          <span className="h-1 w-14 rounded-full bg-[#d5d2c9]" />
        </div>
        <div className="px-4 pb-5 pt-1 sm:px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Saturday, 24 May
              </p>
              <p className="mt-1 font-display text-xl font-semibold tracking-[-0.035em] text-foreground">
                Good morning, Sarah
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#e6ece2] text-primary">
              <span className="font-display text-sm font-semibold">S</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">For Emma</h2>
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-primary">
              See all <ChevronRight aria-hidden="true" className="size-3.5" />
            </span>
          </div>
          <article className="mt-2 flex gap-3 rounded-2xl border border-border/80 bg-card p-2.5 shadow-sm">
            <ActivityIllustration artwork={kidsActivity.artwork} className="h-[5.35rem] w-[5.25rem] shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 py-0.5">
              <Badge tone="green" className="px-2 py-0 text-[0.6rem] leading-[1.2rem]">For kids</Badge>
              <h3 className="mt-1 truncate text-[0.8rem] font-bold leading-5 text-foreground">{kidsActivity.title}</h3>
              <p className="mt-0.5 text-[0.68rem] font-medium text-muted-foreground">Saturday, 10:30</p>
              <p className="mt-1 text-[0.68rem] text-foreground/80">Ages 3–6 <span aria-hidden="true">·</span> <strong>{kidsActivity.price}</strong></p>
            </div>
          </article>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">For you</h2>
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-primary">
              See all <ChevronRight aria-hidden="true" className="size-3.5" />
            </span>
          </div>
          <article className="mt-2 flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e4ebe2] text-primary">
              <Sparkles aria-hidden="true" className="size-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[0.8rem] font-bold leading-5 text-foreground">Morning Run & Coffee</h3>
              <p className="mt-0.5 text-[0.68rem] text-muted-foreground">Thursday, 09:30 · Kids welcome</p>
            </div>
            <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          </article>

          <article className="mt-4 overflow-hidden rounded-2xl bg-[#e8eee6] p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[0.67rem] font-bold uppercase tracking-[0.11em] text-primary">
                <UsersRound aria-hidden="true" className="size-3.5" /> Nearby Circle
              </div>
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-[0.8rem] font-bold text-foreground">{localCircle.name}</h3>
                <p className="mt-1 text-[0.68rem] text-muted-foreground">{localCircle.memberCount} members · Meet nearby</p>
              </div>
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="size-7 rounded-full border-2 border-[#e8eee6] bg-[#c98268]" />
                <span className="size-7 rounded-full border-2 border-[#e8eee6] bg-[#8b9c76]" />
                <span className="size-7 rounded-full border-2 border-[#e8eee6] bg-[#d8b66e]" />
              </div>
            </div>
          </article>

          <div className="mt-4 flex items-center justify-around border-t border-border pt-3 text-[0.62rem] font-semibold text-muted-foreground">
            <span className="text-primary">Discover</span>
            <span>Saved</span>
            <span>My village</span>
            <MapPin aria-hidden="true" className="size-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
