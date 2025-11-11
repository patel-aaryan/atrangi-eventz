-- Rollback: Drop events table and related objects

-- Drop triggers
DROP TRIGGER IF EXISTS validate_ticket_tiers_trigger ON events;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;

-- Drop functions
DROP FUNCTION IF EXISTS validate_ticket_tiers() CASCADE;

-- Drop table
DROP TABLE IF EXISTS events CASCADE;

-- Drop enum type
DROP TYPE IF EXISTS event_status CASCADE;
