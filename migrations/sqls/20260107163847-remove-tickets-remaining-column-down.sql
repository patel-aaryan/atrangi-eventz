-- Migration: Restore tickets_remaining as stored generated column
-- Description: Rollback - restore tickets_remaining as a generated column

-- Re-add the generated column tickets_remaining
ALTER TABLE events 
ADD COLUMN tickets_remaining INTEGER GENERATED ALWAYS AS (GREATEST(0, total_capacity - total_tickets_sold)) STORED;

-- Remove the custom comments
COMMENT ON COLUMN events.total_capacity IS NULL;
COMMENT ON COLUMN events.total_tickets_sold IS NULL;
