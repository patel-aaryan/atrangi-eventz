// Ticket Types
export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  available: number;
  features?: string[];
}

export interface TicketSelection {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Checkout Form Data
export interface CheckoutFormData {
  // Contact Information
  email: string;
  confirmEmail: string;
  firstName: string;
  lastName: string;
  phone: string;

  // Attendee Information
  attendeeFirstName: string;
  attendeeLastName: string;
  isSameAsBuyer: boolean;

  // Payment Information
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  billingZip: string;

  // Terms
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

// Attendee Information (for the new attendee info page)
export interface AttendeeInfo {
  ticketId: string;
  ticketName: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
}

export interface AttendeeFormData {
  contact: ContactInfo;
  attendees: AttendeeInfo[];
}

// Payment Form Data (for checkout page - payment only)
export interface PaymentFormData {
  // Payment Information
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  billingZip: string;

  // Terms
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

// Progress/Step Types
export interface Step {
  id: number;
  title: string;
  description: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: string;
  status: string;
  available: boolean;
  description?: string;
  imageUrl?: string;
}

// Order/Purchase Types
export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: TicketSelection[];
  subtotal: number;
  discount: number;
  processingFee: number;
  total: number;
  promoCode?: string;
  customerInfo: CheckoutFormData;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

// Promo Code Types
export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: Date;
  validUntil: Date;
  maxUses?: number;
  usedCount: number;
  applicableEventIds?: string[];
  isActive: boolean;
}

export interface PromoCodeValidationResult {
  valid: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  errorMessage?: string;
}
