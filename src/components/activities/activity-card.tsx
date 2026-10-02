import { Clock3, MapPin } from "lucide-react";
import type { LandingActivity } from "@/lib/landing-page-data";
import { ActivityIllustration } from "@/components/activities/activity-illustration";
import { Badge } from "@/components/shared/badge";

type ActivityCardProps = {
  activity: LandingActivity;
  featured?: boolean;
};

export function ActivityCard({ activity, featured = false }: ActivityCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/75 bg-card shadow-[0_12px_35px_-30px_oklch(0.24_0.04_60/50%)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_oklch(0.24_0.04_60/45%)]">
      <div className="relative overflow-hidden">
        <ActivityIllustration
          artwork={activity.artwork}
          className={`block w-full transition-transform duration-300 group-hover:scale-[1.025] ${featured ? "h-48 sm:h-52" : "h-36"}`}
        />
        <Badge
          tone={activity.audience === "Together" ? "clay" : "green"}
          className="absolute left-4 top-4 border border-white/55 shadow-sm"
        >
          {activity.audience}
        </Badge>
        <Badge tone="outline" className="absolute right-4 top-4 border-white/70 bg-card/90">
          {activity.category}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-5">
        <h3 className="font-display text-[1.35rem] leading-tight tracking-[-0.025em] text-foreground">
          {activity.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{activity.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-foreground/85">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="size-4 text-primary" strokeWidth={1.8} />
            {activity.schedule}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-4 text-primary" strokeWidth={1.8} />
            {activity.distance}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4 text-sm">
          <span className="text-muted-foreground">{activity.ageRange}</span>
          <span className="font-semibold text-foreground">{activity.price}</span>
        </div>
      </div>
    </article>
  );
}
