import { NextRequest, NextResponse } from "next/server";
import { ticketService } from "@/server/services/ticket.service";
import { reservationService } from "@/server/services/reservation.service";
import { qstashService } from "@/server/services/qstash.service";
import { getOrCreateSessionId } from "@/lib/api/session";

/**
 * POST /api/purchase/complete
 * Complete a ticket purchase after payment is successful
 * This will be called by Stripe webhook or directly after payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      eventId,
      ticketSelections,
      attendeeInfo,
      contactInfo,
      paymentInfo,
      billingInfo,
      promoCode,
    } = body;

    if (
      !eventId ||
      !ticketSelections ||
      !attendeeInfo ||
      !contactInfo ||
      !paymentInfo
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message:
            "eventId, ticketSelections, attendeeInfo, contactInfo, and paymentInfo are required",
        },
        { status: 400 }
      );
    }

    // Validate paymentInfo structure
    if (
      typeof paymentInfo.subtotal !== "number" ||
      typeof paymentInfo.total !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Invalid payment info",
          message: "paymentInfo must contain valid subtotal and total",
        },
        { status: 400 }
      );
    }

    // Complete the purchase
    const result = await ticketService.completePurchase({
      eventId,
      ticketSelections,
      attendeeInfo,
      contactInfo,
      paymentInfo,
      billingInfo,
      promoCode,
    });

    // Cancel the scheduled QStash cleanup message
    try {
      if (paymentInfo.stripePaymentIntentId) {
        await qstashService.cancelPaymentCleanup(paymentInfo.stripePaymentIntentId);
      }
    } catch (qstashError) {
      // Log but don't fail the purchase
      console.error("Failed to cancel QStash cleanup message:", qstashError);
    }

    // After a successful purchase, clear any reservations for this session/event
    // so the user's reserved tickets are removed from the cache.
    try {
      const sessionId = await getOrCreateSessionId();
      await reservationService.clearReservationsForSession(eventId, sessionId);
    } catch (cleanupError) {
      // Log cleanup errors but don't fail the purchase response because of them
      console.error(
        "Failed to clear reservations after purchase:",
        cleanupError
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        tickets: result.tickets,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error completing purchase:", error);

    return NextResponse.json(
      {
        error: "Failed to complete purchase",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

