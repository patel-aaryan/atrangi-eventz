"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { getUpcomingEvent } from "@/lib/api/events";
import { getReservations } from "@/lib/api/tickets";
import { EmptyCartState } from "./empty-cart-state";
import Link from "next/link";

interface CartItem {
  tierIndex: number;
  tierName: string;
  quantity: number;
  price: number;
}

export function ShoppingCartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setIsLoading(true);
      // Fetch upcoming event
      const upcomingEvent = await getUpcomingEvent();

      if (!upcomingEvent) {
        setCartItems([]);
        return;
      }

      // Fetch reservations for this event
      const reservations = await getReservations(upcomingEvent.id);

      // Map reservations to cart items with full details
      const items: CartItem[] = reservations.map((reservation) => {
        const tier = upcomingEvent.ticket_tiers[reservation.tierIndex];
        return {
          tierIndex: reservation.tierIndex,
          tierName: tier?.name || `Tier ${reservation.tierIndex + 1}`,
          quantity: reservation.quantity,
          price: tier?.price || 0,
        };
      });

      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart data:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <HoverCard openDelay={200} closeDelay={300}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-primary to-pink-500"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] p-0" align="end">
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-lg">Shopping Cart</h3>
            {cartItems.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "ticket" : "tickets"} reserved
              </p>
            )}
          </div>

          {/* Cart Content */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && (
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            {!isLoading && cartItems.length === 0 && <EmptyCartState />}
            {!isLoading && cartItems.length > 0 && (
              <div className="p-4 space-y-3">
                {/* Reservation Timer Notice */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Your tickets are reserved for 20 minutes. Complete checkout
                    to secure them.
                  </p>
                </div>

                {/* Cart Items */}
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.tierIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.tierName}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
