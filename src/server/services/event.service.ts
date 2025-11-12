import { eventRepository } from "@/server/repository/postgres/event.repository";
import type { EventListItem, PastEventListItem } from "@/types/event";

/**
 * Event Service - Contains business logic for events
 */
export class EventService {
  /**
   * Get past events for showcase
   * Returns simplified data: title, date, attendance, location
   */
  async getPastEvents(): Promise<PastEventListItem[]> {
    return await eventRepository.findPast();
  }

  /**
   * Format event for display (add computed fields)
   */
  formatEventForDisplay(event: EventListItem) {
    const now = new Date();

    // Calculate ticket status
    let ticketStatus = "Not Available";
    let hasTicketsAvailable = false;

    if (event.status === "published" && !event.is_sold_out) {
      const salesOpen = event.ticket_sales_open
        ? new Date(event.ticket_sales_open)
        : null;
      const salesClose = event.ticket_sales_close
        ? new Date(event.ticket_sales_close)
        : null;

      if (salesOpen && salesOpen > now) {
        ticketStatus = "Coming Soon";
      } else if (salesClose && salesClose < now) {
        ticketStatus = "Sales Ended";
      } else {
        ticketStatus = "Available";
        hasTicketsAvailable = true;
      }
    } else if (event.is_sold_out) {
      ticketStatus = "Sold Out";
    }

    return {
      ...event,
      ticketStatus,
      hasTicketsAvailable,
    };
  }
}

// Export a singleton instance
export const eventService = new EventService();
