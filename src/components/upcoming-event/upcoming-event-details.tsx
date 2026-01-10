"use client";

import { motion } from "framer-motion";
import { Info, MapPin, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UpcomingEventItem } from "@/types/event";

interface UpcomingEventDetailsProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventDetails({ event }: UpcomingEventDetailsProps) {
  const hasVenueDetails = event.venue_name || event.venue_city;

  return (
    <motion.section
      id="details"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Event Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Venue Information */}
        {hasVenueDetails && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Venue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {event.venue_name && (
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-semibold">{event.venue_name}</p>
                    {event.venue_city && (
                      <p className="text-sm text-muted-foreground">
                        {event.venue_city}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Capacity Information */}
        {event.total_capacity && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-pink-500" />
                Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Capacity</span>
                  <span className="font-bold text-lg">
                    {event.total_capacity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Tickets Available
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {event.tickets_remaining}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-2.5 mt-3">
                  <div
                    className="bg-gradient-to-r from-primary to-pink-500 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${((event.total_capacity - event.tickets_remaining) / event.total_capacity) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {Math.round(
                    ((event.total_capacity - event.tickets_remaining) /
                      event.total_capacity) *
                      100
                  )}
                  % sold
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full Description */}
      {event.description && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>About This Event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </CardContent>
        </Card>
      )}
    </motion.section>
  );
}
