"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";
import { EVENTS } from "@/constants/events";
import { TicketSelectionDrawer } from "@/components/events/ticket-selection-drawer";
import type { TicketType } from "@/types/checkout";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function EventsPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    date: string;
    location: string;
  } | null>(null);

  // TODO: Replace with actual ticket types from API/database
  // Should fetch ticket types based on selected event ID
  // Example API call: GET /api/events/[eventId]/tickets
  // Response should include: id, name, price, description, maxQuantity, available, features[]
  const mockTicketTypes: TicketType[] = [
    {
      id: "general",
      name: "General Admission",
      price: 25.0,
      description: "Standard entry with full event access",
      maxQuantity: 10,
      available: 150,
      features: [
        "Entry to event",
        "Access to all areas",
        "Complimentary welcome drink",
      ],
    },
    {
      id: "vip",
      name: "VIP Pass",
      price: 50.0,
      description: "Premium experience with exclusive perks",
      maxQuantity: 4,
      available: 15,
      features: [
        "Priority entry",
        "VIP lounge access",
        "Reserved seating",
        "Free welcome drinks",
        "Event merchandise",
      ],
    },
    {
      id: "earlybird",
      name: "Early Bird Special",
      price: 20.0,
      description: "Limited time discounted tickets",
      maxQuantity: 10,
      available: 5,
      features: ["Entry to event", "Access to all areas", "10% discount"],
    },
  ];

  const handleBuyTickets = (title: string, date: string, location: string) => {
    setSelectedEvent({ title, date, location });
    setDrawerOpen(true);
  };

  const handleProceedToCheckout = (
    selections: Record<string, number>,
    promoCode?: string
  ) => {
    console.log("Proceeding to attendee info:", { selections, promoCode });
    // TODO: Navigate to attendee-info page with selected tickets
    // Pass eventId, selections, and promoCode to attendee-info page
    // Store in session storage or state management
    // sessionStorage.setItem('ticketSelections', JSON.stringify({ selections, promoCode, eventId }));
    setDrawerOpen(false);
    router.push("/attendee-info");
  };

  return (
    <section className="relative overflow-hidden pt-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-pink-500/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-6 mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="block bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Our Events
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Experience the best of Gujarati culture through our exciting events.
            From high-energy Bollywood club nights to traditional Garba
            celebrations, there&apos;s something for everyone.
          </motion.p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {EVENTS.map((event, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="relative p-8 rounded-2xl bg-background/50 backdrop-blur border border-border overflow-hidden group cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="relative z-10">
                <div className="text-5xl mb-4">{event.emoji}</div>
                <h3 className="text-2xl font-semibold mb-3">{event.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Events Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay tuned for our next events. Follow us on social media for the
              latest announcements and early bird tickets.
            </p>
          </motion.div>

          {/* Sample Event Cards */}
          {/* TODO: Replace with actual upcoming events from database */}
          {/* Should fetch from API: GET /api/events?status=upcoming */}
          {/* Each event should include: id, title, date, location, capacity, ticketStatus, hasTicketsAvailable */}
          <motion.div variants={staggerContainer} className="space-y-6">
            {[
              {
                title: "Bollywood Night 2025",
                date: "March 15, 2025 • 8:00 PM",
                location: "Student Union Ballroom",
                capacity: "500+ Students",
                status: "Tickets Available",
                available: true,
              },
              {
                title: "Navratri Garba Night",
                date: "Fall 2025",
                location: "TBA",
                capacity: "300+ Students",
                status: "Save the Date",
                available: false,
              },
            ].map((event, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <h3 className="text-2xl font-semibold">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.capacity}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      {event.status}
                    </span>
                    {event.available ? (
                      <Button
                        onClick={() =>
                          handleBuyTickets(
                            event.title,
                            event.date,
                            event.location
                          )
                        }
                        className="bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
                      >
                        Buy Tickets
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Notify Me
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="text-center p-12 mb-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-pink-500/10 border border-border"
          >
            <h3 className="text-3xl font-bold mb-4">Don&apos;t Miss Out!</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Follow us on social media to get notified about upcoming events,
              early bird tickets, and exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
              >
                <Link href="/#contact">Follow Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ticket Selection Drawer */}
      {selectedEvent && (
        <TicketSelectionDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.date}
          eventLocation={selectedEvent.location}
          ticketTypes={mockTicketTypes}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
    </section>
  );
}
