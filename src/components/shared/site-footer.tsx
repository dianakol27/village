import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VillageMark } from "@/components/shared/village-mark";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Explore activities", href: "/explore" },
      { label: "For parents", href: "#for-parents" },
      { label: "How it works", href: "#experiences" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Circles", href: "#circles" },
      { label: "Our approach", href: "#about" },
    ],
  },
  {
    title: "Village",
    links: [
      { label: "About us", href: "#about" },
      { label: "Privacy principles", href: "#privacy" },
    ],
  },
] as const;

export function SiteFooter({ product = false }: { product?: boolean }) {
  return (
    <footer id="footer" className="bg-[#243c30] text-background">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid gap-10 border-b border-background/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-12">
          <div className="max-w-xs">
            <Link href={product ? "/" : "#top"} aria-label="Village home" className="inline-flex rounded-lg">
              <VillageMark light />
            </Link>
            <p className="mt-4 text-sm leading-6 text-background/70">
              A little more local connection for the whole family.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-background">{group.title}</h2>
              <ul className="mt-4 grid gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={product ? (link.href.startsWith("/") ? link.href : `/${link.href}`) : link.href}
                      className="inline-flex items-center gap-1.5 rounded-sm text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {link.label}
                      {link.label === "About us" ? (
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pt-6 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Built with care for modern families.</p>
          <p>© {new Date().getFullYear()} Village</p>
        </div>
      </div>
    </footer>
  );
}
