"use client";

import { ActivityLoadError } from "@/components/activities/activity-load-error";

export default function ActivityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ActivityLoadError error={error} reset={reset} />;
}
