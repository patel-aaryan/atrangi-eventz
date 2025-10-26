"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/payment";
import {
  SuccessHeader,
  OrderHeader,
  EventDetailsCard,
  PaymentSummaryCard,
  QRCodeCard,
} from "@/components/confirmation";
import { CHECKOUT_STEPS } from "@/constants/checkout";
import { Download, Home } from "lucide-react";
import confetti from "canvas-confetti";

export default function ConfirmationPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  // TODO: Fetch order details from URL params or state management
  // Example: const searchParams = useSearchParams();
  // const orderId = searchParams.get('orderId');
  const mockOrder = {
    orderId: "ATR-2024-001234",
    eventName: "Summer Music Festival 2024",
    eventDate: "July 15, 2024",
    eventTime: "6:00 PM - 11:00 PM",
    eventLocation: "Central Park Amphitheater, New York",
    contactEmail: "john.doe@example.com",
    tickets: [
      { id: "1", name: "General Admission", quantity: 2, price: 49.99 },
      { id: "2", name: "VIP Pass", quantity: 1, price: 149.99 },
    ],
    subtotal: 249.97,
    discount: 24.99,
    processingFee: 7.5,
    total: 232.48,
    promoCode: "WELCOME10",
  };

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setShowContent(true);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadTickets = () => {
    // TODO: Implement actual ticket download
    console.log("Downloading tickets...");
  };

  const handleShareEvent = () => {
    // TODO: Implement social sharing
    if (navigator.share) {
      navigator
        .share({
          title: mockOrder.eventName,
          text: `I'm attending ${mockOrder.eventName}!`,
          url: window.location.origin + "/events",
        })
        .catch(console.error);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-pink-500/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={4} steps={CHECKOUT_STEPS} />

        {/* Success Header */}
        <SuccessHeader contactEmail={mockOrder.contactEmail} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6 lg:items-start">
            {/* Left Column - Order Number & Event Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: showContent ? 1 : 0,
                x: showContent ? 0 : -20,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-6 h-full"
            >
              <OrderHeader
                orderId={mockOrder.orderId}
                onDownload={handleDownloadTickets}
                onShare={handleShareEvent}
              />

              <EventDetailsCard
                eventName={mockOrder.eventName}
                eventDate={mockOrder.eventDate}
                eventTime={mockOrder.eventTime}
                eventLocation={mockOrder.eventLocation}
                tickets={mockOrder.tickets}
              />
            </motion.div>

            {/* Right Column - Payment Summary & QR Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: showContent ? 1 : 0,
                x: showContent ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-6 h-full"
            >
              <PaymentSummaryCard
                subtotal={mockOrder.subtotal}
                discount={mockOrder.discount}
                processingFee={mockOrder.processingFee}
                total={mockOrder.total}
                promoCode={mockOrder.promoCode}
              />

              <QRCodeCard contactEmail={mockOrder.contactEmail} />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/events")}
              className="flex-1"
            >
              <Home className="w-5 h-5 mr-2" />
              Browse More Events
            </Button>
            <Button
              size="lg"
              onClick={handleDownloadTickets}
              className="flex-1 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All Tickets
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
