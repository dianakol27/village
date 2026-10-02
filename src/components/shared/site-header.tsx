import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { VillageMark } from "@/components/shared/village-mark";

const landingNavigation = [
  { label: "Explore", href: "/explore" },
  { label: "For Parents", href: "#for-parents" },
  { label: "Circles", href: "#circles" },
  { label: "About", href: "#about" },
] as const;

const productNavigation = [
  { label: "Explore", href: "/explore" },
  { label: "How Village works", href: "/#experiences" },
  { label: "Our approach", href: "/#about" },
] as const;

export function SiteHeader({ product = false }: { product?: boolean }) {
  const navigation = product ? productNavigation : landingNavigation;
  const homeHref = product ? "/" : "#top";
  const exploreHref = product ? "/explore" : "#discover";

  return (
    <header className="relative z-20 border-b border-border/70 bg-background">
      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href={homeHref} aria-label="Village home" className="shrink-0 rounded-lg">
          <VillageMark />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {!product ? (
            <Link
              href="#get-started"
              className="rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Log in
            </Link>
          ) : null}
          <ButtonLink href={exploreHref} size="small">
            {product ? "Browse activities" : "Get started"} <ArrowUpRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ButtonLink href={product ? "/explore" : "#get-started"} size="small" className="min-h-10 px-3.5">
            {product ? "Explore" : "Get started"}
          </ButtonLink>
          <details className="group relative">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-card text-foreground [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Toggle navigation menu</span>
              <Menu aria-hidden="true" className="size-5 group-open:hidden" />
              <X aria-hidden="true" className="hidden size-5 group-open:block" />
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-12 w-[min(19rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-card p-3 shadow-[0_18px_50px_-25px_oklch(0.2_0.02_65/45%)]"
            >
              <div className="grid gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3.5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {!product ? (
                <div className="mt-2 border-t border-border px-1 pt-2">
                  <Link
                    href="#get-started"
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Log in
                  </Link>
                </div>
              ) : null}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
