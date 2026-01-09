"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/api/events";
import {
  EventHero,
  EventGallery,
  EventDetailSkeleton,
  EventNotFound,
} from "@/components/event-detail";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => getEventBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) return <EventDetailSkeleton />;

  if (error || !data) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    return <EventNotFound message={errorMessage} />;
  }

  const { event, images } = data;

  // Find banner image from gallery
  const bannerImage = images.find((img) =>
    img.name.toLowerCase().includes("banner")
  );

  // Filter out banner from gallery display
  const galleryImages = images.filter(
    (img) => !img.name.toLowerCase().includes("banner")
  );

  return (
    <div className="min-h-screen">
      <EventHero event={event} bannerUrl={bannerImage?.url} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {galleryImages.length > 0 && (
          <EventGallery images={galleryImages} eventTitle={event.title} />
        )}
      </div>
    </div>
  );
}
