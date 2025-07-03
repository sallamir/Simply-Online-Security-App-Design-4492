# Frontend Debugging Checklist

## 🔍 **Step 1: Verify Database Schema**

Run the `DATABASE_SCHEMA_VERIFICATION.sql` to check:

1. **users_so2024 table has:**
   - `id` (UUID primary key)
   - `email` (unique)
   - `woocommerce_customer_id`

2. **orders_so2024 table has:**
   - `id` (UUID primary key) 
   - `customer_id` (UUID foreign key to users_so2024.id)
   - `customer_email` (for fallback lookup)
   - `is_historical` (boolean)

3. **Relationship verification:**
   - Are orders linked via `customer_id` to users?
   - Are there orphaned orders with only `customer_email`?

## 🔧 **Step 2: Test the Corrected Frontend**

### **A. Replace Current OrderTracking Component**
Use the corrected `OrderTracking-CORRECTED.jsx` which includes:
- ✅ Relational lookup (users_so2024 → orders_so2024)
- ✅ Fallback to email lookup for legacy data
- ✅ Proper historical button logic
- ✅ Debug information display

### **B. Add the New Hook**
Use `useSupabaseOrders.js` which provides:
- `fetchOrdersWithFallback()` - Tries relational first, falls back to email
- Better error handling and logging
- Support for both schema types

### **C. Test with Real Data**
1. Open browser console
2. Enter a test email
3. Check console logs for:
   ```
   🔍 Looking up customer by email: test@example.com
   ✅ User found: {id: "uuid", email: "test@example.com"}
   ✅ Orders found: 3
   ```

## 🎯 **Step 3: Historical Orders Button Fix**

The corrected endpoint URL should be:
```javascript
// CORRECT endpoint (without .js extension)
'https://simplyonline-webhook-handler-projec.vercel.app/api/fetch-historical-orders'
```

Test payload:
```json
{
  "email": "customer@example.com",
  "webhookStartDate": "2023-01-01T00:00:00Z"
}
```

## 🚨 **Step 4: Common Issues & Solutions**

### **Issue: "No Orders Found"**
**Possible Causes:**
1. No user record in `users_so2024` for that email
2. Orders exist but `customer_id` is NULL
3. Orders linked to old `users_so2025` table

**Solution:** Use the fallback logic in `useSupabaseOrders.js`

### **Issue: "Historical Button Not Showing"**
**Possible Causes:**
1. All orders have `is_historical = true` already
2. No orders found at all
3. Logic error in button display

**Solution:** Check the debug info panel in the corrected component

### **Issue: "Historical Fetch Fails"**
**Possible Causes:**
1. Wrong endpoint URL (includes `.js`)
2. CORS issues
3. Rate limiting

**Solution:** Check browser network tab for actual error

## 🔄 **Step 5: Data Migration (If Needed)**

If you have orders that aren't showing up, you might need to:

```sql
-- Link existing orders to users by email
UPDATE orders_so2024 o
SET customer_id = u.id
FROM users_so2024 u
WHERE o.customer_email = u.email
  AND o.customer_id IS NULL;

-- Create user records for orders without users
INSERT INTO users_so2024 (email, first_name, last_name, created_at)
SELECT DISTINCT 
  customer_email,
  COALESCE(billing_address->>'first_name', 'Unknown'),
  COALESCE(billing_address->>'last_name', 'Customer'),
  NOW()
FROM orders_so2024 o
WHERE customer_email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM users_so2024 u WHERE u.email = o.customer_email
  );

-- Then link the new users to orders
UPDATE orders_so2024 o
SET customer_id = u.id
FROM users_so2024 u
WHERE o.customer_email = u.email
  AND o.customer_id IS NULL;
```

## ✅ **Step 6: Verification**

After implementing fixes, verify:
- [ ] User enters email → Orders appear
- [ ] Historical button shows when appropriate
- [ ] Historical button works and fetches data
- [ ] Debug panel shows correct information
- [ ] Console logs show successful lookups