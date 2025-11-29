import { NextRequest, NextResponse } from "next/server";
import { TicketService } from "@/server/services/ticket.service";

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
    const ticketService = new TicketService();
    const result = await ticketService.completePurchase({
      eventId,
      ticketSelections,
      attendeeInfo,
      contactInfo,
      paymentInfo,
      billingInfo,
      promoCode,
    });

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

