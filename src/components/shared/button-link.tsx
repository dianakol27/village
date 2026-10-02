import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "quiet" | "light";
  size?: "default" | "small";
  className?: string;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_6px_18px_-10px_oklch(0.3_0.06_150/55%)] hover:bg-primary/90",
  outline:
    "border border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary/55",
  quiet: "bg-transparent text-foreground hover:bg-secondary/70",
  light: "bg-background text-primary hover:bg-background/90",
} as const;

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  size = "default",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
        size === "small" && "min-h-10 rounded-lg px-4 text-[0.8125rem]",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
