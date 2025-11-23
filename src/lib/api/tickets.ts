/**
 * API Client for Tickets
 */

interface ReserveTicketsRequest {
  eventId: string;
  tierIndex: number;
  quantity: number;
}

interface ReserveTicketsResponse {
  reservationId: string;
}

interface ApiErrorResponse {
  error: string;
  message?: string;
}

/**
 * Reserve tickets for an event
 * Creates a reservation that expires in 20 minutes
 * @param params - Reservation parameters (eventId, tierIndex, quantity)
 * @returns The reservation ID
 */
export async function reserveTickets(
  params: ReserveTicketsRequest
): Promise<string> {
  const response = await fetch("/api/reserve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response
      .json()
      .catch(() => ({ error: "Failed to reserve tickets" }));
    throw new Error(error.message || error.error || "Failed to reserve tickets");
  }

  const data: ReserveTicketsResponse = await response.json();
  return data.reservationId;
}

