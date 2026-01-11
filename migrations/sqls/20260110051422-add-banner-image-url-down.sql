-- Rollback: Remove banner_image_url column from events table

ALTER TABLE events 
DROP COLUMN IF EXISTS banner_image_url;
