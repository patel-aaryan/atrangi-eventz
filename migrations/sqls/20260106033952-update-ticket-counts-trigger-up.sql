-- Migration: Add trigger to automatically update event ticket counts when tickets are inserted
-- Description: This trigger ensures total_tickets_sold and ticket_tiers JSONB sold counts stay in sync

-- Function to update event ticket counts when tickets are inserted
CREATE OR REPLACE FUNCTION update_event_ticket_counts()
RETURNS TRIGGER AS $$
DECLARE
    tier_quantity INTEGER;
BEGIN
    -- Increment total_tickets_sold for the event
    UPDATE events 
    SET total_tickets_sold = total_tickets_sold + 1
    WHERE id = NEW.event_id;

    -- Increment the sold count for the specific tier in ticket_tiers JSONB
    UPDATE events
    SET ticket_tiers = jsonb_set(
        ticket_tiers,
        ARRAY[NEW.tier_index::text, 'sold'],
        (COALESCE((ticket_tiers->NEW.tier_index->>'sold')::integer, 0) + 1)::text::jsonb
    )
    WHERE id = NEW.event_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after each ticket insert
CREATE TRIGGER update_event_ticket_counts_trigger
    AFTER INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_event_ticket_counts();

-- Add comment for documentation
COMMENT ON FUNCTION update_event_ticket_counts() IS 'Automatically updates event total_tickets_sold and ticket_tiers sold counts when a ticket is inserted';
