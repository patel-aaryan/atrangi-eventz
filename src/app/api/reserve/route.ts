import { NextRequest, NextResponse } from "next/server";
import { ReservationService } from "@/server/services/reservation.service";
import { validateReservationRequest, handleReservationError } from "@/lib/api/validation";
import { getOrCreateSessionId } from "@/lib/api/session";


/**
 * GET /api/reservations?eventId=<eventId>
 * Get reservations for the current session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        {
          error: "Missing eventId",
          message: "eventId query parameter is required",
        },
        { status: 400 }
      );
    }

    // Get sessionId from cookies
    const sessionId = await getOrCreateSessionId();

    // Get reservations for this session
    const reservationService = new ReservationService();
    const reservations = await reservationService.getReservationsBySession(
      eventId,
      sessionId
    );

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reservations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


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

