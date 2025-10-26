"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  OrderSummary,
  PaymentForm,
  ProgressIndicator,
} from "@/components/payment";
import { PaymentFormData } from "@/types/checkout";
import { CHECKOUT_STEPS, calculateProcessingFee } from "@/constants/checkout";

export default function PaymentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Replace with actual data from URL params or state management
  // Example: const searchParams = useSearchParams();
  // const eventId = searchParams.get('eventId');
  // Then fetch event and ticket data from API
  const mockEventData = {
    eventTitle: "Bollywood Night 2025",
    eventDate: "March 15, 2025 • 8:00 PM",
    eventLocation: "Student Union Ballroom",
    tickets: [
      {
        id: "general",
        name: "General Admission",
        price: 25.0,
        quantity: 2,
      },
      {
        id: "vip",
        name: "VIP Pass",
        price: 50.0,
        quantity: 1,
      },
    ],
    promoCode: "WELCOME10",
  };

  const subtotal = mockEventData.tickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  // TODO: Replace with actual discount calculation from API
  const discount = mockEventData.promoCode ? subtotal * 0.1 : 0;

  // TODO: Replace with actual processing fee calculation from API
  // Using Stripe's standard fee: 2.9% + $0.30
  const processingFee = calculateProcessingFee(subtotal - discount);

  const total = subtotal - discount + processingFee;

  const handleFormSubmit = async (formData: PaymentFormData) => {
    setIsSubmitting(true);

    try {
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
      console.log("Order details:", { mockEventData, total });

      // Navigate to confirmation page
      router.push("/confirmation?orderId=mock-order-123");
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
              eventTitle={mockEventData.eventTitle}
              eventDate={mockEventData.eventDate}
              eventLocation={mockEventData.eventLocation}
              tickets={mockEventData.tickets}
              subtotal={subtotal}
              discount={discount}
              processingFee={processingFee}
              total={total}
              promoCode={mockEventData.promoCode}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
