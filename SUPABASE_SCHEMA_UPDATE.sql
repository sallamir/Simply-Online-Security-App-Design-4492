-- Add tracking columns to existing orders_so2024 table
-- Run this in your Supabase SQL editor

ALTER TABLE orders_so2024 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS carrier_provider VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_url TEXT;

-- Add index for faster tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking 
ON orders_so2024(tracking_number) 
WHERE tracking_number IS NOT NULL;

-- Add index for carrier lookups
CREATE INDEX IF NOT EXISTS idx_orders_carrier 
ON orders_so2024(carrier_provider) 
WHERE carrier_provider IS NOT NULL;

-- Update RLS policy to include new tracking columns
DROP POLICY IF EXISTS "Users can view their own orders" ON orders_so2024;

CREATE POLICY "Users can view their own orders" 
ON orders_so2024 FOR SELECT 
USING (
  customer_email = auth.email() OR
  customer_email IN (
    SELECT email FROM users_so2024 
    WHERE email = auth.email()
  )
);

-- Allow public read access for guest users (by email lookup)
CREATE POLICY IF NOT EXISTS "Public read access for order tracking" 
ON orders_so2024 FOR SELECT 
USING (true);

-- Comments for documentation
COMMENT ON COLUMN orders_so2024.tracking_number IS 'Tracking number from carrier (e.g., 34QMA5219985)';
COMMENT ON COLUMN orders_so2024.carrier_provider IS 'Shipping carrier name (e.g., AustraliaPost, StarTrack)';
COMMENT ON COLUMN orders_so2024.tracking_url IS 'Auto-generated tracking URL for carrier website';

-- Test the new columns work correctly
SELECT 
  order_number,
  status,
  tracking_number,
  carrier_provider,
  tracking_url,
  updated_at
FROM orders_so2024 
WHERE tracking_number IS NOT NULL
ORDER BY updated_at DESC
LIMIT 5;