-- Migration: Rollback - Add back image columns to events table
-- Description: Restore banner_image, thumbnail_image, and gallery_images columns

-- Add back the three image columns
ALTER TABLE events ADD COLUMN banner_image TEXT;
ALTER TABLE events ADD COLUMN thumbnail_image TEXT;
ALTER TABLE events ADD COLUMN gallery_images JSONB DEFAULT '[]'::jsonb;
