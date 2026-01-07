-- Migration rollback: Restore ticket_tiers structure to use 'capacity' and 'sold'
-- Description: Revert to previous structure with separate capacity and sold tracking

-- Step 1: Drop the trigger that decrements 'remaining'
DROP TRIGGER IF EXISTS update_event_ticket_counts_trigger ON tickets;
DROP FUNCTION IF EXISTS update_event_ticket_counts();

-- Step 2: Update existing ticket_tiers JSONB to transform {remaining} back to {capacity, sold}
-- Note: We calculate capacity as (remaining + sold tickets from total_tickets_sold)
UPDATE events
SET ticket_tiers = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', elem.tier->>'name',
            'price', (elem.tier->>'price')::numeric,
            'capacity', COALESCE((elem.tier->>'remaining')::integer, 0) + COALESCE(elem.tier_sold, 0),
            'sold', COALESCE(elem.tier_sold, 0),
            'available_until', elem.tier->'available_until',
            'description', elem.tier->'description',
            'features', elem.tier->'features'
        ) ORDER BY elem.idx
    )
    FROM (
        SELECT 
            tier,
            idx,
            (
                SELECT COUNT(*)::integer
                FROM tickets
                WHERE tickets.event_id = events.id
                AND tickets.tier_index = idx
            ) as tier_sold
        FROM jsonb_array_elements(ticket_tiers) WITH ORDINALITY AS t(tier, idx)
    ) elem
)
WHERE ticket_tiers IS NOT NULL AND ticket_tiers != '[]'::jsonb;

-- Step 3: Recreate old trigger function that increments 'sold'
CREATE OR REPLACE FUNCTION update_event_ticket_counts()
RETURNS TRIGGER AS $$
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

-- Step 4: Recreate trigger
CREATE TRIGGER update_event_ticket_counts_trigger
    AFTER INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_event_ticket_counts();

-- Step 5: Restore documentation
COMMENT ON FUNCTION update_event_ticket_counts() IS 'Automatically updates event total_tickets_sold and ticket_tiers sold counts when a ticket is inserted';
COMMENT ON COLUMN events.ticket_tiers IS 'JSONB array of ticket pricing tiers with structure: [{"name": "Early Bird", "price": 15.00, "capacity": 50, "sold": 0, "available_until": "ISO8601"}]';
