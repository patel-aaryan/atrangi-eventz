"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProgressIndicator } from "@/components/checkout";
import { CHECKOUT_STEPS } from "@/constants/checkout";
import {
  CheckCircle2,
  Download,
  Mail,
  Calendar,
  MapPin,
  Ticket,
  Share2,
  Home,
  Sparkles,
} from "lucide-react";
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

  const calculateTotal = () => {
    return mockOrder.subtotal - mockOrder.discount + mockOrder.processingFee;
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-pink-500/10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={4} steps={CHECKOUT_STEPS} />

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Payment Successful!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your tickets have been sent to{" "}
            <span className="font-semibold text-foreground">
              {mockOrder.contactEmail}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Order ID and Quick Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Number
                  </p>
                  <p className="text-2xl font-bold">{mockOrder.orderId}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownloadTickets}
                    className="bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Tickets
                  </Button>
                  <Button variant="outline" onClick={handleShareEvent}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  {mockOrder.eventName}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{mockOrder.eventDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {mockOrder.eventTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{mockOrder.eventLocation}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ticket Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-5 h-5 text-muted-foreground" />
                  <h4 className="font-semibold">Your Tickets</h4>
                </div>
                <div className="space-y-2">
                  {mockOrder.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{ticket.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {ticket.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(ticket.price * ticket.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${mockOrder.subtotal.toFixed(2)}</span>
              </div>
              {mockOrder.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount{" "}
                    <Badge variant="secondary" className="ml-2">
                      {mockOrder.promoCode}
                    </Badge>
                  </span>
                  <span className="text-green-600">
                    -${mockOrder.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee</span>
                <span>${mockOrder.processingFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Placeholder and Email Confirmation */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-muted-foreground/30">
                    <div className="text-center text-muted-foreground">
                      <Ticket className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">QR Code</p>
                      <p className="text-xs">Scan at venue</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Show this QR code at the entrance
                  </p>
                </div>

                {/* Email Confirmation */}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">
                        Confirmation Email Sent
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ve sent a detailed confirmation with your
                        tickets to <strong>{mockOrder.contactEmail}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      💡 <strong>Tip:</strong> Add this event to your calendar
                      and set a reminder. Check your spam folder if you
                      don&apos;t see the email within a few minutes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
