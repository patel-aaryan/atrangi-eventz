import { pool } from "@/server/config/postgres";

/**
 * Ticket Repository - Handles all database operations for tickets
 */
export class TicketRepository {
  /**
   * Count sold tickets for a specific event and tier
   * Returns the total number of sold tickets for the given tier_index
   */
  async countSoldTicketsByTier(
    eventId: string,
    tierIndex: number
  ): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM tickets
      WHERE event_id = $1
        AND tier_index = $2
        AND status IN ('confirmed', 'pending')
    `;

    const result = await pool.query(query, [eventId, tierIndex]);

    return Number.parseInt(result.rows[0]?.count || "0", 10);
  }

  /**
   * Count all sold tickets for an event (across all tiers)
   * Returns the total number of sold tickets
   */
  async countSoldTicketsByEvent(eventId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM tickets
      WHERE event_id = $1
        AND status IN ('confirmed', 'pending')
    `;

    const result = await pool.query(query, [eventId]);

    return Number.parseInt(result.rows[0]?.count || "0", 10);
  }

  /**
   * Get sold ticket counts grouped by tier_index for an event
   * Returns a map of tier_index -> count
   */
  async getSoldTicketsByTier(eventId: string): Promise<Record<number, number>> {
    const query = `
      SELECT tier_index, COUNT(*) as count
      FROM tickets
      WHERE event_id = $1
        AND status IN ('confirmed', 'pending')
      GROUP BY tier_index
    `;

    const result = await pool.query(query, [eventId]);

    const counts: Record<number, number> = {};
    for (const row of result.rows) {
      counts[row.tier_index] = Number.parseInt(row.count || "0", 10);
    }

    return counts;
  }
}

