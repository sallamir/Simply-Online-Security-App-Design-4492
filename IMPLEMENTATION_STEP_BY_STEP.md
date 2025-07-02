# Complete Implementation Guide: Historical Orders Feature

## 🚀 Step-by-Step Implementation

### **Phase 1: Deploy the Secure Vercel Function (Backend Proxy)**

#### **Step 1.1: Create Vercel Function Directory**
```bash
# Create a new directory for your Vercel function
mkdir vercel-historical-orders
cd vercel-historical-orders
```

#### **Step 1.2: Initialize Package**
Create `package.json`:
```json
{
  "name": "simplyonline-historical-orders",
  "version": "1.0.0",
  "description": "Historical orders fetcher for Simply Online app",
  "main": "api/fetch-historical-orders.js",
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

#### **Step 1.3: Install Dependencies**
```bash
npm install
```

#### **Step 1.4: Deploy to Vercel**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy the function
vercel --prod
```

#### **Step 1.5: Set Environment Variables in Vercel**
In your Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```bash
# WooCommerce API Credentials
WC_CONSUMER_KEY=ck_your_consumer_key_here
WC_CONSUMER_SECRET=cs_your_consumer_secret_here

# Optional: Node environment
NODE_ENV=production
```

**To get your WooCommerce API keys:**
1. Go to your WordPress admin
2. WooCommerce → Settings → Advanced → REST API
3. Click "Add key"
4. Set permissions to "Read"
5. Copy the Consumer Key and Consumer Secret

### **Phase 2: Update Your React App Frontend**

#### **Step 2.1: Create the React Hook**
The hook is already created in `src/hooks/useHistoricalOrders.js`. Update the API endpoint:

```javascript
// In useHistoricalOrders.js, update the fetch URL:
const response = await fetch('https://your-vercel-function-url.vercel.app/api/fetch-historical-orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: email,
    webhookStartDate: '2024-01-01T00:00:00Z'
  })
});
```

#### **Step 2.2: Update OrderTracking Component**
The complete updated component is in `src/pages/OrderTracking.jsx`. Key changes:

1. **Import the hook:**
```javascript
import { useHistoricalOrders } from '../hooks/useHistoricalOrders';
```

2. **Use the hook:**
```javascript
const { fetchHistoricalOrders, loading: historicalLoading, error: historicalError } = useHistoricalOrders();
```

3. **Button logic:**
```javascript
// Show button if user has recent orders but no historical ones
const hasHistoricalOrders = data?.some(order => order.is_historical);
const hasRecentOrders = data?.some(order => !order.is_historical);
setShowHistoricalButton(hasRecentOrders && !hasHistoricalOrders);
```

### **Phase 3: Database Schema Updates**

#### **Step 3.1: Add Historical Flag Column**
Run this in your Supabase SQL editor:

```sql
-- Add is_historical column if it doesn't exist
ALTER TABLE orders_so2024 
ADD COLUMN IF NOT EXISTS is_historical BOOLEAN DEFAULT FALSE;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_historical 
ON orders_so2024(customer_email, is_historical);

-- Update existing orders to be non-historical
UPDATE orders_so2024 
SET is_historical = FALSE 
WHERE is_historical IS NULL;
```

### **Phase 4: Testing Your Implementation**

#### **Step 4.1: Test the Vercel Function**
```bash
# Test with curl (replace with your actual Vercel URL)
curl -X POST https://your-function-url.vercel.app/api/fetch-historical-orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@customer.com",
    "webhookStartDate": "2024-01-01T00:00:00Z"
  }'
```

#### **Step 4.2: Test in Your App**
1. Open your app
2. Enter a customer email that has orders in WooCommerce
3. Look for the blue "Load Your Older Orders" banner
4. Click the button and verify orders load

#### **Step 4.3: Verify Database**
Check Supabase to see:
- Orders with `is_historical = true`
- Historical badge appears in app
- Button disappears after loading

### **Phase 5: Production Deployment**

#### **Step 5.1: Update Your App's API Endpoint**
In `src/hooks/useHistoricalOrders.js`, replace the localhost URL with your production Vercel function URL:

```javascript
const response = await fetch('https://simplyonline-historical-orders.vercel.app/api/fetch-historical-orders', {
  // ... rest of the code
});
```

#### **Step 5.2: Deploy Your Updated App**
```bash
# In your main app directory
npm run build
# Deploy to your hosting platform
```

## 🔧 **Configuration Details**

### **Environment Variables Explained**
- `WC_CONSUMER_KEY`: Your WooCommerce REST API consumer key (read permissions)
- `WC_CONSUMER_SECRET`: Your WooCommerce REST API consumer secret
- `NODE_ENV`: Set to "production" for better error handling

### **Security Features Implemented**
- ✅ Rate limiting (3 requests per email per 15 minutes)
- ✅ Email validation
- ✅ Server-side API key storage
- ✅ CORS protection
- ✅ Input sanitization

### **Caching Logic Explained**
The caching works at multiple levels:

1. **Database Level**: `is_historical` flag prevents duplicate fetching
2. **UI Level**: Button disappears after successful load
3. **Function Level**: Checks existing historical orders before API call

## 🎯 **Expected Behavior**

### **For New Users (No Orders)**
- No button appears
- Standard "no orders" message

### **For Users with Recent Orders Only**
- Blue banner appears: "Load Your Older Orders"
- Button shows "Show My Older Orders"
- Click → Loading → Historical orders appear
- Button disappears

### **For Users with Historical Orders Already Loaded**
- No button appears
- All orders visible with "Historical" badges

## 📊 **Monitoring & Debugging**

### **Vercel Function Logs**
Monitor at: `https://vercel.com/your-username/project-name/functions`

### **Common Issues & Solutions**

**Issue: "Rate limit exceeded"**
- Solution: Wait 15 minutes or adjust rate limits

**Issue: "WooCommerce API error"**
- Solution: Check API keys and permissions

**Issue: "No orders found"**
- Solution: Verify email exists in WooCommerce

**Issue: Button doesn't appear**
- Solution: Check if user already has historical orders

## 🚀 **Ready to Launch!**

After following these steps, you'll have:
- ✅ Secure historical order fetching
- ✅ Rate-limited API protection
- ✅ Smooth user experience
- ✅ Automatic caching
- ✅ Production-ready deployment

Your customers will love having complete control over loading their order history! 🎉