-- Migration: Remove attendee_email column
-- Description: Remove attendee_email from tickets table only (keep buyer_email in both tables)

-- Remove index related to attendee_email
DROP INDEX IF EXISTS idx_tickets_attendee_email;

-- Remove attendee_email column from tickets table
ALTER TABLE tickets DROP COLUMN IF EXISTS attendee_email;
