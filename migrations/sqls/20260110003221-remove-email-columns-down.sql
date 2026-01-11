-- Migration: Rollback removal of attendee_email column
-- Description: Add back attendee_email to tickets table

-- Add attendee_email column back to tickets table
ALTER TABLE tickets ADD COLUMN attendee_email VARCHAR(255);

-- Recreate index for attendee_email
CREATE INDEX idx_tickets_attendee_email ON tickets(attendee_email);

-- Note: Email data cannot be restored as it was deleted in the up migration
-- If you need to preserve data, you should back up the database before running the up migration
