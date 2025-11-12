import type { PastEventListItem } from "@/types/event";

/**
 * API Client for Events
 */

interface PastEventsResponse {
  events: PastEventListItem[];
  count: number;
}

/**
 * Fetch past events for showcase
 */
export async function getPastEvents(): Promise<PastEventListItem[]> {
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
  return data.events;
}
