"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUpcomingEvent } from "@/lib/api/events";
import type { UpcomingEventItem } from "@/types/event";

export function UpcomingEventBanner() {
  const [event, setEvent] = useState<UpcomingEventItem | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeUntil, setTimeUntil] = useState("");

  useEffect(() => {
    // Fetch upcoming event
    const fetchEvent = async () => {
      try {
        const upcomingEvent = await getUpcomingEvent();
        setEvent(upcomingEvent);
      } catch (error) {
        console.error("Error fetching upcoming event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    if (!event) return;

    // Update countdown every second
    const updateCountdown = () => {
      const now = Date.now();
      const eventTime = new Date(event.start_date).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeUntil("Event started!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntil(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeUntil(`${hours}h ${minutes}m`);
      } else {
        setTimeUntil(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event]);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // Don't render if loading, no event, or dismissed
  if (isLoading || !event || isDismissed) {
    return null;
  }

  // Format date
  const eventDate = new Date(event.start_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Calculate ticket availability
  const ticketsRemaining = event.tickets_remaining;
  const totalCapacity = event.total_capacity || 0;
  const percentageLeft = totalCapacity
    ? (ticketsRemaining / totalCapacity) * 100
    : 0;

  // Determine ticket status
  let ticketBadge = null;
  if (event.is_sold_out) {
    ticketBadge = (
      <Badge
        variant="secondary"
        className="bg-red-500/20 text-red-200 border-red-400"
      >
        Sold Out
      </Badge>
    );
  } else if (percentageLeft < 20 && percentageLeft > 0) {
    ticketBadge = (
      <Badge
        variant="secondary"
        className="bg-yellow-500/20 text-yellow-200 border-yellow-400"
      >
        Limited Tickets
      </Badge>
    );
  } else if (!event.is_sold_out) {
    ticketBadge = (
      <Badge
        variant="secondary"
        className="bg-green-500/20 text-green-200 border-green-400"
      >
        Tickets Available
      </Badge>
    );
  }

  // Truncate description for banner
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-16 z-40 overflow-hidden shadow-lg"
      >
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
          </div>

          <div className="container relative mx-auto px-4">
            {/* Dismiss Button - Top Right */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 z-10 text-white transition-colors hover:bg-white/20 hover:text-white"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex flex-col gap-3 py-4 pr-12 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-4">
              {/* Left Section: Icon + Event Details */}
              <div className="flex flex-1 gap-3 lg:gap-4">
                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="flex-shrink-0"
                >
                  <Sparkles className="h-7 w-7 text-yellow-300 lg:h-8 lg:w-8" />
                </motion.div>

                {/* Event Details Container */}
                <div className="flex flex-1 flex-col gap-2">
                  {/* Title Row with Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white lg:text-xl">
                      {event.title}
                    </h3>
                    {ticketBadge}
                    {timeUntil && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-200 border-yellow-400"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Starts in {timeUntil}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-white/90 leading-relaxed lg:text-base">
                      {truncateText(event.description, 150)}
                    </p>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white/70">
                          Date
                        </span>
                        <span className="font-medium text-white">
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white/70">
                          Time
                        </span>
                        <span className="font-medium text-white">
                          {formattedTime}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white/70">
                          Location
                        </span>
                        <span className="font-medium text-white">
                          {event.venue_name || event.venue_city}
                        </span>
                      </div>
                    </div>

                    {/* Tickets */}
                    {!event.is_sold_out && (
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-white/70">
                            Tickets Left
                          </span>
                          <span className="font-medium text-white">
                            {ticketsRemaining} / {totalCapacity}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section: CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:flex-none"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white font-semibold text-purple-600 shadow-lg hover:bg-white/90 hover:shadow-xl lg:min-w-[140px]"
                >
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Ticket className="h-5 w-5" />
                    <span>Get Tickets</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
