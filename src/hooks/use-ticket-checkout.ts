import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UpcomingEventItem } from "@/types/event";
import { reserveTickets } from "@/lib/api/tickets";

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

        // Reserve all selected tickets before navigating
        const reservationPromises = Object.entries(selections)
          .filter(([, quantity]) => quantity > 0)
          .map(([ticketId, quantity]) => {
            const tierIndex = Number.parseInt(
              ticketId.replace("ticket-", ""),
              10
            );
            return reserveTickets({
              eventId: currentEvent.id,
              tierIndex,
              quantity,
            });
          });

        // Wait for all reservations to complete
        await Promise.all(reservationPromises);

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

