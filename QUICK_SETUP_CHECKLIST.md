# Quick Setup Checklist

## ✅ Pre-Implementation Checklist

### **1. WooCommerce API Setup**
- [ ] Go to WooCommerce → Settings → Advanced → REST API
- [ ] Click "Add key"
- [ ] Set description: "Historical Orders App"
- [ ] Set permissions: "Read"
- [ ] Copy Consumer Key and Consumer Secret

### **2. Vercel Account Setup**
- [ ] Have Vercel account ready
- [ ] Install Vercel CLI: `npm i -g vercel`

### **3. Database Preparation**
- [ ] Access to your Supabase dashboard
- [ ] SQL editor permissions

## 🚀 Implementation Steps (30 minutes)

### **Step 1: Deploy Vercel Function (10 minutes)**
```bash
# 1. Create directory
mkdir vercel-historical-orders && cd vercel-historical-orders

# 2. Copy the provided files:
# - package.json
# - api/fetch-historical-orders.js

# 3. Install and deploy
npm install
vercel --prod
```

### **Step 2: Set Environment Variables (5 minutes)**
In Vercel dashboard → Project → Settings → Environment Variables:
```
WC_CONSUMER_KEY=ck_your_key_here
WC_CONSUMER_SECRET=cs_your_secret_here
```

### **Step 3: Update Database Schema (2 minutes)**
Run in Supabase SQL editor:
```sql
ALTER TABLE orders_so2024 
ADD COLUMN IF NOT EXISTS is_historical BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_orders_historical 
ON orders_so2024(customer_email, is_historical);
```

### **Step 4: Update React App (10 minutes)**
1. Copy `useHistoricalOrders.js` to `src/hooks/`
2. Update `src/pages/OrderTracking.jsx` with provided code
3. Update the API URL in the hook with your Vercel function URL

### **Step 5: Test & Deploy (3 minutes)**
1. Test locally with a real customer email
2. Deploy your updated app
3. Verify the button appears and works

## 🎯 **What You'll Get**

After this 30-minute setup:
- ✅ Secure historical order fetching
- ✅ Rate-limited protection
- ✅ Customer-controlled loading
- ✅ Automatic caching
- ✅ Production-ready feature

## 🔍 **Testing Checklist**

### **Function Test**
```bash
curl -X POST https://your-function-url.vercel.app/api/fetch-historical-orders \
  -H "Content-Type: application/json" \
  -d '{"email": "real@customer.com", "webhookStartDate": "2024-01-01T00:00:00Z"}'
```

### **App Test**
- [ ] Enter customer email with orders
- [ ] Blue banner appears
- [ ] Click button → orders load
- [ ] Button disappears
- [ ] Historical badges visible

## 🆘 **Need Help?**

### **Common Issues:**
1. **"Function not found"** → Check Vercel deployment status
2. **"API key error"** → Verify WooCommerce API keys
3. **"No orders"** → Check if email has orders in WooCommerce
4. **"Rate limit"** → Wait 15 minutes between tests

### **Support:**
- Check Vercel function logs
- Verify environment variables
- Test API keys in WooCommerce directly

You're ready to give your customers an amazing order history experience! 🚀