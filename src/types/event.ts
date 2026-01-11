// Event types based on database schema

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface TicketTier {
  name: string;
  price: number;
  remaining: number;
  available_until?: string | null;
  description?: string;
  features?: string[];
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;

  // Event timing
  start_date: string;
  end_date: string;
  ticket_sales_open: string | null;
  ticket_sales_close: string | null;

  // Location details
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_province: string | null;
  venue_postal_code: string | null;
  venue_country: string | null;

  // Event details
  total_capacity: number | null;
  total_tickets_sold: number;
  currency: string;
  total_revenue: number;

  // Ticket tiers
  ticket_tiers: TicketTier[];

  // Computed fields
  tickets_remaining: number;
  is_sold_out: boolean;

  // Media
  banner_image_url: string | null;

  // Status and visibility
  status: EventStatus;
  is_featured: boolean;
  is_public: boolean;

  // SEO and metadata
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Simplified type for showcasing past events
export interface PastEventListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_city: string | null;
  total_tickets_sold: number;
  num_sponsors: number;
  num_volunteers: number;
  banner_image_url: string | null;
}

// Ticket tier without dynamic remaining count (for caching static data)
export interface TicketTierStatic {
  name: string;
  price: number;
  remaining: number;
  available_until?: string | null;
  description?: string;
  features?: string[];
}

// Ticket availability info (dynamic data, always fetched fresh)
export interface TicketAvailability {
  total_tickets_sold: number;
  tickets_remaining: number;
  is_sold_out: boolean;
  ticket_tiers_remaining: number[]; // Array of remaining counts per tier index
}

// Simplified type for upcoming event (static data only - cacheable)
export interface UpcomingEventStatic {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_city: string | null;
  total_capacity: number | null;
  ticket_sales_open: string | null;
  ticket_sales_close: string | null;
  ticket_tiers: TicketTierStatic[];
  banner_image_url: string | null;
}

// Full upcoming event (static + dynamic data combined)
export interface UpcomingEventItem extends UpcomingEventStatic {
  total_tickets_sold: number;
  tickets_remaining: number;
  is_sold_out: boolean;
  ticket_tiers: TicketTier[]; // Override with full tier info including sold counts
}

// Event detail static data (cacheable)
export interface EventDetailStatic {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_province: string | null;
  venue_postal_code: string | null;
  venue_country: string | null;
  total_capacity: number | null;
  ticket_sales_open: string | null;
  ticket_sales_close: string | null;
  ticket_tiers: TicketTierStatic[];
  num_sponsors: number;
  num_volunteers: number;
  status: EventStatus;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
  banner_image_url: string | null;
}

// Full event details for event detail page (static + dynamic)
export interface EventDetail extends EventDetailStatic {
  total_tickets_sold: number;
  tickets_remaining: number;
  is_sold_out: boolean;
  ticket_tiers: TicketTier[]; // Override with full tier info including sold counts
}
