"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTicket } from "@/contexts/ticket-context";
import type { UpcomingEventItem } from "@/types/event";

interface UpcomingEventHeroProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventHero({ event }: UpcomingEventHeroProps) {
  const { openDrawer } = useTicket();
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

  const fullAddress = [event.venue_name, event.venue_city]
    .filter(Boolean)
    .join(", ");

  // Calculate if tickets are on sale
  const now = new Date();
  const salesOpen = event.ticket_sales_open
    ? new Date(event.ticket_sales_open)
    : null;
  const salesClose = event.ticket_sales_close
    ? new Date(event.ticket_sales_close)
    : null;

  const ticketsOnSale =
    (!salesOpen || now >= salesOpen) &&
    (!salesClose || now <= salesClose) &&
    !event.is_sold_out;

  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        {event.banner_image_url ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.banner_image_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="text-sm px-4 py-1.5 bg-gradient-to-r from-primary to-pink-500">
              Upcoming Event
            </Badge>
          </motion.div>

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
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
          >
            {/* Date */}
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold text-sm">{formattedDate}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Clock className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-semibold text-sm">
                  {formattedStartTime} - {formattedEndTime}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 border">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-sm truncate">
                  {fullAddress || "TBA"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            {event.is_sold_out && (
              <Button size="lg" disabled className="px-8 py-6 text-lg">
                <Ticket className="mr-2 h-5 w-5" />
                Sold Out
              </Button>
            )}
            {!event.is_sold_out && ticketsOnSale && (
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
                onClick={() => openDrawer(event)}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Get Tickets Now
              </Button>
            )}
            {!event.is_sold_out && !ticketsOnSale && (
              <Button size="lg" disabled className="px-8 py-6 text-lg">
                <Ticket className="mr-2 h-5 w-5" />
                Tickets Coming Soon
              </Button>
            )}
          </motion.div>

          {/* Ticket Status Info */}
          {!event.is_sold_out && event.tickets_remaining < 50 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 text-yellow-500"
            >
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-500"
              >
                Only {event.tickets_remaining} tickets remaining!
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
