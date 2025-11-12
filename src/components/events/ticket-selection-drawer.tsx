"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Tag, Ticket, X, ShieldCheck } from "lucide-react";
import type { TicketType } from "@/types/checkout";
import { LOW_STOCK_THRESHOLD } from "@/constants/checkout";

interface TicketSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketTypes: TicketType[];
  onProceedToCheckout: (
    selections: Record<string, number>,
    promoCode?: string
  ) => void;
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
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

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

  const calculateSubtotal = () => {
    return Object.entries(quantities).reduce((total, [ticketId, qty]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      return total + (ticket?.price || 0) * qty;
    }, 0);
  };

  const calculateDiscount = () => {
    if (!promoApplied) return 0;
    // TODO: Replace with actual discount calculation from API
    // Should fetch discount percentage/amount based on promo code from database
    return calculateSubtotal() * 0.1; // Mock: 10% discount
  };

  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  const getTotalTickets = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    // TODO: Replace with actual API call to validate promo code
    // API should return: { valid: boolean, discountType: 'percentage' | 'fixed', discountValue: number }
    // Example API call: POST /api/promo-codes/validate { code: promoCode, eventId: eventId }
    if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoError("");
  };

  const handleProceed = () => {
    onProceedToCheckout(quantities, promoApplied ? promoCode : undefined);
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

          <div className="px-4 pb-4 space-y-6">
            {/* Ticket Types */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Select Tickets
              </h3>

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
                              <Badge variant="destructive" className="text-xs">
                                {ticket.available} left
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {ticket.description}
                          </p>
                          {ticket.features && ticket.features.length > 0 && (
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

            {/* Promo Code Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Promo Code
              </h3>

              <AnimatePresence mode="wait">
                {promoApplied ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                    >
                      {promoCode}
                    </Badge>
                    <span className="text-sm text-green-700 dark:text-green-400 flex-1">
                      Promo code applied!
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleRemovePromo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {promoError}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            {/* Price Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>

              {promoApplied && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-green-600 dark:text-green-400">
                    Discount
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    -${calculateDiscount().toFixed(2)}
                  </span>
                </motion.div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              {hasSelections && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground text-center"
                >
                  {getTotalTickets()}{" "}
                  {getTotalTickets() === 1 ? "ticket" : "tickets"} selected
                </motion.p>
              )}
            </div>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
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
