-- Run this to verify your database schema is correct
-- This will help identify any schema mismatches

-- 1. Check users_so2024 table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users_so2024' 
ORDER BY ordinal_position;

-- 2. Check orders_so2024 table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders_so2024' 
ORDER BY ordinal_position;

-- 3. Verify the relationship between users and orders
SELECT 
  u.email,
  u.id as user_uuid,
  COUNT(o.id) as order_count
FROM users_so2024 u
LEFT JOIN orders_so2024 o ON u.id = o.customer_id
GROUP BY u.email, u.id
ORDER BY order_count DESC
LIMIT 10;

-- 4. Check for orders that might not be linked properly
SELECT 
  customer_email,
  COUNT(*) as order_count,
  'No user link' as issue
FROM orders_so2024 o
WHERE NOT EXISTS (
  SELECT 1 FROM users_so2024 u WHERE u.id = o.customer_id
)
GROUP BY customer_email
ORDER BY order_count DESC;

-- 5. Check for both email and customer_id based orders
SELECT 
  'Email-based orders' as type,
  COUNT(*) as count
FROM orders_so2024 
WHERE customer_email IS NOT NULL

UNION ALL

SELECT 
  'UUID-linked orders' as type,
  COUNT(*) as count
FROM orders_so2024 
WHERE customer_id IS NOT NULL;

-- 6. Sample data check
SELECT 
  'Sample user' as type,
  email,
  id,
  woocommerce_customer_id
FROM users_so2024 
LIMIT 5;

SELECT 
  'Sample order' as type,
  order_number,
  customer_email,
  customer_id,
  total_amount
FROM orders_so2024 
ORDER BY order_date DESC
LIMIT 5;