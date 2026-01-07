import { pool } from "@/server/config/postgres";
import type {
  PastEventListItem,
  UpcomingEventItem,
  UpcomingEventStatic,
  EventDetailStatic,
  TicketAvailability,
} from "@/types/event";

/**
 * Event Repository - Handles all database operations for events
 */
export class EventRepository {
  /**
   * Find past published events for showcase
   * Only queries essential data: title, date, attendance, sponsors, volunteers, location, and image
   */
  async findPast(): Promise<PastEventListItem[]> {
    const query = `
      SELECT 
        id, 
        title, 
        slug, 
        description,
        start_date, 
        end_date,
        venue_name, 
        venue_city,
        total_tickets_sold,
        num_sponsors,
        num_volunteers,
        thumbnail_image
      FROM events
      WHERE status = 'completed' 
        AND is_public = true
        AND start_date < CURRENT_TIMESTAMP
      ORDER BY start_date DESC
    `;

    const result = await pool.query(query);

    return result.rows.map((row) => this.mapRowToPastEventListItem(row));
  }

  /**
   * Find an event by ID
   * Returns null if event is not found
   */
  async findById(eventId: string): Promise<UpcomingEventItem | null> {
    const query = `
      SELECT 
        id, 
        title, 
        slug, 
        description,
        start_date, 
        end_date,
        venue_name, 
        venue_city,
        total_capacity,
        total_tickets_sold,
        GREATEST(0, total_capacity - total_tickets_sold) as tickets_remaining,
        is_sold_out,
        ticket_sales_open,
        ticket_sales_close,
        thumbnail_image,
        banner_image,
        ticket_tiers
      FROM events
      WHERE id = $1
    `;

    const result = await pool.query(query, [eventId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUpcomingEventItem(result.rows[0]);
  }

  /**
   * Find the next upcoming published event (static data only)
   * Returns null if no upcoming event is found
   * This excludes dynamic ticket counts for efficient caching
   */
  async findUpcomingStatic(): Promise<UpcomingEventStatic | null> {
    const query = `
      SELECT 
        id, 
        title, 
        slug, 
        description,
        start_date, 
        end_date,
        venue_name, 
        venue_city,
        total_capacity,
        ticket_sales_open,
        ticket_sales_close,
        thumbnail_image,
        banner_image,
        ticket_tiers
      FROM events
      WHERE status = 'published' 
        AND is_public = true
        AND start_date > CURRENT_TIMESTAMP
      ORDER BY start_date ASC
      LIMIT 1
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUpcomingEventStatic(result.rows[0]);
  }

  /**
   * Get ticket availability for an event (dynamic data only)
   * Returns current ticket counts and sold status
   */
  async getTicketAvailability(
    eventId: string
  ): Promise<TicketAvailability | null> {
    const query = `
      SELECT 
        total_capacity,
        total_tickets_sold,
        GREATEST(0, total_capacity - total_tickets_sold) as tickets_remaining,
        is_sold_out,
        ticket_tiers
      FROM events
      WHERE id = $1
    `;

    const result = await pool.query(query, [eventId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const ticketTiers = row.ticket_tiers || [];

    return {
      total_tickets_sold: row.total_tickets_sold || 0,
      tickets_remaining: row.tickets_remaining || 0,
      is_sold_out: row.is_sold_out || false,
      ticket_tiers_sold: ticketTiers.map((tier: any) => tier.sold || 0),
    };
  }

  /**
   * Map database row to PastEventListItem object
   */
  private mapRowToPastEventListItem(row: any): PastEventListItem {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      start_date: row.start_date?.toISOString() || row.start_date,
      end_date: row.end_date?.toISOString() || row.end_date,
      venue_name: row.venue_name,
      venue_city: row.venue_city,
      total_tickets_sold: row.total_tickets_sold || 0,
      num_sponsors: row.num_sponsors || 0,
      num_volunteers: row.num_volunteers || 0,
      thumbnail_image: row.thumbnail_image,
    };
  }

  /**
   * Map database row to UpcomingEventItem object
   */
  private mapRowToUpcomingEventItem(row: any): UpcomingEventItem {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      start_date: row.start_date?.toISOString() || row.start_date,
      end_date: row.end_date?.toISOString() || row.end_date,
      venue_name: row.venue_name,
      venue_city: row.venue_city,
      total_capacity: row.total_capacity,
      total_tickets_sold: row.total_tickets_sold || 0,
      tickets_remaining: row.tickets_remaining || 0,
      is_sold_out: row.is_sold_out || false,
      ticket_sales_open:
        row.ticket_sales_open?.toISOString() || row.ticket_sales_open,
      ticket_sales_close:
        row.ticket_sales_close?.toISOString() || row.ticket_sales_close,
      thumbnail_image: row.thumbnail_image,
      banner_image: row.banner_image,
      ticket_tiers: row.ticket_tiers || [],
    };
  }

  /**
   * Map database row to UpcomingEventStatic object (no ticket counts)
   */
  private mapRowToUpcomingEventStatic(row: any): UpcomingEventStatic {
    const ticketTiers = row.ticket_tiers || [];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      start_date: row.start_date?.toISOString() || row.start_date,
      end_date: row.end_date?.toISOString() || row.end_date,
      venue_name: row.venue_name,
      venue_city: row.venue_city,
      total_capacity: row.total_capacity,
      ticket_sales_open:
        row.ticket_sales_open?.toISOString() || row.ticket_sales_open,
      ticket_sales_close:
        row.ticket_sales_close?.toISOString() || row.ticket_sales_close,
      thumbnail_image: row.thumbnail_image,
      banner_image: row.banner_image,
      // Map ticket tiers without sold counts
      ticket_tiers: ticketTiers.map((tier: any) => ({
        name: tier.name,
        price: tier.price,
        capacity: tier.capacity,
        available_until: tier.available_until,
        description: tier.description,
        features: tier.features,
      })),
    };
  }

  /**
   * Find an event by slug (static data only)
   * Returns null if event is not found or not public
   * This excludes dynamic ticket counts for efficient caching
   */
  async findBySlugStatic(slug: string): Promise<EventDetailStatic | null> {
    const query = `
      SELECT 
        id, 
        title, 
        slug, 
        description,
        start_date, 
        end_date,
        venue_name,
        venue_address,
        venue_city,
        venue_province,
        venue_postal_code,
        venue_country,
        total_capacity,
        ticket_sales_open,
        ticket_sales_close,
        thumbnail_image,
        banner_image,
        ticket_tiers,
        num_sponsors,
        num_volunteers,
        status,
        meta_title,
        meta_description,
        tags,
        gallery_images
      FROM events
      WHERE slug = $1
        AND is_public = true
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToEventDetailStatic(result.rows[0]);
  }

  /**
   * Map database row to EventDetailStatic object (no ticket counts)
   */
  private mapRowToEventDetailStatic(row: any): EventDetailStatic {
    const ticketTiers = row.ticket_tiers || [];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      start_date: row.start_date?.toISOString() || row.start_date,
      end_date: row.end_date?.toISOString() || row.end_date,
      venue_name: row.venue_name,
      venue_address: row.venue_address,
      venue_city: row.venue_city,
      venue_province: row.venue_province,
      venue_postal_code: row.venue_postal_code,
      venue_country: row.venue_country,
      total_capacity: row.total_capacity,
      ticket_sales_open:
        row.ticket_sales_open?.toISOString() || row.ticket_sales_open,
      ticket_sales_close:
        row.ticket_sales_close?.toISOString() || row.ticket_sales_close,
      thumbnail_image: row.thumbnail_image,
      banner_image: row.banner_image,
      // Map ticket tiers without sold counts
      ticket_tiers: ticketTiers.map((tier: any) => ({
        name: tier.name,
        price: tier.price,
        capacity: tier.capacity,
        available_until: tier.available_until,
        description: tier.description,
        features: tier.features,
      })),
      num_sponsors: row.num_sponsors || 0,
      num_volunteers: row.num_volunteers || 0,
      status: row.status,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      tags: row.tags || [],
      gallery_images: row.gallery_images || [],
    };
  }

  /**
   * Increment total tickets sold for an event
   * Also updates the sold count in the ticket_tiers JSONB array
   * @param eventId - The event ID
   * @param ticketsBySier - Array of {tierIndex, quantity} to increment
   */
  async incrementTicketsSold(
    eventId: string,
    ticketsByTier: Array<{ tierIndex: number; quantity: number }>
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Calculate total quantity across all tiers
      const totalQuantity = ticketsByTier.reduce(
        (sum, tier) => sum + tier.quantity,
        0
      );

      // Update total_tickets_sold
      await client.query(
        `
        UPDATE events 
        SET total_tickets_sold = total_tickets_sold + $1
        WHERE id = $2
      `,
        [totalQuantity, eventId]
      );

      // Update each tier's sold count in the ticket_tiers JSONB
      for (const { tierIndex, quantity } of ticketsByTier) {
        await client.query(
          `
          UPDATE events
          SET ticket_tiers = jsonb_set(
            ticket_tiers,
            $1,
            (COALESCE((ticket_tiers->$2->>'sold')::integer, 0) + $3)::text::jsonb
          )
          WHERE id = $4
        `,
          [
            `{${tierIndex},sold}`, // JSONB path for the sold field
            tierIndex.toString(), // Access the tier by index
            quantity,
            eventId,
          ]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error incrementing tickets sold:", error);
      throw new Error(
        `Failed to update ticket counts for event ${eventId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      client.release();
    }
  }
}
