import type { Metadata } from "next";
import { ActivityDetail } from "@/components/activities/activity-browser";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { notFound } from "next/navigation";
import { getActivityDetails } from "@/lib/activities/queries";

export const metadata: Metadata = {
  title: "Activity details | Village",
  description: "See activity details and upcoming sessions on Village.",
};

type ActivityPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = await getActivityDetails(slug);
  if (!activity) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader product />
      <main className="bg-[#f1eee6]/60 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <ActivityDetail activity={activity} />
        </div>
      </main>
      <SiteFooter product />
    </div>
  );
}
