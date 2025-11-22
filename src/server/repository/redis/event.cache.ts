import { redis } from "@/server/config/redis";
import type { UpcomingEventItem, PastEventListItem } from "@/types/event";

/**
 * Event Cache - Handles all Redis cache operations for events
 */
export class EventCache {
  private readonly UPCOMING_EVENT_CACHE_KEY = "upcoming-event";
  private readonly PAST_EVENTS_CACHE_KEY = "past-events";
  private readonly UPCOMING_EVENT_CACHE_TTL = 86400; // 1 day in seconds
  private readonly NO_EVENT_CACHE_TTL = 21600; // 6 hours in seconds
  private readonly PAST_EVENTS_CACHE_TTL = 86400; // 1 day in seconds
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
   * Invalidate upcoming event cache
   * Call this when event data changes (e.g., after admin updates)
   */
  async invalidateUpcomingEvent(): Promise<void> {
    try {
      console.log("🗑️ [Cache] Invalidating upcoming event cache...");
      await redis.del(this.UPCOMING_EVENT_CACHE_KEY);
      console.log("✅ [Cache] Cache invalidated successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error invalidating cache:", error);
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
   * Invalidate past events cache
   * Call this when event data changes (e.g., after admin updates)
   */
  async invalidatePastEvents(): Promise<void> {
    try {
      console.log("🗑️ [Cache] Invalidating past events cache...");
      await redis.del(this.PAST_EVENTS_CACHE_KEY);
      console.log("✅ [Cache] Past events cache invalidated successfully");
    } catch (error) {
      console.error("⚠️ [Cache] Error invalidating past events cache:", error);
    }
  }
}
