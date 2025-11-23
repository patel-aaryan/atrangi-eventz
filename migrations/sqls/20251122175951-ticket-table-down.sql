-- Migration: Drop tickets table
-- Description: Reverses the creation of the tickets table

-- Drop triggers first
DROP TRIGGER IF EXISTS generate_ticket_code_trigger ON tickets;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;

-- Drop functions
DROP FUNCTION IF EXISTS generate_ticket_code();

-- Drop foreign key constraints
ALTER TABLE tickets
    DROP CONSTRAINT IF EXISTS fk_tickets_order_number;
ALTER TABLE tickets
    DROP CONSTRAINT IF EXISTS fk_tickets_order_id;

-- Drop indexes
DROP INDEX IF EXISTS idx_tickets_event_status;
DROP INDEX IF EXISTS idx_tickets_order_status;
DROP INDEX IF EXISTS idx_tickets_purchased_at;
DROP INDEX IF EXISTS idx_tickets_buyer_email;
DROP INDEX IF EXISTS idx_tickets_attendee_email;
DROP INDEX IF EXISTS idx_tickets_status;
DROP INDEX IF EXISTS idx_tickets_ticket_code;
DROP INDEX IF EXISTS idx_tickets_order_number;
DROP INDEX IF EXISTS idx_tickets_order_id;
DROP INDEX IF EXISTS idx_tickets_event_id;

-- Drop table (cascade will handle foreign key constraints)
DROP TABLE IF EXISTS tickets;

-- Drop enum type
DROP TYPE IF EXISTS ticket_status;
