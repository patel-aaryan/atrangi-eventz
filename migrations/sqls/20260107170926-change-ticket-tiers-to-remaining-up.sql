-- Migration: Change ticket_tiers structure to use 'remaining' instead of 'capacity' and 'sold'
-- Description: Simplify ticket tracking by only storing remaining count, which gets decremented on purchase

-- Step 1: Update existing ticket_tiers JSONB to transform {capacity, sold} to {remaining}
UPDATE events
SET ticket_tiers = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', tier->>'name',
            'price', (tier->>'price')::numeric,
            'remaining', COALESCE((tier->>'capacity')::integer, 0) - COALESCE((tier->>'sold')::integer, 0),
            'available_until', tier->'available_until',
            'description', tier->'description',
            'features', tier->'features'
        )
    )
    FROM jsonb_array_elements(ticket_tiers) AS tier
)
WHERE ticket_tiers IS NOT NULL AND ticket_tiers != '[]'::jsonb;

-- Step 2: Drop the old trigger that incremented 'sold'
DROP TRIGGER IF EXISTS update_event_ticket_counts_trigger ON tickets;
DROP FUNCTION IF EXISTS update_event_ticket_counts();

-- Step 3: Create new trigger function to decrement 'remaining'
CREATE OR REPLACE FUNCTION update_event_ticket_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment total_tickets_sold for the event
    UPDATE events 
    SET total_tickets_sold = total_tickets_sold + 1
    WHERE id = NEW.event_id;

    -- Decrement the remaining count for the specific tier in ticket_tiers JSONB
    UPDATE events
    SET ticket_tiers = jsonb_set(
        ticket_tiers,
        ARRAY[NEW.tier_index::text, 'remaining'],
        (GREATEST(0, COALESCE((ticket_tiers->NEW.tier_index->>'remaining')::integer, 0) - 1))::text::jsonb
    )
    WHERE id = NEW.event_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Recreate trigger
CREATE TRIGGER update_event_ticket_counts_trigger
    AFTER INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_event_ticket_counts();

-- Step 5: Update documentation
COMMENT ON FUNCTION update_event_ticket_counts() IS 'Automatically updates event total_tickets_sold and decrements ticket_tiers remaining counts when a ticket is purchased';
COMMENT ON COLUMN events.ticket_tiers IS 'JSONB array of ticket pricing tiers with structure: [{"name": "Early Bird", "price": 15.00, "remaining": 50, "available_until": "ISO8601", "description": "...", "features": ["..."]}]';
