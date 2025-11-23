"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { TicketSelectionDrawer } from "@/components/events/ticket-selection-drawer";
import type { TicketType } from "@/types/checkout";
import type { UpcomingEventItem, TicketTier } from "@/types/event";
import { reserveTickets } from "@/lib/api/tickets";

interface TicketSelection {
  ticketId: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: number;
}

interface TicketContextType {
  // Drawer state
  isOpen: boolean;
  openDrawer: (event: UpcomingEventItem) => void;
  closeDrawer: () => void;

  // Current event
  currentEvent: UpcomingEventItem | null;
  setCurrentEvent: (event: UpcomingEventItem | null) => void;

  // Ticket selection state
  selectedTickets: Record<string, number>;
  setSelectedTickets: (selections: Record<string, number>) => void;

  // Ticket management helpers
  addTicket: (ticketId: string, quantity?: number) => void;
  removeTicket: (ticketId: string, quantity?: number) => void;
  updateTicketQuantity: (ticketId: string, quantity: number) => void;
  clearSelections: () => void;

  // Computed values
  totalTickets: number;
  subtotal: number;
  ticketSelections: TicketSelection[]; // Formatted selections with details
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

interface TicketProviderProps {
  readonly children: ReactNode;
}

/**
 * Transform TicketTier (from database) to TicketType (for frontend drawer)
 */
function transformTicketTier(tier: TicketTier, index: number): TicketType {
  const available = tier.capacity - tier.sold;
  return {
    id: `ticket-${index}`,
    name: tier.name,
    price: tier.price,
    description: tier.description || "",
    maxQuantity: Math.min(10, available), // Max 10 per order or available
    available,
    features: tier.features || [],
  };
}

export function TicketProvider({ children }: TicketProviderProps) {
  const router = useRouter();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<UpcomingEventItem | null>(
    null
  );
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  // Drawer controls
  const openDrawer = useCallback((event: UpcomingEventItem) => {
    setCurrentEvent(event);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    // Keep selections and event data - don't clear automatically
  }, []);

  // Ticket management helpers
  const addTicket = useCallback((ticketId: string, quantity: number = 1) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || 0) + quantity,
    }));
  }, []);

  const removeTicket = useCallback((ticketId: string, quantity: number = 1) => {
    setSelectedTickets((prev) => {
      const currentQty = prev[ticketId] || 0;
      const newQty = Math.max(0, currentQty - quantity);

      if (newQty === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [ticketId]: newQty };
    });
  }, []);

  const updateTicketQuantity = useCallback(
    (ticketId: string, quantity: number) => {
      if (quantity <= 0) {
        // Remove ticket if quantity is 0 or negative
        setSelectedTickets((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [ticketId]: _, ...rest } = prev;
          return rest;
        });
      } else {
        setSelectedTickets((prev) => ({
          ...prev,
          [ticketId]: quantity,
        }));
      }
    },
    []
  );

  const clearSelections = useCallback(() => {
    setSelectedTickets({});
  }, []);

  // Transform ticket tiers for the drawer
  const ticketTypes = useMemo(() => {
    if (!currentEvent?.ticket_tiers) return [];
    return currentEvent.ticket_tiers.map((tier, index) =>
      transformTicketTier(tier, index)
    );
  }, [currentEvent]);

  // Computed values
  const totalTickets = useMemo(() => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  }, [selectedTickets]);

  const ticketSelections = useMemo((): TicketSelection[] => {
    if (!currentEvent?.ticket_tiers) return [];

    return Object.entries(selectedTickets)
      .map(([ticketId, quantity]) => {
        const index = Number.parseInt(ticketId.replace("ticket-", ""));
        const tier = currentEvent.ticket_tiers[index];

        if (!tier) return null;

        return {
          ticketId,
          ticketName: tier.name,
          quantity,
          pricePerTicket: tier.price,
        };
      })
      .filter((item): item is TicketSelection => item !== null);
  }, [selectedTickets, currentEvent]);

  const subtotal = useMemo(() => {
    return ticketSelections.reduce(
      (sum, selection) => sum + selection.quantity * selection.pricePerTicket,
      0
    );
  }, [ticketSelections]);

  // Format event date
  const formattedEventDate = useMemo(() => {
    if (!currentEvent) return "";
    const eventDate = new Date(currentEvent.start_date);
    return eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [currentEvent]);

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
        // TODO: Show error toast/notification to user
        throw error;
      }
    },
    [currentEvent, router]
  );

  const value = useMemo(
    () => ({
      // Drawer state
      isOpen,
      openDrawer,
      closeDrawer,

      // Current event
      currentEvent,
      setCurrentEvent,

      // Ticket selection state
      selectedTickets,
      setSelectedTickets,

      // Ticket management helpers
      addTicket,
      removeTicket,
      updateTicketQuantity,
      clearSelections,

      // Computed values
      totalTickets,
      subtotal,
      ticketSelections,
    }),
    [
      isOpen,
      openDrawer,
      closeDrawer,
      currentEvent,
      selectedTickets,
      addTicket,
      removeTicket,
      updateTicketQuantity,
      clearSelections,
      totalTickets,
      subtotal,
      ticketSelections,
    ]
  );

  return (
    <TicketContext.Provider value={value}>
      {children}
      {currentEvent && (
        <TicketSelectionDrawer
          open={isOpen}
          onOpenChange={setIsOpen}
          eventTitle={currentEvent.title}
          eventDate={formattedEventDate}
          eventLocation={
            currentEvent.venue_name || currentEvent.venue_city || "TBA"
          }
          ticketTypes={ticketTypes}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicket must be used within TicketProvider");
  }
  return context;
}
