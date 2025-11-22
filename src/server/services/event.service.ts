import { EventRepository } from "@/server/repository/postgres/event.repository";
import { EventCache } from "@/server/repository/redis/event.cache";
import type { PastEventListItem, UpcomingEventItem } from "@/types/event";

/**
 * Event Service - Contains business logic for events
 */
export class EventService {
  private readonly eventRepository: EventRepository;
  private readonly eventCache: EventCache;

  constructor() {
    this.eventRepository = new EventRepository();
    this.eventCache = new EventCache();
  }

  /**
   * Get past events for showcase with caching
   * Returns simplified data: title, date, attendance, location
   */
  async getPastEvents(): Promise<PastEventListItem[]> {
    // Try to get from cache first
    const cached = await this.eventCache.getPastEvents();

    // Cache hit
    if (cached !== undefined) {
      console.log("📦 [Service] Returning cached past events");
      return cached;
    }

    // Cache miss - query database
    console.log("🗄️ [Service] Fetching past events from database...");
    const events = await this.eventRepository.findPast();

    // Store result in cache
    await this.eventCache.setPastEvents(events);

    console.log("✅ [Service] Database query complete");
    return events;
  }

  /**
   * Get the next upcoming event with caching
   * Returns null if no upcoming event is found
   */
  async getUpcomingEvent(): Promise<UpcomingEventItem | null> {
    // Try to get from cache first
    const cached = await this.eventCache.getUpcomingEvent();

    // Cache hit
    if (cached !== undefined) {
      console.log("📦 [Service] Returning cached result");
      return cached;
    }

    // Cache miss - query database
    console.log("🗄️ [Service] Fetching from database...");
    const event = await this.eventRepository.findUpcoming();

    // Store result in cache
    if (event) {
      await this.eventCache.setUpcomingEvent(event);
    } else {
      await this.eventCache.setNoUpcomingEvent();
    }

    console.log("✅ [Service] Database query complete");
    return event;
  }

  /**
   * Invalidate upcoming event cache
   * Call this when event data changes (e.g., after admin updates)
   */
  async invalidateUpcomingEventCache(): Promise<void> {
    console.log("🔄 [Service] Invalidating upcoming event cache...");
    await this.eventCache.invalidateUpcomingEvent();
  }

  /**
   * Invalidate past events cache
   * Call this when event data changes (e.g., after admin updates)
   */
  async invalidatePastEventsCache(): Promise<void> {
    console.log("🔄 [Service] Invalidating past events cache...");
    await this.eventCache.invalidatePastEvents();
  }
}
