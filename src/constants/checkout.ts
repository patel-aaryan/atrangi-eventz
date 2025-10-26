import type { Step } from "@/types/checkout";

// Checkout Flow Steps
export const CHECKOUT_STEPS: Step[] = [
  { id: 1, title: "Select Tickets", description: "Choose your tickets" },
  { id: 2, title: "Attendee Info", description: "Enter attendee details" },
  { id: 3, title: "Payment", description: "Complete your purchase" },
  { id: 4, title: "Confirmation", description: "Get your tickets" },
];

// Payment Processing Fees
export const STRIPE_FEE_PERCENTAGE = 0.029; // 2.9%
export const STRIPE_FEE_FIXED = 0.3; // $0.30

// Fee Calculation Helper
export const calculateProcessingFee = (amount: number): number => {
  return amount * STRIPE_FEE_PERCENTAGE + STRIPE_FEE_FIXED;
};

// Trust Signals for Order Summary
export const TRUST_SIGNALS = [
  { text: "Secure checkout with Stripe", color: "green" },
  { text: "Instant ticket delivery via email", color: "green" },
  { text: "Full refund up to 24h before event", color: "green" },
] as const;

// Form Validation Patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EXPIRY_DATE_REGEX = /^\d{2}\/\d{2}$/;

// Card Formatting
export const CARD_NUMBER_MAX_LENGTH = 19; // 16 digits + 3 spaces
export const CARD_EXPIRY_MAX_LENGTH = 5; // MM/YY
export const CARD_CVC_MAX_LENGTH = 4; // 3 or 4 digits

// Ticket Limits
export const LOW_STOCK_THRESHOLD = 20; // Show "X left" when below this number
