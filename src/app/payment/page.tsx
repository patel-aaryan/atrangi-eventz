"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  OrderSummary,
  PaymentForm,
  ProgressIndicator,
} from "@/components/payment";
import { PaymentFormData } from "@/types/checkout";
import { CHECKOUT_STEPS, calculateProcessingFee } from "@/constants/checkout";
import { useTicket } from "@/contexts/ticket-context";
import type { TicketSelection } from "@/types/checkout";
import { useAppSelector } from "@/store/hooks";
import type { CompletePurchaseData } from "@/types/purchase";

export default function PaymentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Redirect if no event or tickets selected
  useEffect(() => {
    if (!currentEvent || tickets.length === 0) {
      router.push("/events");
    }
  }, [currentEvent, tickets.length, router]);

  // Show loading state while redirecting
  if (!currentEvent || tickets.length === 0) {
    return null;
  }

  const handleFormSubmit = async (formData: PaymentFormData) => {
    setIsSubmitting(true);

    try {
      if (!savedCheckoutData) {
        // If we somehow reach payment without attendee/contact info, send user back
        alert(
          "We need your contact and attendee details before completing payment."
        );
        router.push("/checkout");
        return;
      }

      // TODO: Replace with actual API call to process payment
      // Should combine payment data with attendee info from previous step
      // Example API call:
      // const attendeeInfo = JSON.parse(sessionStorage.getItem('attendeeInfo') || '{}');
      // const response = await fetch('/api/checkout/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     eventId: eventId,
      //     tickets: mockEventData.tickets,
      //     promoCode: mockEventData.promoCode,
      //     attendeeInfo: attendeeInfo,
      //     paymentInfo: formData,
      //     total: total,
      //   }),
      // });
      // const result = await response.json();
      // if (result.success) {
      //   router.push(`/confirmation?orderId=${result.orderId}`);
      // }

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", formData);
      console.log("Order details:", {
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        tickets,
        total,
      });

      // Call purchase completion API before navigating to confirmation
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
          // Stripe IDs will be filled in once Stripe integration is wired up
          paymentStatus: "succeeded",
        },
        billingInfo: {
          zip: formData.billingZip,
        },
        // Promo code support can be added here when implemented
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
      // TODO: Show error message to user
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
          <div className="lg:col-span-2">
            <PaymentForm
              onSubmit={handleFormSubmit}
              onBack={() => router.back()}
              isSubmitting={isSubmitting}
            />
          </div>

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
