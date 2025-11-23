import { NextRequest, NextResponse } from "next/server";
import { ReservationService } from "@/server/services/reservation.service";
import { validateReservationRequest, handleReservationError } from "@/lib/api/validation";
import { getOrCreateSessionId } from "@/lib/api/session";

/**
 * POST /api/reserve
 * Reserve tickets for an event
 * Creates a reservation that expires in 20 minutes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, tierIndex, quantity } = body;

    // Validate request
    const validationError = validateReservationRequest(body);
    if (validationError) return validationError;

    // Get or create sessionId
    const sessionId = await getOrCreateSessionId();

    // Create reservation (service handles event validation and tier capacity)
    const reservationService = new ReservationService();
    const result = await reservationService.reserveTickets({
      eventId,
      tierIndex,
      requestedQuantity: quantity,
      sessionId,
    });

    return NextResponse.json({ reservationId: result.reservationId }, { status: 200 });
  } catch (error) {
    return handleReservationError(error);
  }
}

