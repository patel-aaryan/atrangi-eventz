import { redis } from "@/server/config/redis";
import type {
  UpcomingEventItem,
  PastEventListItem,
  EventDetail,
} from "@/types/event";
import type { GalleryImage } from "@/server/types/r2";

/**
 * Event Cache - Handles all Redis cache operations for events
 */
export class EventCache {
  private readonly UPCOMING_EVENT_CACHE_KEY = "upcoming-event";
  private readonly PAST_EVENTS_CACHE_KEY = "past-events";
  private readonly EVENT_DETAIL_CACHE_PREFIX = "event-detail:";
  private readonly EVENT_IMAGES_CACHE_PREFIX = "event-images:";
  private readonly UPCOMING_EVENT_CACHE_TTL = 86400; // 1 day in seconds
  private readonly NO_EVENT_CACHE_TTL = 21600; // 6 hours in seconds
  private readonly PAST_EVENTS_CACHE_TTL = 86400; // 1 day in seconds
  private readonly EVENT_DETAIL_CACHE_TTL = 3600; // 1 hour in seconds
  private readonly EVENT_IMAGES_CACHE_TTL = 86400; // 1 day in seconds
  private readonly NO_EVENT_MARKER = "__NO_EVENT__"; // Special marker for null results

  /**
   * Get upcoming event from cache
   * Returns undefined if not in cache, null if cached as "no event"
   */
  async getUpcomingEvent(): Promise<UpcomingEventItem | null | undefined> {
    try {
      console.log("🔍 [Cache] Checking Redis for upcoming event...");

      // First check if key exists
      const exists = await redis.exists(this.UPCOMING_EVENT_CACHE_KEY);

      if (exists === 0) {
        console.log("❌ [Cache] MISS - Key not found");
        return undefined;
      }

      // Key exists, get the value
      const cached = await redis.get<UpcomingEventItem | string>(
        this.UPCOMING_EVENT_CACHE_KEY
      );

      // Check if it's our special "no event" marker
      if (cached === this.NO_EVENT_MARKER) {
        console.log("✅ [Cache] HIT - Cached result: no upcoming event");
        return null;
      }

      // It's an actual event object
      if (cached) {
        console.log("✅ [Cache] HIT - Found cached upcoming event");
        return cached as UpcomingEventItem;
      }

      console.log("❌ [Cache] MISS - Key exists but value is unexpected");
      return undefined;
    } catch (error) {
      console.error("⚠️ [Cache] Error reading from Redis:", error);
      return undefined; // Cache miss on error
    }
  }

  /**
   * Cache an upcoming event
   */
  async setUpcomingEvent(event: UpcomingEventItem): Promise<void> {
    try {
      console.log(
        `💾 [Cache] Storing upcoming event (TTL: ${this.UPCOMING_EVENT_CACHE_TTL}s)`
      );
      await redis.set(this.UPCOMING_EVENT_CACHE_KEY, event, {
        ex: this.UPCOMING_EVENT_CACHE_TTL,
      });
      console.log("✅ [Cache] Event cached successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error writing to Redis:", error);
      // Don't throw - caching failures shouldn't break the app
    }
  }

  /**
   * Cache that no upcoming event exists
   */
  async setNoUpcomingEvent(): Promise<void> {
    try {
      console.log(
        `💾 [Cache] Storing "no event" marker (TTL: ${this.NO_EVENT_CACHE_TTL}s)`
      );
      // Use a special marker string instead of null so we can distinguish
      // between "key doesn't exist" and "key exists with null value"
      await redis.set(this.UPCOMING_EVENT_CACHE_KEY, this.NO_EVENT_MARKER, {
        ex: this.NO_EVENT_CACHE_TTL,
      });
      console.log("✅ [Cache] Null result cached successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error writing to Redis:", error);
      // Don't throw - caching failures shouldn't break the app
    }
  }

  /**
   * Get past events from cache
   * Returns undefined if not in cache
   */
  async getPastEvents(): Promise<PastEventListItem[] | undefined> {
    try {
      console.log("🔍 [Cache] Checking Redis for past events...");

      // First check if key exists
      const exists = await redis.exists(this.PAST_EVENTS_CACHE_KEY);

      if (exists === 0) {
        console.log("❌ [Cache] MISS - Past events key not found");
        return undefined;
      }

      // Key exists, get the value
      const cached = await redis.get<PastEventListItem[]>(
        this.PAST_EVENTS_CACHE_KEY
      );

      if (cached && Array.isArray(cached)) {
        console.log(
          `✅ [Cache] HIT - Found ${cached.length} cached past events`
        );
        return cached;
      }

      console.log("❌ [Cache] MISS - Key exists but value is unexpected");
      return undefined;
    } catch (error) {
      console.error("⚠️ [Cache] Error reading past events from Redis:", error);
      return undefined; // Cache miss on error
    }
  }

