import { EventRepository } from "@/server/repository/postgres/event.repository";
import { EventCache } from "@/server/repository/redis/event.cache";
import { r2Service } from "@/server/services/r2.service";
import type { GalleryImage } from "@/server/types/r2";
import type {
  PastEventListItem,
  UpcomingEventItem,
  EventDetail,
} from "@/types/event";

/**
 * Event Service - Contains business logic for events
 */
class EventService {
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
   * Get event details by slug with caching
   * Returns null if event is not found
   */
  async getEventBySlug(slug: string): Promise<EventDetail | null> {
    // Try to get from cache first
    const cached = await this.eventCache.getEventDetail(slug);

    // Cache hit
    if (cached !== undefined) {
      console.log(`📦 [Service] Returning cached event detail: ${slug}`);
      return cached;
    }

    // Cache miss - query database
    console.log(`🗄️ [Service] Fetching event detail from database: ${slug}`);
    const event = await this.eventRepository.findBySlug(slug);

    // Store result in cache
    if (event) {
      await this.eventCache.setEventDetail(slug, event);
    } else {
      await this.eventCache.setNoEventDetail(slug);
    }

    console.log("✅ [Service] Database query complete");
    return event;
  }

  /**
   * Get event gallery images from R2 with caching
   * Returns array of image URLs
   */
  async getEventImages(slug: string): Promise<GalleryImage[]> {
    // Try to get from cache first
    const cached = await this.eventCache.getEventImages(slug);

    // Cache hit
    if (cached !== undefined) {
      console.log(`📦 [Service] Returning cached event images: ${slug}`);
      return cached;
    }

    // Cache miss - fetch from R2
    console.log(`🗂️ [Service] Fetching event images from R2: ${slug}`);
    const images = await r2Service.listEventImages(slug);

    // Store result in cache
    await this.eventCache.setEventImages(slug, images);

    console.log("✅ [Service] R2 fetch complete");
    return images;
  }
}

export const eventService = new EventService();
