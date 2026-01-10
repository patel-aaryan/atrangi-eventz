"use client";

import { useQuery } from "@tanstack/react-query";
import { getUpcomingEvent } from "@/lib/api/events";
import {
  UpcomingEventHero,
  UpcomingEventDetails,
  UpcomingEventRules,
  UpcomingEventEmptyState,
  UpcomingEventSkeleton,
} from "@/components/upcoming-event";

export default function UpcomingEventPage() {
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upcoming-event"],
    queryFn: getUpcomingEvent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <UpcomingEventSkeleton />;
  }

  if (error || !event) {
    return <UpcomingEventEmptyState />;
  }

  return (
    <div className="min-h-screen">
      <UpcomingEventHero event={event} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <UpcomingEventDetails event={event} />
        <UpcomingEventRules event={event} />
      </div>
    </div>
  );
}
