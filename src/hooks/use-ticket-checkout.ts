import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UpcomingEventItem } from "@/types/event";
import { reserveTicketsBatch } from "@/lib/api/tickets";

interface UseTicketCheckoutProps {
  currentEvent: UpcomingEventItem | null;
  setSelectedTickets: (tickets: Record<string, number>) => void;
  setIsOpen: (open: boolean) => void;
}

/**
 * Hook for handling ticket checkout flow (reservation and navigation)
 */
export function useTicketCheckout({
  currentEvent,
  setSelectedTickets,
  setIsOpen,
}: UseTicketCheckoutProps) {
  const router = useRouter();

  const handleProceedToCheckout = useCallback(
    async (selections: Record<string, number>) => {
      if (!currentEvent) return;

      try {
        // Update context state
        setSelectedTickets(selections);

        // Prepare reservations array from selections
        const reservations = Object.entries(selections)
          .filter(([, quantity]) => quantity > 0)
          .map(([ticketId, quantity]) => {
            const tierIndex = Number.parseInt(
              ticketId.replace("ticket-", ""),
              10
            );
            return {
              tierIndex,
              quantity,
            };
          });

        // Reserve all selected tickets atomically in a single batch operation
        // This prevents race conditions when reserving multiple tickets
        if (reservations.length > 0) {
          await reserveTicketsBatch({
            eventId: currentEvent.id,
            reservations,
          });
        }

        // Navigate to checkout
        router.push("/checkout");
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to reserve tickets:", error);
        toast.error(
          "Failed to reserve tickets. Please try again or contact support if the problem persists."
        );
        throw error;
      }
    },
    [currentEvent, router, setSelectedTickets, setIsOpen]
  );

  return { handleProceedToCheckout };
}

