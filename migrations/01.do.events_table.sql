-- Migration: Create events table
-- Description: Main events table for storing event information

-- Create enum type for event status
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    
    -- Event timing
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_sales_open TIMESTAMP WITH TIME ZONE,
    ticket_sales_close TIMESTAMP WITH TIME ZONE,
    
    -- Location details
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_province VARCHAR(100) DEFAULT 'Ontario',
    venue_postal_code VARCHAR(20),
    venue_country VARCHAR(100) DEFAULT 'Canada',
    
    -- Event details
    total_capacity INTEGER,
    total_tickets_sold INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'CAD',
    total_revenue DECIMAL(12, 2) DEFAULT 0.00,
    
    -- Ticket tiers (JSONB for flexibility)
    ticket_tiers JSONB DEFAULT '[]'::jsonb,
    -- Example structure: [
    --   {"name": "Early Bird", "price": 15.00, "capacity": 50, "sold": 0, "available_until": "2025-11-01T00:00:00Z"},
    --   {"name": "Tier 1", "price": 20.00, "capacity": 100, "sold": 0, "available_until": null},
    --   {"name": "Tier 2", "price": 25.00, "capacity": 100, "sold": 0, "available_until": null}
    -- ]
    
    -- Computed fields (PostgreSQL GENERATED columns)
    tickets_remaining INTEGER GENERATED ALWAYS AS (GREATEST(0, total_capacity - total_tickets_sold)) STORED,
    is_sold_out BOOLEAN GENERATED ALWAYS AS (total_tickets_sold >= total_capacity) STORED,
    is_past BOOLEAN GENERATED ALWAYS AS (end_date < CURRENT_TIMESTAMP) STORED,
    
    -- Media
    banner_image TEXT,
    thumbnail_image TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    
    -- Status and visibility
    status event_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- SEO and metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_ticket_sales_dates CHECK (ticket_sales_close IS NULL OR ticket_sales_open IS NULL OR ticket_sales_close >= ticket_sales_open),
    CONSTRAINT valid_capacity CHECK (total_capacity > 0),
    CONSTRAINT valid_tickets_sold CHECK (total_tickets_sold >= 0 AND total_tickets_sold <= total_capacity)
);

-- Create indexes for better query performance
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_status ON events(status);

-- JSONB indexes for ticket_tiers queries
CREATE INDEX idx_events_ticket_tiers ON events USING GIN(ticket_tiers);

-- Composite index for filtering published/completed events by date
CREATE INDEX idx_events_status_start_date ON events(status, start_date DESC);

-- Add update trigger
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraint trigger to validate JSONB structure
CREATE OR REPLACE FUNCTION validate_ticket_tiers()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure ticket_tiers is an array
    IF jsonb_typeof(NEW.ticket_tiers) != 'array' THEN
        RAISE EXCEPTION 'ticket_tiers must be a JSON array';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_ticket_tiers_trigger
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION validate_ticket_tiers();

-- Add comment for documentation
COMMENT ON COLUMN events.ticket_tiers IS 'JSONB array of ticket pricing tiers with structure: [{"name": "Early Bird", "price": 15.00, "capacity": 50, "sold": 0, "available_until": "ISO8601"}]';
COMMENT ON TABLE events IS 'Events table for Atrangi Eventz - typically 2-3 events per year with multiple ticket tiers';