  /**
   * Cache past events
   */
  async setPastEvents(events: PastEventListItem[]): Promise<void> {
    try {
      console.log(
        `💾 [Cache] Storing ${events.length} past events (TTL: ${this.PAST_EVENTS_CACHE_TTL}s)`
      );
      await redis.set(this.PAST_EVENTS_CACHE_KEY, events, {
        ex: this.PAST_EVENTS_CACHE_TTL,
      });
      console.log("✅ [Cache] Past events cached successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error writing past events to Redis:", error);
      // Don't throw - caching failures shouldn't break the app
    }
  }

  /**
   * Get event detail by slug from cache
   * Returns undefined if not in cache, null if cached as "no event"
   */
  async getEventDetail(slug: string): Promise<EventDetail | null | undefined> {
    try {
      const cacheKey = `${this.EVENT_DETAIL_CACHE_PREFIX}${slug}`;
      console.log(`🔍 [Cache] Checking Redis for event detail: ${slug}`);

      const exists = await redis.exists(cacheKey);

      if (exists === 0) {
        console.log("❌ [Cache] MISS - Event detail key not found");
        return undefined;
      }

      const cached = await redis.get<EventDetail | string>(cacheKey);

      if (cached === this.NO_EVENT_MARKER) {
        console.log("✅ [Cache] HIT - Cached result: no event found");
        return null;
      }

      if (cached) {
        console.log(`✅ [Cache] HIT - Found cached event detail: ${slug}`);
        return cached as EventDetail;
      }

      console.log("❌ [Cache] MISS - Key exists but value is unexpected");
      return undefined;
    } catch (error) {
      console.error("⚠️ [Cache] Error reading event detail from Redis:", error);
      return undefined;
    }
  }

  /**
   * Cache event detail
   */
  async setEventDetail(slug: string, event: EventDetail): Promise<void> {
    try {
      const cacheKey = `${this.EVENT_DETAIL_CACHE_PREFIX}${slug}`;
      console.log(
        `💾 [Cache] Storing event detail: ${slug} (TTL: ${this.EVENT_DETAIL_CACHE_TTL}s)`
      );
      await redis.set(cacheKey, event, {
        ex: this.EVENT_DETAIL_CACHE_TTL,
      });
      console.log("✅ [Cache] Event detail cached successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error writing event detail to Redis:", error);
    }
  }

  /**
   * Cache that no event exists for a slug
   */
  async setNoEventDetail(slug: string): Promise<void> {
    try {
      const cacheKey = `${this.EVENT_DETAIL_CACHE_PREFIX}${slug}`;
      console.log(
        `💾 [Cache] Storing "no event" marker for: ${slug} (TTL: ${this.NO_EVENT_CACHE_TTL}s)`
      );
      await redis.set(cacheKey, this.NO_EVENT_MARKER, {
        ex: this.NO_EVENT_CACHE_TTL,
      });
      console.log("✅ [Cache] Null result cached successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error writing to Redis:", error);
    }
  }

  /**
   * Get event images from cache
   */
  async getEventImages(slug: string): Promise<GalleryImage[] | undefined> {
    try {
      const cacheKey = `${this.EVENT_IMAGES_CACHE_PREFIX}${slug}`;
      console.log(`🔍 [Cache] Checking Redis for event images: ${slug}`);

      const exists = await redis.exists(cacheKey);

      if (exists === 0) {
        console.log("❌ [Cache] MISS - Event images key not found");
        return undefined;
      }

      const cached = await redis.get<GalleryImage[]>(cacheKey);

      if (cached && Array.isArray(cached)) {
        console.log(
          `✅ [Cache] HIT - Found ${cached.length} cached images for: ${slug}`
        );
        return cached;
      }

      console.log("❌ [Cache] MISS - Key exists but value is unexpected");
      return undefined;
    } catch (error) {
      console.error("⚠️ [Cache] Error reading event images from Redis:", error);
      return undefined;
    }
  }

  /**
   * Cache event images
   */
  async setEventImages(slug: string, images: GalleryImage[]): Promise<void> {
    try {
      const cacheKey = `${this.EVENT_IMAGES_CACHE_PREFIX}${slug}`;
      console.log(
        `💾 [Cache] Storing ${images.length} images for: ${slug} (TTL: ${this.EVENT_IMAGES_CACHE_TTL}s)`
      );
      await redis.set(cacheKey, images, {
        ex: this.EVENT_IMAGES_CACHE_TTL,
      });
      console.log("✅ [Cache] Event images cached successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error writing event images to Redis:", error);
    }
  }
}
