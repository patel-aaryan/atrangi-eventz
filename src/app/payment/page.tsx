"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  OrderSummary,
  PaymentForm,
  ProgressIndicator,
} from "@/components/payment";
import { StripeProvider } from "@/providers/stripe-provider";
import type {
  PaymentFormData,
  StripePaymentResult,
  TicketSelection,
} from "@/types/checkout";
import { CHECKOUT_STEPS, calculateProcessingFee } from "@/constants/checkout";
import { useTicket } from "@/contexts/ticket-context";
import { useAppSelector } from "@/store/hooks";
import type { CompletePurchaseData } from "@/types/purchase";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPaymentIntent } from "@/lib/api/stripe";

export default function PaymentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Use ref to prevent duplicate API calls (survives React Strict Mode double-invoke)
  const paymentIntentCreatedRef = useRef(false);

  const {
    currentEvent,
    ticketSelections,
    subtotal: contextSubtotal,
  } = useTicket();
  const savedCheckoutData = useAppSelector((state) => state.checkout.formData);

  // Transform ticket selections to match OrderSummary format
  const tickets: TicketSelection[] = useMemo(() => {
    if (!ticketSelections || ticketSelections.length === 0) return [];

    return ticketSelections.map((selection) => ({
      id: selection.ticketId,
      name: selection.ticketName,
      price: selection.pricePerTicket,
      quantity: selection.quantity,
    }));
  }, [ticketSelections]);

  // Format event date
  const eventDate = useMemo(() => {
    if (!currentEvent) return "";
    const startDate = new Date(currentEvent.start_date);
    const endDate = currentEvent.end_date
      ? new Date(currentEvent.end_date)
      : null;

    const dateStr = startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (endDate) {
      const endTime = endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${dateStr} • ${startTime} - ${endTime}`;
    }

    return `${dateStr} • ${startTime}`;
  }, [currentEvent]);

  // Format event location
  const eventLocation = useMemo(() => {
    if (!currentEvent) return "";
    const parts: string[] = [];
    if (currentEvent.venue_name) parts.push(currentEvent.venue_name);
    if (currentEvent.venue_city) parts.push(currentEvent.venue_city);
    return parts.length > 0 ? parts.join(", ") : "TBA";
  }, [currentEvent]);

  // Calculate totals
  const subtotal = contextSubtotal;
  const discount = 0; // TODO: Implement promo code system
  const processingFee = calculateProcessingFee(subtotal - discount);
  const total = subtotal - discount + processingFee;

  // Create PaymentIntent when component mounts (only once)
  useEffect(() => {
    const initializePaymentIntent = async () => {
      if (!currentEvent || tickets.length === 0 || total <= 0) {
        return;
      }

      // Prevent duplicate PaymentIntent creation using ref (survives Strict Mode)
      if (paymentIntentCreatedRef.current) {
        return;
      }

      // Mark as in-progress immediately to prevent race conditions
      paymentIntentCreatedRef.current = true;

      try {
        setPaymentError(null);
        const data = await createPaymentIntent({
          amount: Math.round(total * 100), // Convert to cents
          eventId: currentEvent.id,
          eventTitle: currentEvent.title,
          ticketSelections: ticketSelections.map((t) => ({
            ticketId: t.ticketId,
            ticketName: t.ticketName,
            quantity: t.quantity,
          })),
        });

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating PaymentIntent:", error);
        setPaymentError(
          error instanceof Error
            ? error.message
            : "Failed to initialize payment. Please try again."
        );
        // Reset ref on error so user can retry
        paymentIntentCreatedRef.current = false;
      }
    };

    initializePaymentIntent();
    // Only depend on event ID and total amount (not the entire objects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id, total]);

  // Redirect if no event or tickets selected
  useEffect(() => {
    if (!currentEvent || tickets.length === 0) {
      router.push("/events");
    }
  }, [currentEvent, tickets.length, router]);

  // Show loading state while redirecting
  if (!currentEvent || tickets.length === 0) return null;

  // Render payment content based on state
  const renderPaymentContent = () => {
    if (paymentError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center"
        >
          <p className="text-destructive font-medium mb-4">{paymentError}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </motion.div>
      );
    }

    if (clientSecret) {
      return (
        <StripeProvider clientSecret={clientSecret}>
          <PaymentForm
            onSubmit={handleFormSubmit}
            onBack={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </StripeProvider>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-12 rounded-lg border bg-card"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Initializing secure payment...</p>
      </motion.div>
    );
  };

  const handleFormSubmit = async (
    formData: PaymentFormData,
    stripeResult: StripePaymentResult
  ) => {
    setIsSubmitting(true);

    try {
      if (!savedCheckoutData) {
        alert(
          "We need your contact and attendee details before completing payment."
        );
        router.push("/checkout");
        return;
      }

      // Call purchase completion API with Stripe payment details
      const payload: CompletePurchaseData = {
        eventId: currentEvent.id,
        ticketSelections: ticketSelections.map((selection) => {
          const tierIndex = Number.parseInt(
            selection.ticketId.replace("ticket-", ""),
            10
          );

          return {
            ticketId: selection.ticketId,
            ticketName: selection.ticketName,
            tierIndex: Number.isNaN(tierIndex) ? 0 : tierIndex,
            pricePerTicket: selection.pricePerTicket,
            quantity: selection.quantity,
          };
        }),
        attendeeInfo: savedCheckoutData.attendees.map((attendee) => ({
          ticketId: attendee.ticketId,
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          email: attendee.email,
        })),
        contactInfo: {
          firstName: savedCheckoutData.contact.firstName,
          lastName: savedCheckoutData.contact.lastName,
          email: savedCheckoutData.contact.email,
          phone: savedCheckoutData.contact.phone,
        },
        paymentInfo: {
          subtotal,
          discount,
          processingFee,
          total,
          stripePaymentIntentId: stripeResult.paymentIntentId,
          stripePaymentMethodId: stripeResult.paymentMethodId,
          paymentStatus: stripeResult.status,
        },
        billingInfo: undefined,
        promoCode: undefined,
      };

      const response = await fetch("/api/purchase/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("Purchase completion failed:", errorBody);
        alert(
          errorBody?.message ||
            "We couldn't complete your purchase. Please try again."
        );
        return;
      }

      const result = (await response.json()) as {
        success?: boolean;
        orderId: string;
        orderNumber: string;
      };

      // Navigate to confirmation page
      router.push(
        `/confirmation?orderId=${result.orderNumber || result.orderId}`
      );
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-pink-500/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={3} steps={CHECKOUT_STEPS} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Payment
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete your payment securely to receive your tickets
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Payment Form (2/3 width) */}
          <div className="lg:col-span-2">{renderPaymentContent()}</div>

          {/* Right Column - Order Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <OrderSummary
              eventTitle={currentEvent.title}
              eventDate={eventDate}
              eventLocation={eventLocation}
              tickets={tickets}
              subtotal={subtotal}
              discount={discount}
              processingFee={processingFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
