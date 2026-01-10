"use client";

import { motion } from "framer-motion";
import { Ticket, Clock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTicket } from "@/contexts/ticket-context";
import type { UpcomingEventItem } from "@/types/event";

interface UpcomingEventTicketsProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventTickets({ event }: UpcomingEventTicketsProps) {
  const { openDrawer } = useTicket();

  // Check if tickets are on sale
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

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(price);
  };

  return (
    <motion.section
      id="tickets"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pink-500/10">
          <Ticket className="w-6 h-6 text-pink-500" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Ticket Tiers</h2>
      </div>

      {/* Sales Status Alert */}
      {!ticketsOnSale && salesOpen && now < salesOpen && (
        <Card className="border-2 border-blue-500/50 bg-blue-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-semibold">Tickets Not Yet Available</p>
                <p className="text-sm text-muted-foreground">
                  Ticket sales open on{" "}
                  {salesOpen.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {event.ticket_tiers.map((tier, index) => {
          const isAvailable = tier.remaining > 0 && ticketsOnSale;
          const isLowStock = tier.remaining > 0 && tier.remaining <= 10;

          // Check if tier has time limit
          const tierExpired = tier.available_until
            ? new Date(tier.available_until) < now
            : false;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`border-2 h-full transition-all ${
                  isAvailable
                    ? "hover:border-primary hover:shadow-lg cursor-pointer"
                    : "opacity-75"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    {isLowStock && isAvailable && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500 text-yellow-500"
                      >
                        Low Stock
                      </Badge>
                    )}
                    {tierExpired && (
                      <Badge
                        variant="outline"
                        className="border-red-500 text-red-500"
                      >
                        Expired
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                      {formatPrice(tier.price)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  {tier.description && (
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  )}

                  {/* Features */}
                  {tier.features && tier.features.length > 0 && (
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Availability */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-muted-foreground">
                        Tickets Remaining
                      </span>
                      <span className="font-semibold">{tier.remaining}</span>
                    </div>
                  </div>

                  {/* Time Limit */}
                  {tier.available_until && !tierExpired && (
                    <p className="text-xs text-muted-foreground">
                      Available until{" "}
                      {new Date(tier.available_until).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    disabled={!isAvailable || tierExpired}
                    onClick={() => openDrawer(event)}
                  >
                    {(() => {
                      if (tierExpired) return "No Longer Available";
                      if (tier.remaining === 0) return "Sold Out";
                      if (!ticketsOnSale) return "Coming Soon";
                      return "Select Tickets";
                    })()}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* No Tiers Available */}
      {event.ticket_tiers.length === 0 && (
        <Card className="border-2">
          <CardContent className="pt-6 text-center">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Ticket information will be available soon. Stay tuned!
            </p>
          </CardContent>
        </Card>
      )}
    </motion.section>
  );
}
