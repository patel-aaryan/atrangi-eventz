"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Heart,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EventDetail } from "@/types/event";

interface EventHeroProps {
  event: EventDetail;
  bannerUrl?: string | null;
}

export function EventHero({ event, bannerUrl }: Readonly<EventHeroProps>) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedStartTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedEndTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const fullAddress = [
    event.venue_name,
    event.venue_address,
    event.venue_city,
    event.venue_province,
    event.venue_postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  const isCompleted = event.status === "completed";
  const isCancelled = event.status === "cancelled";

  return (
    <section className="relative min-h-[60vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        {bannerUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bannerUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-pink-500/20" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Status Badge */}
          {(isCompleted || isCancelled) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant={isCancelled ? "destructive" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {isCancelled ? "Cancelled" : "Past Event"}
              </Badge>
            </motion.div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {event.title}
            </span>
          </h1>

          {/* Description */}
          {event.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl"
            >
              {event.description}
            </motion.p>
          )}

          {/* Event Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"
          >
            {/* Date */}
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{formattedDate}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Clock className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-semibold">
                  {formattedStartTime} - {formattedEndTime}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border md:col-span-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold truncate">{fullAddress || "TBA"}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6 pt-2"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {event.total_tickets_sold.toLocaleString()}
              </span>
              <span className="text-muted-foreground">Attendees</span>
            </div>

            {event.num_sponsors > 0 && (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">{event.num_sponsors}</span>
                <span className="text-muted-foreground">Sponsors</span>
              </div>
            )}

            {event.num_volunteers > 0 && (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-500" />
                <span className="font-semibold">{event.num_volunteers}</span>
                <span className="text-muted-foreground">Volunteers</span>
              </div>
            )}
          </motion.div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              <Tag className="w-4 h-4 text-muted-foreground" />
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
