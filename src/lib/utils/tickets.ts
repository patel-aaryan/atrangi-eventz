import type { TicketType } from "@/types/checkout";
import type { TicketTier } from "@/types/event";

/**
 * Transform TicketTier (from database) to TicketType (for frontend drawer)
 */
export function transformTicketTier(tier: TicketTier, index: number): TicketType {
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

