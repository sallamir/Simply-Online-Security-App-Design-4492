# Webhook Testing & Verification Guide

## ✅ Your Current Setup Status

### **Working Configuration:**
- ✅ Vercel deployment: `https://simplyonline-webhook-handler-projec.vercel.app/api`
- ✅ Test pings working
- ✅ Single endpoint handling all webhooks
- ✅ Webhook signature verification

## 🧪 Testing Your Integration

### **1. Test Order Webhook**
Create a test order in WooCommerce and verify:

```bash
# Check Vercel logs for:
📨 Webhook received: order.created from https://simplyonline.com.au
✅ Order webhook processed: [ORDER_NUMBER]
```

### **2. Test Customer Webhook**
Create a test customer and verify:

```bash
# Check Vercel logs for:
📨 Webhook received: customer.created from https://simplyonline.com.au  
✅ Customer webhook processed: [EMAIL]
```

### **3. Verify Database Sync**
Check Supabase to confirm data appears in:
- `users_so2024` table
- `orders_so2024` table  
- `order_items_so2024` table

## 🔧 WooCommerce Webhook Configuration

### **All webhooks should use:**
```
Delivery URL: https://simplyonline-webhook-handler-projec.vercel.app/api
Secret: simply_online_2024_secure_webhook_key
Status: Active
API Version: WP REST API v3
```

### **Required Webhook Topics:**
1. **Order created** - For new orders
2. **Order updated** - For status changes, tracking numbers
3. **Customer created** - For new customer accounts
4. **Customer updated** - For customer data changes

## 📊 Monitoring Your Webhooks

### **Vercel Function Logs**
Monitor your function at:
```
https://vercel.com/your-username/simplyonline-webhook-handler-projec/functions
```

### **WooCommerce Webhook Logs**
Check delivery status in:
```
WooCommerce → Settings → Advanced → Webhooks → [Your Webhook] → Deliveries
```

## 🚀 Ready for Production!

Your webhook setup is now complete and ready for:
- ✅ Real customer orders
- ✅ Automatic data sync  
- ✅ Customer authentication
- ✅ Promotional campaigns

The single endpoint approach you're using is actually **better** than separate paths - it's simpler to manage and debug!