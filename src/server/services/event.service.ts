import { eventRepository } from "@/server/repository/postgres/event.repository";
import type { PastEventListItem, UpcomingEventItem } from "@/types/event";

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
   * Get the next upcoming event
   * Returns null if no upcoming event is found
   */
  async getUpcomingEvent(): Promise<UpcomingEventItem | null> {
    return await eventRepository.findUpcoming();
  }
}

// Export a singleton instance
export const eventService = new EventService();
