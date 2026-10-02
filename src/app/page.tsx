import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Coffee,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityIllustration } from "@/components/activities/activity-illustration";
import { CircleCard } from "@/components/circles/circle-card";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button-link";
import { MobileProductPreview } from "@/components/shared/mobile-product-preview";
import { SectionHeading } from "@/components/shared/section-heading";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import {
  activityCategories,
  coreExperiences,
  familyPreferences,
  landingActivities,
  localCircle,
  privacyPrinciples,
} from "@/lib/landing-page-data";

const experienceIcons = {
  sparkles: Sparkles,
  coffee: Coffee,
  community: UsersRound,
} as const;

const experienceTones = {
  sage: "bg-[#e5ece2] text-[#315841]",
  clay: "bg-[#f1e4d9] text-[#955b43]",
  sky: "bg-[#e7e9df] text-[#556448]",
} as const;

const principleIcons = [Sparkles, MapPin, HeartHandshake] as const;

function ExperienceSection() {
  return (
    <section id="experiences" className="bg-[#f1eee6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="A little more room for everyone"
          title="Things for them. Time for you. People for both."
          description="Family life has a lot of moving parts. Village brings the good local things a little closer together."
        />
        <div className="mt-9 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
          {coreExperiences.map((experience) => {
            const Icon = experienceIcons[experience.icon];
            const sectionId = experience.id === "parents" ? "for-parents" : undefined;

            return (
              <article
                key={experience.id}
                id={sectionId}
                className="flex h-full flex-col rounded-2xl border border-border/65 bg-card/85 p-5 sm:p-6 lg:p-7"
              >
                <div className={`flex size-11 items-center justify-center rounded-[0.9rem] ${experienceTones[experience.tone]}`}>
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {experience.label}
                </p>
                <h3 className="mt-2.5 max-w-xs font-display text-[1.55rem] leading-[1.12] tracking-[-0.03em] text-foreground">
                  {experience.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {experience.description}
                </p>
                <ul aria-label={`${experience.label} interests`} className="mt-5 flex flex-wrap gap-2">
                  {experience.topics.map((topic) => (
                    <li key={topic}>
                      <Badge tone="outline" className="bg-background/75">{topic}</Badge>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DiscoverySection() {
  return (
    <section id="discover" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="A good place to start"
            title="A few lovely things, just around the corner."
            description="Small plans can make a big difference. Here’s a little of what you might find in your neighborhood."
          />
          <ButtonLink href="/explore" variant="outline" className="w-fit">
            Explore activities <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>

        <ul aria-label="Activity categories" className="mt-7 flex flex-wrap gap-2">
          {activityCategories.map((category, index) => (
            <li key={category.id}>
              <Badge tone={index === 0 ? "green" : "outline"} className="px-3.5 py-1.5 text-[0.75rem]">
                {category.label}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-5">
          {landingActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} featured />
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Example activities shown for illustration. Names and details are fictional.
        </p>
      </div>
    </section>
  );
}

function PersonalizationSection() {
  const suggestion = landingActivities.find(
    (activity) => activity.id === familyPreferences.suggestionId,
  );

  return (
    <section className="overflow-hidden bg-[#e9eee6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
        <div>
          <SectionHeading
            eyebrow="A little more you-shaped"
            title="A good fit for your family, not just a long list."
            description="Village can make it easier to find ideas that suit your children’s interests, your plans, and the time you have."
          />
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-foreground/80">
            <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-success" /> Interests that matter</span>
            <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-success" /> A pace that works</span>
            <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-success" /> Nearby ideas</span>
          </div>
        </div>

        <div aria-label="Example of a personalized Village activity suggestion" className="mx-auto w-full max-w-[39rem] rounded-[1.75rem] border border-[#d3ddd0] bg-card p-4 shadow-[0_26px_60px_-42px_oklch(0.25_0.04_145/55%)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="green" className="mb-3">A more personal kind of discovery</Badge>
              <h3 className="font-display text-2xl leading-tight tracking-[-0.03em] text-foreground sm:text-[1.8rem]">
                What’s your Saturday looking like?
              </h3>
            </div>
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-[#f2e9d8] text-[#8b6943] sm:flex">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f7f5ef] p-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                {familyPreferences.childName} loves
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {familyPreferences.interests.map((interest) => (
                  <li key={interest}><Badge tone="clay">{interest}</Badge></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#f7f5ef] p-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                You are looking for
              </p>
              <p className="mt-2.5 text-sm font-semibold text-foreground">{familyPreferences.activity}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="outline">{familyPreferences.time}</Badge>
                <Badge tone="outline">{familyPreferences.distance}</Badge>
              </div>
            </div>
          </div>

          {suggestion ? (
            <div className="mt-4 flex flex-col overflow-hidden rounded-2xl border border-border/75 bg-card sm:flex-row">
              <ActivityIllustration artwork={suggestion.artwork} className="h-36 w-full shrink-0 sm:h-auto sm:w-40" />
              <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-success">A lovely match for this morning</p>
                <h4 className="mt-1.5 font-display text-xl tracking-[-0.025em] text-foreground">{suggestion.title}</h4>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{suggestion.schedule} <span aria-hidden="true">·</span> {suggestion.distance} <span aria-hidden="true">·</span> {suggestion.price}</p>
              </div>
              <div className="hidden items-center pr-4 sm:flex">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </div>
            </div>
          ) : null}
          <p className="mt-3 text-center text-[0.7rem] text-muted-foreground">
            A visual example of future personalization. No recommendations are generated yet.
          </p>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section id="circles" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-10">
        <div className="order-2 lg:order-1">
          <CircleCard circle={localCircle} />
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="A village of your own"
            title="Because the best plans often start with a hello."
            description="Circles are small local parent communities built around shared interests, nearby places, and the ages your family is in right now."
          />
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-foreground/80">
            <li className="flex items-start gap-3"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"><Check aria-hidden="true" className="size-3.5" /></span>Find parents with children around the same age</li>
            <li className="flex items-start gap-3"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"><Check aria-hidden="true" className="size-3.5" /></span>Meet around the places you already love</li>
            <li className="flex items-start gap-3"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"><Check aria-hidden="true" className="size-3.5" /></span>Turn a familiar face into a familiar friend</li>
          </ul>
          <ButtonLink href="#get-started" variant="outline" className="mt-7">
            Find your circle <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="about" className="bg-[#eee9df] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div id="privacy">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#dce6d9] text-primary">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </div>
            <SectionHeading
              className="mt-5"
              eyebrow="Families deserve thoughtful design"
              title="Connection should feel comfortable."
              description="Village is being designed with families’ everyday privacy in mind. These are the principles guiding the product."
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:gap-4">
            {privacyPrinciples.map((principle, index) => {
              const Icon = principleIcons[index];
              if (!Icon) return null;

              return (
                <li key={principle.title} className="rounded-2xl border border-border/70 bg-card/80 p-5 sm:p-5 lg:p-6">
                  <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.8} />
                  <h3 className="mt-4 text-sm font-bold text-foreground">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{principle.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          These are product principles, not a description of features currently available.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-card px-4 py-3 text-sm font-semibold text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <div id="top">
        <SiteHeader />
      </div>
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-border/70 bg-[#f8f5ed]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-12 size-80 rounded-full border border-[#e1d7c5] sm:right-[5%] sm:top-10 sm:size-[26rem]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-28 size-48 rounded-full border border-[#e1d7c5] sm:right-[13%] sm:top-28 sm:size-64" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:min-h-[42rem] lg:grid-cols-[1fr_0.92fr] lg:gap-12 lg:px-10 lg:py-16">
            <div className="relative z-10 max-w-[38rem]">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#dfd8c8] bg-background/75 px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                <span className="size-1.5 rounded-full bg-[#c7795d]" /> Things for them. Time for you. People for both.
              </p>
              <h1 className="mt-6 max-w-[13ch] font-display text-[2.9rem] leading-[0.99] tracking-[-0.055em] text-foreground sm:mt-7 sm:text-6xl lg:text-[4.45rem]">
                More than activities.<br className="hidden sm:block" /> Build your village.
              </h1>
              <p className="mt-5 max-w-[33rem] font-display text-[1.4rem] leading-snug tracking-[-0.02em] text-primary sm:mt-6 sm:text-[1.65rem]">
                Find things to do. Find your people.
              </p>
              <p className="mt-3 max-w-[32rem] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Discover things your kids will love, find time for yourself, and meet parents nearby.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/explore" className="w-full sm:w-auto">
                  Explore activities <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
                <ButtonLink href="#experiences" variant="outline" className="w-full sm:w-auto">
                  See how it works <ArrowDownRight aria-hidden="true" className="size-4" />
                </ButtonLink>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5 text-success" /> Made for real family days</span>
                <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5 text-success" /> Local by nature</span>
              </div>
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[25rem] lg:max-w-[27rem]">
              <div aria-hidden="true" className="absolute -left-8 top-[16%] hidden size-16 items-center justify-center rounded-2xl bg-[#dce7d9] text-primary shadow-sm sm:flex">
                <Sparkles className="size-6" />
              </div>
              <div aria-hidden="true" className="absolute -right-7 bottom-[18%] hidden size-14 items-center justify-center rounded-full bg-[#eed9cc] text-[#985c43] shadow-sm sm:flex">
                <HeartHandshake className="size-6" />
              </div>
              <MobileProductPreview />
              <p className="mt-4 text-center text-[0.68rem] font-medium tracking-[0.02em] text-muted-foreground">
                A little look at what a Village day could feel like
              </p>
            </div>
          </div>
        </section>

        <ExperienceSection />
        <DiscoverySection />
        <PersonalizationSection />
        <CommunitySection />
        <TrustSection />

        <section id="get-started" className="relative isolate overflow-hidden bg-[#284735] py-16 text-background sm:py-20 lg:py-24">
          <div aria-hidden="true" className="absolute -right-10 -top-24 size-72 rounded-full border border-background/10 sm:right-[8%] sm:size-96" />
          <div aria-hidden="true" className="absolute -right-2 -top-16 size-52 rounded-full border border-background/10 sm:right-[14%] sm:size-72" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 sm:px-8 md:flex-row md:items-end lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d9b77d]">Your people are out there</p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-[-0.04em] text-background sm:text-5xl lg:text-[3.5rem]">
                Your village might be closer than you think.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-background/75 sm:text-lg sm:leading-8">
                Start with one small plan. See where it takes you.
              </p>
            </div>
            <ButtonLink href="/explore" variant="light" className="shrink-0">
              Start exploring <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
