import { ReservationCache } from "@/server/repository/redis/reservation.cache";
import { TicketRepository } from "@/server/repository/postgres/ticket.repository";
import { EventRepository } from "@/server/repository/postgres/event.repository";

interface ReserveTicketsParams {
  eventId: string;
  tierIndex: number;
  requestedQuantity: number;
  sessionId: string;
}

interface ReserveTicketsResult {
  reservationId: string;
}

/**
 * Reservation Service - Contains business logic for ticket reservations
 */
export class ReservationService {
  private readonly reservationCache: ReservationCache;
  private readonly ticketRepository: TicketRepository;
  private readonly eventRepository: EventRepository;

  constructor() {
    this.reservationCache = new ReservationCache();
    this.ticketRepository = new TicketRepository();
    this.eventRepository = new EventRepository();
  }

  /**
   * Reserve tickets for an event
   * This method handles locking, availability checking, and reservation creation
   */
  async reserveTickets(
    params: ReserveTicketsParams
  ): Promise<ReserveTicketsResult> {
    const { eventId, tierIndex, requestedQuantity, sessionId } = params;

    // Validate inputs
    if (requestedQuantity <= 0) {
      throw new Error("Requested quantity must be greater than 0");
    }

    // Get event to validate tier exists and get capacity
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new Error(`Event with ID ${eventId} does not exist`);

    // Validate tier exists
    if (!event.ticket_tiers || tierIndex >= event.ticket_tiers.length) {
      throw new Error(`Tier at index ${tierIndex} does not exist`);
    }

    const tier = event.ticket_tiers[tierIndex];
    const tierCapacity = tier.capacity;

    if (requestedQuantity > tierCapacity) {
      throw new Error(
        `Requested quantity (${requestedQuantity}) exceeds tier capacity (${tierCapacity})`
      );
    }

    // Acquire lock for the event
    const lockAcquired = await this.reservationCache.acquireLock(eventId);
    if (!lockAcquired) {
      throw new Error(
        "Event is currently being processed. Please wait and try again."
      );
    }

    try {
      // 1. Sum sold tickets from Postgres
      const soldTickets = await this.ticketRepository.countSoldTicketsByTier(
        eventId,
        tierIndex
      );

      // 2. Get reserved tickets from Redis and sum for this specific tier
      const reservations = await this.reservationCache.getReservations(eventId);
      const reservedTickets = reservations
        .filter((reservation) => reservation.tierIndex === tierIndex)
        .reduce((sum, reservation) => sum + reservation.quantity, 0);

      // 3. Calculate available tickets
      const totalUsed = soldTickets + reservedTickets;
      const available = tierCapacity - totalUsed;

      // 4. Check if requested quantity is available
      if (requestedQuantity > available) {
        throw new Error(
          `Only ${available} tickets available. Requested: ${requestedQuantity}`
        );
      }

      // 5. Create reservation
      const reservationId = await this.reservationCache.createReservation(
        eventId,
        sessionId,
        requestedQuantity,
        tierIndex
      );

      return { reservationId };
    } finally {
      // Always release the lock, even if an error occurs
      await this.reservationCache.releaseLock(eventId);
    }
  }

  /**
   * Get reservations for an event by session ID
   * Returns array of reservations with tierIndex and quantity
   */
  async getReservationsBySession(
    eventId: string,
    sessionId: string
  ): Promise<Array<{ tierIndex: number; quantity: number }>> {
    const reservations =
      await this.reservationCache.getReservationsBySession(eventId, sessionId);
    return reservations.map((reservation) => ({
      tierIndex: reservation.tierIndex,
      quantity: reservation.quantity,
    }));
  }
}
