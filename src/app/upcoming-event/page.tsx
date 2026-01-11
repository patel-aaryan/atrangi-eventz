"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUpcomingEvent } from "@/lib/api/events";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import {
  UpcomingEventDetails,
  UpcomingEventRules,
  UpcomingEventTicketsCTA,
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event("resetSection");
    globalThis.dispatchEvent(resetEvent);
  }, []);

  if (isLoading) {
    return <UpcomingEventSkeleton />;
  }

  if (error || !event) {
    return <UpcomingEventEmptyState />;
  }

  // Format date
  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use banner image or fallback to a default
  const mediaImage =
    event.banner_image_url ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1280&auto=format&fit=crop";

  const bgImage =
    event.banner_image_url ||
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={mediaImage}
        bgImageSrc={bgImage}
        title={event.title}
        date={formattedDate}
        scrollToExpand="Scroll to Explore"
        textBlend={false}
      >
        <div className="space-y-16">
          <UpcomingEventDetails event={event} />
          <UpcomingEventRules event={event} />
          <UpcomingEventTicketsCTA event={event} />
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
