"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressIndicator } from "@/components/payment";
import { ContactForm, AttendeeCard } from "@/components/checkout";
import type { AttendeeInfo, ContactInfo } from "@/types/checkout";
import { CHECKOUT_STEPS, EMAIL_REGEX } from "@/constants/checkout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  // TODO: Replace with actual data from URL params or state management
  // Example: const searchParams = useSearchParams();
  // const tickets = JSON.parse(searchParams.get('tickets') || '[]');
  const mockTickets = [
    {
      id: "ticket-1",
      ticketTypeId: "general",
      ticketName: "General Admission",
    },
    {
      id: "ticket-2",
      ticketTypeId: "general",
      ticketName: "General Admission",
    },
    { id: "ticket-3", ticketTypeId: "vip", ticketName: "VIP Pass" },
  ];

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
  });

  const [attendees, setAttendees] = useState<AttendeeInfo[]>(
    mockTickets.map((ticket) => ({
      ticketId: ticket.id,
      ticketName: ticket.ticketName,
      firstName: "",
      lastName: "",
      email: "",
    }))
  );

  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof ContactInfo, string>>
  >({});

  const [attendeeErrors, setAttendeeErrors] = useState<
    Record<string, Partial<Record<keyof AttendeeInfo, string>>>
  >({});

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
    if (contactErrors[field]) {
      setContactErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAttendeeChange = (
    ticketId: string,
    field: keyof AttendeeInfo,
    value: string
  ) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.ticketId === ticketId
          ? { ...attendee, [field]: value }
          : attendee
      )
    );
    if (attendeeErrors[ticketId]?.[field]) {
      setAttendeeErrors((prev) => ({
        ...prev,
        [ticketId]: { ...prev[ticketId], [field]: undefined },
      }));
    }
  };

  const validateForm = (): boolean => {
    const newContactErrors: Partial<Record<keyof ContactInfo, string>> = {};
    const newAttendeeErrors: Record<
      string,
      Partial<Record<keyof AttendeeInfo, string>>
    > = {};

    // Validate contact info
    if (!contactInfo.firstName) {
      newContactErrors.firstName = "First name is required";
    }

    if (!contactInfo.lastName) {
      newContactErrors.lastName = "Last name is required";
    }

    if (!contactInfo.email) {
      newContactErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(contactInfo.email)) {
      newContactErrors.email = "Invalid email format";
    }

    if (contactInfo.email !== contactInfo.confirmEmail) {
      newContactErrors.confirmEmail = "Emails do not match";
    }

    if (!contactInfo.phone) {
      newContactErrors.phone = "Phone number is required";
    }

    // Validate attendees
    attendees.forEach((attendee) => {
      const errors: Partial<Record<keyof AttendeeInfo, string>> = {};

      if (!attendee.firstName) {
        errors.firstName = "First name is required";
      }

      if (!attendee.lastName) {
        errors.lastName = "Last name is required";
      }

      if (!attendee.email) {
        errors.email = "Email is required";
      } else if (!EMAIL_REGEX.test(attendee.email)) {
        errors.email = "Invalid email format";
      }

      if (Object.keys(errors).length > 0) {
        newAttendeeErrors[attendee.ticketId] = errors;
      }
    });

    setContactErrors(newContactErrors);
    setAttendeeErrors(newAttendeeErrors);

    return (
      Object.keys(newContactErrors).length === 0 &&
      Object.keys(newAttendeeErrors).length === 0
    );
  };

  const handleContinue = () => {
    if (validateForm()) {
      // TODO: Store attendee info in state management or pass to payment
      // Example: Store in session storage or Redux/Zustand store
      // sessionStorage.setItem('attendeeInfo', JSON.stringify({ contactInfo, attendees }));
      console.log("Attendee info:", { contactInfo, attendees });
      router.push("/payment");
    } else {
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-pink-500/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} steps={CHECKOUT_STEPS} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Attendee Information
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us who&apos;s attending so we can send tickets to the right
            people
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Attendee Details in Scrollable Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Attendee Details ({attendees.length}{" "}
                  {attendees.length === 1 ? "Ticket" : "Tickets"})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-4">
                    {attendees.map((attendee, index) => (
                      <AttendeeCard
                        key={attendee.ticketId}
                        attendee={attendee}
                        index={index}
                        errors={attendeeErrors[attendee.ticketId] || {}}
                        onChange={(field, value) =>
                          handleAttendeeChange(attendee.ticketId, field, value)
                        }
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[600px]"
          >
            <ContactForm
              data={contactInfo}
              errors={contactErrors}
              onChange={handleContactChange}
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Tickets
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            className="flex-1 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
          >
            Continue to Payment
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
