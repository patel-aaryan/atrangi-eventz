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

  // Promo code
  promoCode: string | null;
  setPromoCode: (code: string | null) => void;

  // Computed values
  totalTickets: number;
  subtotal: number;
  ticketSelections: TicketSelection[]; // Formatted selections with details

  // Navigation
  proceedToCheckout: () => void;
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
  const [promoCode, setPromoCode] = useState<string | null>(null);

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
    setPromoCode(null);
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

  // Navigation
  const proceedToCheckout = useCallback(() => {
    if (!currentEvent || totalTickets === 0) return;

    const params = new URLSearchParams({
      event: currentEvent.slug,
      tickets: JSON.stringify(selectedTickets),
    });

    if (promoCode) params.set("promo", promoCode);

    router.push(`/checkout?${params.toString()}`);
    setIsOpen(false);
  }, [currentEvent, selectedTickets, promoCode, totalTickets, router]);

  const handleProceedToCheckout = useCallback(
    (selections: Record<string, number>, code?: string) => {
      if (!currentEvent) return;

      // Update context state
      setSelectedTickets(selections);
      if (code) setPromoCode(code);

      // Navigate to checkout
      const params = new URLSearchParams({
        event: currentEvent.slug,
        tickets: JSON.stringify(selections),
      });

      if (code) params.set("promo", code);

      router.push(`/checkout?${params.toString()}`);
      setIsOpen(false);
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

      // Promo code
      promoCode,
      setPromoCode,

      // Computed values
      totalTickets,
      subtotal,
      ticketSelections,

      // Navigation
      proceedToCheckout,
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
      promoCode,
      totalTickets,
      subtotal,
      ticketSelections,
      proceedToCheckout,
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
