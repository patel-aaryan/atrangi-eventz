"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Ticket, ShieldCheck, Receipt } from "lucide-react";
import type { TicketType } from "@/types/checkout";
import { LOW_STOCK_THRESHOLD } from "@/constants/checkout";

interface TicketSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketTypes: TicketType[];
  onProceedToCheckout: (selections: Record<string, number>) => void;
}

export function TicketSelectionDrawer({
  open,
  onOpenChange,
  eventTitle,
  eventDate,
  eventLocation,
  ticketTypes,
  onProceedToCheckout,
}: TicketSelectionDrawerProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (ticketId: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[ticketId] || 0;
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      if (!ticket) return prev;

      const newQty = Math.max(
        0,
        Math.min(currentQty + delta, ticket.maxQuantity, ticket.available)
      );

      if (newQty === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [ticketId]: newQty };
    });
  };

  const calculateTotal = () => {
    return Object.entries(quantities).reduce((total, [ticketId, qty]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      return total + (ticket?.price || 0) * qty;
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleProceed = () => {
    onProceedToCheckout(quantities);
  };

  const hasSelections = getTotalTickets() > 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold">
              {eventTitle}
            </DrawerTitle>
            <DrawerDescription className="text-base">
              {eventDate} • {eventLocation}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {/* Two column layout on desktop, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
              {/* Left Column - Ticket Types */}
              <div className="space-y-4 flex flex-col">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Select Tickets
                </h3>

                <div className="space-y-4 flex-1">
                  {ticketTypes.map((ticket) => {
                    const quantity = quantities[ticket.id] || 0;
                    const isLowStock = ticket.available < LOW_STOCK_THRESHOLD;

                    return (
                      <motion.div key={ticket.id} layout>
                        <Card className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{ticket.name}</h4>
                                {isLowStock && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    {ticket.available} left
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {ticket.description}
                              </p>
                              {ticket.features &&
                                ticket.features.length > 0 && (
                                  <ul className="text-xs text-muted-foreground space-y-1">
                                    {ticket.features.map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-center gap-1"
                                      >
                                        <span className="text-primary">✓</span>{" "}
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">
                                ${ticket.price.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Max {ticket.maxQuantity} per order
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(ticket.id, -1)}
                                disabled={quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <div className="w-12 text-center font-semibold">
                                {quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(ticket.id, 1)}
                                disabled={
                                  quantity >= ticket.maxQuantity ||
                                  quantity >= ticket.available
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Order Summary (desktop only) */}
              <div className="hidden lg:flex lg:flex-col space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Order Summary
                </h3>

                {/* Price Summary */}
                <Card className="px-6 py-8 space-y-4 flex-1 flex flex-col h-full">
                  {/* Cost Breakdown */}
                  {Object.entries(quantities).length > 0 ? (
                    <div className="space-y-3 flex-1 flex flex-col">
                      <div className="space-y-3">
                        {Object.entries(quantities).map(([ticketId, qty]) => {
                          const ticket = ticketTypes.find(
                            (t) => t.id === ticketId
                          );
                          if (!ticket) return null;

                          return (
                            <div
                              key={ticketId}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {ticket.name} × {qty}
                              </span>
                              <span className="font-medium">
                                ${(ticket.price * qty).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-auto space-y-3">
                        <Separator />

                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-muted-foreground text-center pt-2"
                        >
                          {getTotalTickets()}{" "}
                          {getTotalTickets() === 1 ? "ticket" : "tickets"}{" "}
                          selected
                        </motion.p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <p className="text-sm">No tickets selected</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Mobile - Original Simple Summary */}
              <div className="lg:hidden space-y-6">
                <Separator />

                {/* Price Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals - Below everything */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>

        <DrawerFooter className="pt-4 border-t">
          <Button
            size="lg"
            onClick={handleProceed}
            disabled={!hasSelections}
            className="w-full bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
          >
            {hasSelections
              ? `Proceed to Checkout • $${calculateTotal().toFixed(2)}`
              : "Select tickets to continue"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
