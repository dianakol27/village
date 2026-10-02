"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/button-link";

export function ActivityLoadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Village activity page failed to load.", error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f1eee6]/60 px-5 py-12 text-center">
      <div className="max-w-lg rounded-[1.5rem] border border-border/75 bg-card p-6 shadow-[0_18px_48px_-40px_oklch(0.24_0.04_60/50%)] sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A small pause</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.035em] text-foreground">We couldn’t load these activities.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Please try again in a moment. Your filters and place in Village will still be here.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring">
            Try again
          </button>
          <ButtonLink href="/explore" variant="outline">Explore all activities</ButtonLink>
        </div>
        <p className="mt-5 text-xs text-muted-foreground"><Link href="/" className="underline underline-offset-4">Return to Village home</Link></p>
      </div>
    </main>
  );
}
