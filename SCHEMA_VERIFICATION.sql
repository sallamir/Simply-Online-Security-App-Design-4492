-- Verify your exact database schema
-- Run this to confirm column names and structure

-- 1. Check orders_so2024 table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders_so2024'
ORDER BY ordinal_position;

-- 2. Check users_so2024 table columns  
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'users_so2024'
ORDER BY ordinal_position;

-- 3. Test the exact query structure we'll use
SELECT 
  u.email,
  u.id as user_uuid,
  o.order_number,
  o.total,        -- Should be 'total' not 'total_amount'
  o.date_created, -- Should be 'date_created' not 'order_date'
  o.status
FROM users_so2024 u
LEFT JOIN orders_so2024 o ON u.id = o.customer_id
WHERE u.email = 'test@example.com'  -- Replace with real test email
ORDER BY o.date_created DESC
LIMIT 5;

-- 4. Check if orders have customer_email column (should NOT exist in your schema)
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'orders_so2024' 
  AND column_name = 'customer_email'
) as has_customer_email_column;