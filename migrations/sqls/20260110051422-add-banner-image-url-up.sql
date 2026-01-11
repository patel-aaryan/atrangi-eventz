-- Migration: Add banner_image_url column to events table
-- Description: Adds a new column to store banner image URLs

ALTER TABLE events 
ADD COLUMN banner_image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN events.banner_image_url IS 'URL for the event banner image';
