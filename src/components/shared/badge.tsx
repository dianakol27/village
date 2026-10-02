import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "green" | "clay" | "outline";
  className?: string;
};

const tones = {
  neutral: "bg-secondary text-secondary-foreground",
  green: "bg-success/10 text-success",
  clay: "bg-accent/50 text-accent-foreground",
  outline: "border border-border bg-card/70 text-muted-foreground",
} as const;

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold leading-5 tracking-[0.01em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
