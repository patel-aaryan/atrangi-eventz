import type { PastEventListItem, UpcomingEventItem } from "@/types/event";

/**
 * API Client for Events
 */

interface PastEventsResponse {
  events: PastEventListItem[];
  count: number;
}

interface UpcomingEventResponse {
  event: UpcomingEventItem | null;
  message?: string;
}

/**
 * Fetch past events for showcase
 */
export async function getPastEvents(): Promise<PastEventListItem[]> {
  console.log("🔍 [API] Fetching past events from server...");

  const response = await fetch("/api/events/past", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch past events" }));
    throw new Error(error.error || "Failed to fetch past events");
  }

  const data: PastEventsResponse = await response.json();
  console.log(
    `✅ [API] Past events fetched successfully (${data.events.length} events)`
  );
  return data.events;
}

/**
 * Fetch the next upcoming event
 * Returns null if no upcoming event is found
 */
export async function getUpcomingEvent(): Promise<UpcomingEventItem | null> {
  const response = await fetch("/api/events/upcoming", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch upcoming event" }));
    throw new Error(error.error || "Failed to fetch upcoming event");
  }

  const data: UpcomingEventResponse = await response.json();
  return data.event;
}
