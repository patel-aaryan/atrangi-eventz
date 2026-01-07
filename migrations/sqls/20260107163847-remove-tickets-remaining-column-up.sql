-- Migration: Remove tickets_remaining as stored column
-- Description: Remove the stored tickets_remaining column since it will be computed in queries
-- The schema will only store: total_capacity (tickets available) and total_tickets_sold
-- tickets_remaining will be computed as (total_capacity - total_tickets_sold) in application code

-- Drop the generated column tickets_remaining
ALTER TABLE events DROP COLUMN IF EXISTS tickets_remaining;

-- Add comment to clarify the new approach
COMMENT ON COLUMN events.total_capacity IS 'Total tickets available for this event. tickets_remaining is computed as (total_capacity - total_tickets_sold) in queries.';
COMMENT ON COLUMN events.total_tickets_sold IS 'Total tickets sold so far. Updated automatically via trigger after each ticket purchase.';
