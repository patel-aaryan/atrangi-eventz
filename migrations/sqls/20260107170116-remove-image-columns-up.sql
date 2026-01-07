-- Migration: Remove image columns from events table
-- Description: Remove banner_image, thumbnail_image, and gallery_images columns as they are replaced by R2 storage

-- Remove the three image columns
ALTER TABLE events DROP COLUMN IF EXISTS banner_image;
ALTER TABLE events DROP COLUMN IF EXISTS thumbnail_image;
ALTER TABLE events DROP COLUMN IF EXISTS gallery_images;
