-- Migration: Remove trigger to automatically update event ticket counts
-- Description: Rollback for update_event_ticket_counts trigger

-- Drop the trigger
DROP TRIGGER IF EXISTS update_event_ticket_counts_trigger ON tickets;

-- Drop the function
DROP FUNCTION IF EXISTS update_event_ticket_counts();
