# Deployment Instructions

## 🚀 **Quick Deploy Guide (30 Minutes Total)**

### **Phase 1: Vercel Function Deployment (10 minutes)**

#### **1.1: Prepare Files**
Create a new folder called `vercel-historical-orders` and copy these files:
- `package.json` (provided above)
- `api/fetch-historical-orders.js` (the main function)

#### **1.2: Deploy Function**
```bash
cd vercel-historical-orders
npm install
npx vercel --prod
```

**Note your deployment URL** - something like: `https://simplyonline-historical-orders.vercel.app`

#### **1.3: Set Environment Variables**
In your Vercel dashboard:
1. Go to your new project
2. Settings → Environment Variables
3. Add:
   - `WC_CONSUMER_KEY`: Your WooCommerce consumer key
   - `WC_CONSUMER_SECRET`: Your WooCommerce consumer secret

### **Phase 2: Database Update (2 minutes)**

Run this in your Supabase SQL editor:
```sql
-- Add historical flag column
ALTER TABLE orders_so2024 
ADD COLUMN IF NOT EXISTS is_historical BOOLEAN DEFAULT FALSE;

-- Add performance index
CREATE INDEX IF NOT EXISTS idx_orders_historical 
ON orders_so2024(customer_email, is_historical);

-- Set existing orders as non-historical
UPDATE orders_so2024 
SET is_historical = FALSE 
WHERE is_historical IS NULL;
```

### **Phase 3: Frontend Integration (15 minutes)**

#### **3.1: Add the Hook**
Copy `src/hooks/useHistoricalOrders.js` to your project and update the API URL:

```javascript
// Line 13 in useHistoricalOrders.js
const response = await fetch('https://YOUR-ACTUAL-VERCEL-URL.vercel.app/api/fetch-historical-orders', {
```

#### **3.2: Update OrderTracking Page**
Replace your `src/pages/OrderTracking.jsx` with the provided version, or add these key sections:

```javascript
// Add imports
import { useHistoricalOrders } from '../hooks/useHistoricalOrders';

// Add state
const [showHistoricalButton, setShowHistoricalButton] = useState(false);
const { fetchHistoricalOrders, loading: historicalLoading, error: historicalError } = useHistoricalOrders();

// Add button logic in fetchUserOrders function
const hasHistoricalOrders = data?.some(order => order.is_historical);
const hasRecentOrders = data?.some(order => !order.is_historical);
setShowHistoricalButton(hasRecentOrders && !hasHistoricalOrders);

// Add button handler
const handleHistoricalOrdersFetch = async () => {
  try {
    const result = await fetchHistoricalOrders(userEmail);
    if (result.success) {
      await fetchUserOrders(userEmail);
      setShowHistoricalButton(false);
      alert(`Successfully loaded ${result.count} historical orders!`);
    }
  } catch (error) {
    alert(`Failed to load historical orders: ${error.message}`);
  }
};
```

#### **3.3: Add the UI Component**
Add this where you want the button to appear (in the JSX):

```jsx
{/* Historical Orders Button */}
{showHistoricalButton && userEmail && (
  <motion.div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
    <div className="flex items-center space-x-3 mb-3">
      <SafeIcon icon={FiDownload} className="w-5 h-5 text-blue-600" />
      <h3 className="font-semibold text-blue-900">Load Your Older Orders</h3>
    </div>
    <p className="text-sm text-blue-700 mb-4">
      We found recent orders for your account. Would you like to see your complete order history?
    </p>
    <button
      onClick={handleHistoricalOrdersFetch}
      disabled={historicalLoading}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
    >
      <SafeIcon 
        icon={historicalLoading ? FiRefreshCw : FiDownload} 
        className={`w-4 h-4 ${historicalLoading ? 'animate-spin' : ''}`} 
      />
      <span>{historicalLoading ? 'Loading...' : 'Show My Older Orders'}</span>
    </button>
  </motion.div>
)}
```

### **Phase 4: Testing (3 minutes)**

#### **4.1: Test the Function**
```bash
curl -X POST https://your-vercel-url.vercel.app/api/fetch-historical-orders \
  -H "Content-Type: application/json" \
  -d '{"email": "real@customer.com", "webhookStartDate": "2024-01-01T00:00:00Z"}'
```

#### **4.2: Test in App**
1. Enter a customer email that has orders in WooCommerce
2. Look for the blue banner
3. Click the button
4. Verify orders load and button disappears

## 🔧 **Configuration Options**

### **Rate Limiting**
Adjust in the Vercel function:
```javascript
const maxRequests = 3; // requests per window
const windowMs = 15 * 60 * 1000; // 15 minutes
```

### **Date Cutoff**
Adjust what's considered "historical":
```javascript
webhookStartDate: '2024-01-01T00:00:00Z' // Only fetch orders before this date
```

### **Batch Size**
Adjust how many orders to fetch per request:
```javascript
per_page: '50', // WooCommerce API limit is usually 100
```

## ✅ **Success Indicators**

After deployment, you should see:
- ✅ Vercel function responds with 200 status
- ✅ Blue banner appears for users with recent orders
- ✅ Button loads historical orders successfully
- ✅ Button disappears after loading
- ✅ Historical badges appear on older orders
- ✅ Rate limiting works (3 requests per 15 minutes per email)

## 🛠 **Troubleshooting**

### **Common Issues:**

1. **Function returns 401 Unauthorized**
   - Check WooCommerce API keys
   - Verify keys have "Read" permissions

2. **Function returns 429 Rate Limited**
   - Wait 15 minutes
   - Or adjust rate limits in function

3. **Button doesn't appear**
   - Check if user already has historical orders
   - Verify `is_historical` column exists

4. **No orders returned**
   - Verify email exists in WooCommerce
   - Check date cutoff settings

### **Debugging:**
- Check Vercel function logs
- Verify environment variables
- Test WooCommerce API directly

## 🎯 **Final Result**

Your customers will now have:
- ✅ **Immediate access** to recent orders (webhook-synced)
- ✅ **On-demand loading** of complete order history
- ✅ **Secure, rate-limited** access to WooCommerce data
- ✅ **Smooth user experience** with clear loading states
- ✅ **Automatic caching** to prevent duplicate requests

This feature will significantly improve customer satisfaction by giving them complete control over their order history! 🚀