import { useEffect, useRef } from "react";
import type { UpcomingEventItem } from "@/types/event";
import { getReservations } from "@/lib/api/tickets";
import { getUpcomingEvent } from "@/lib/api/events";

interface UseTicketReservationsProps {
  currentEvent: UpcomingEventItem | null;
  setCurrentEvent: (event: UpcomingEventItem | null) => void;
  setSelectedTickets: (tickets: Record<string, number>) => void;
}

/**
 * Hook to fetch and sync ticket reservations from cache
 */
export function useTicketReservations({
  currentEvent,
  setCurrentEvent,
  setSelectedTickets,
}: UseTicketReservationsProps) {
  // Track if we've already fetched reservations for the current event
  const fetchedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      let event = currentEvent;
      let eventId: string | null = null;

      // If no event is set, try to fetch the upcoming event
      if (event === null) {
        try {
          event = await getUpcomingEvent();
          if (!event) return;

          eventId = event.id;

          if (fetchedEventIdRef.current !== eventId) setCurrentEvent(event);
        } catch (error) {
          console.error("Failed to fetch upcoming event:", error);
          return;
        }
      } else {
        eventId = event.id;
      }

      // Prevent duplicate fetches for the same event
      if (!eventId || fetchedEventIdRef.current === eventId) return;
      // Mark that we're fetching for this event
      fetchedEventIdRef.current = eventId;

      // Now fetch reservations for this event
      try {
        const reservations = await getReservations(eventId);

        // Transform reservations into selectedTickets format
        // Reservations have tierIndex and quantity
        const tickets: Record<string, number> = {};
        for (const reservation of reservations) {
          const ticketId = `ticket-${reservation.tierIndex}`;
          // Sum quantities if multiple reservations exist for the same tier
          tickets[ticketId] = (tickets[ticketId] || 0) + reservation.quantity;
        }

        // Only update if we have reservations (don't overwrite user selections)
        if (Object.keys(tickets).length > 0) setSelectedTickets(tickets);
      } catch (error) {
        console.error("Failed to fetch reservations from cache:", error);
        // Reset the ref on error so we can retry
        fetchedEventIdRef.current = null;
        // Silently fail - user can still select tickets manually
      }
    };

    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id]); // Only fetch when event ID changes
}

