import Link from "next/link";
import { ButtonLink } from "@/components/shared/button-link";

export default function ActivityNotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f1eee6]/60 px-5 py-12 text-center">
      <div className="max-w-lg rounded-[1.5rem] border border-border/75 bg-card p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">This page has wandered off</p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.035em] text-foreground">We couldn’t find that activity.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">It may have moved or is no longer available. There are more local ideas to explore.</p>
        <ButtonLink href="/explore" className="mt-6">Explore activities</ButtonLink>
        <p className="mt-5 text-xs text-muted-foreground"><Link href="/" className="underline underline-offset-4">Return to Village home</Link></p>
      </div>
    </main>
  );
}
