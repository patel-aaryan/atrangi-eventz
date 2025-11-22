-- Migration: Drop orders table
-- Description: Reverses the creation of the orders table

-- Note: Foreign key constraints from tickets to orders are dropped in the tickets table down migration

-- Drop triggers first
DROP TRIGGER IF EXISTS validate_order_number_format_trigger ON orders;
DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Drop functions
DROP FUNCTION IF EXISTS validate_order_number_format();
DROP FUNCTION IF EXISTS generate_order_number();

-- Drop indexes
DROP INDEX IF EXISTS idx_orders_status_purchased_at;
DROP INDEX IF EXISTS idx_orders_id_order_number;
DROP INDEX IF EXISTS idx_orders_payment_status;
DROP INDEX IF EXISTS idx_orders_stripe_charge;
DROP INDEX IF EXISTS idx_orders_stripe_payment_intent;
DROP INDEX IF EXISTS idx_orders_purchased_at;
DROP INDEX IF EXISTS idx_orders_buyer_email;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_order_number;

-- Drop table (cascade will handle foreign key constraints)
DROP TABLE IF EXISTS orders CASCADE;

-- Drop enum type
DROP TYPE IF EXISTS order_status CASCADE;
