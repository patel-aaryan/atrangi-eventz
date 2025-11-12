"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import type { PastEventListItem } from "@/types/event";

interface EventCardProps {
  event: PastEventListItem;
}

export function EventCard({ event }: Readonly<EventCardProps>) {
  const formattedDate = new Date(event.start_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const location = event.venue_name || event.venue_city || "TBA";
  const attendees = event.total_tickets_sold
    ? `${event.total_tickets_sold.toLocaleString()} Attendees`
    : "No attendance data";

  return (
    <div>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3 flex-1">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              {event.description && (
                <p className="text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{attendees}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
