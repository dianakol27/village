import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import type { LandingCircle } from "@/lib/landing-page-data";
import { Badge } from "@/components/shared/badge";

type CircleCardProps = {
  circle: LandingCircle;
};

const avatarColors = ["bg-[#d79a7f]", "bg-[#899b7a]", "bg-[#d7b76f]", "bg-[#9b8799]"] as const;

export function CircleCard({ circle }: CircleCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border/75 bg-card shadow-[0_20px_50px_-38px_oklch(0.2_0.02_65/45%)]">
      <div className="relative flex min-h-40 items-center justify-center overflow-hidden bg-[#e6ece2] p-6">
        <div aria-hidden="true" className="absolute size-52 rounded-full border border-[#a8baa1]/70" />
        <div aria-hidden="true" className="absolute size-36 rounded-full border border-[#a8baa1]/70" />
        <div aria-hidden="true" className="absolute size-20 rounded-full bg-[#d5e0d0]" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-white/70 bg-card/90 px-4 py-3 shadow-sm">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UsersRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">A little circle, close by</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Made for everyday hellos</p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[1.45rem] leading-tight tracking-[-0.03em] text-foreground">{circle.name}</h3>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4 text-primary" /> {circle.neighborhood}
            </p>
          </div>
          <Badge tone="green">Ages 3–5</Badge>
        </div>
        <div className="mt-5 flex items-center justify-between border-y border-border/70 py-4">
          <div>
            <p className="text-sm font-bold text-foreground">{circle.memberCount} local parents</p>
            <p className="mt-1 text-xs text-muted-foreground">{circle.ageRange}</p>
          </div>
          <div aria-hidden="true" className="flex -space-x-2">
            {avatarColors.map((color) => (
              <span
                key={color}
                className={`flex size-9 items-center justify-center rounded-full border-[3px] border-card ${color}`}
              >
                <span className="size-2 rounded-full bg-white/70" />
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-secondary/65 p-3.5">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
            <CalendarDays aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Next meetup</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{circle.meetupName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{circle.meetupTime}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
