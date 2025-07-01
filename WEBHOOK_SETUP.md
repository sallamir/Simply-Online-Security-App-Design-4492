# WooCommerce Webhook Setup Instructions

## 🔧 Webhook Configuration

Based on your WooCommerce setup, here are the exact webhook configurations you need:

### Webhook URLs (Replace with your actual server domain):
```
Order Webhook URL: https://your-server-domain.com/api/webhooks/woocommerce/orders
Customer Webhook URL: https://your-server-domain.com/api/webhooks/woocommerce/customers
```

### Webhook Secret:
```
Secret: simply_online_2024_secure_webhook_key
```

## 📝 Step-by-Step Setup

### 1. Go to WooCommerce → Settings → Advanced → Webhooks

### 2. Create Order Webhook:
```
Name: Mobile App - Order Updates
Status: Active
Topic: Order created
Delivery URL: https://your-server-domain.com/api/webhooks/woocommerce/orders
Secret: simply_online_2024_secure_webhook_key
API Version: WP REST API v3
```

### 3. Create Order Update Webhook:
```
Name: Mobile App - Order Status Updates
Status: Active  
Topic: Order updated
Delivery URL: https://your-server-domain.com/api/webhooks/woocommerce/orders
Secret: simply_online_2024_secure_webhook_key
API Version: WP REST API v3
```

### 4. Create Customer Webhook:
```
Name: Mobile App - Customer Updates
Status: Active
Topic: Customer created
Delivery URL: https://your-server-domain.com/api/webhooks/woocommerce/customers
Secret: simply_online_2024_secure_webhook_key
API Version: WP REST API v3
```

## 🚀 Backend Webhook Handler (Node.js/Express Example)

```javascript
// webhook-handler.js
const express = require('express');
const crypto = require('crypto');
const { syncOrderDataStandalone, syncCustomerDataStandalone } = require('./woocommerce-sync');

const app = express();
app.use(express.json());

// Webhook signature verification
const verifyWebhookSignature = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('base64');
  return signature === expectedSignature;
};

// Orders webhook endpoint
app.post('/api/webhooks/woocommerce/orders', async (req, res) => {
  try {
    const signature = req.headers['x-wc-webhook-signature'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, 'simply_online_2024_secure_webhook_key')) {
      return res.status(401).send('Unauthorized');
    }

    // Sync order data to Supabase
    await syncOrderDataStandalone(req.body);
    
    console.log(`Order ${req.body.number} synced successfully`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Order webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Customers webhook endpoint
app.post('/api/webhooks/woocommerce/customers', async (req, res) => {
  try {
    const signature = req.headers['x-wc-webhook-signature'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, 'simply_online_2024_secure_webhook_key')) {
      return res.status(401).send('Unauthorized');
    }

    // Sync customer data to Supabase
    await syncCustomerDataStandalone(req.body);
    
    console.log(`Customer ${req.body.email} synced successfully`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Customer webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## 🔐 Security Notes

1. **Always use HTTPS** for webhook URLs
2. **Verify webhook signatures** to ensure authenticity
3. **Rate limit** webhook endpoints
4. **Log all webhook events** for debugging
5. **Use environment variables** for secrets

## ✅ Testing Webhooks

### Test Order Creation:
1. Place a test order on your WooCommerce site
2. Check webhook logs for successful delivery
3. Verify order appears in the mobile app

### Test Customer Registration:
1. Create a new customer account
2. Check webhook logs
3. Verify customer can login to mobile app

## 📊 Promotional Campaigns

With the webhook system in place, you can now:

### Send Promotional Notifications:
```javascript
// Example: Send flash sale notification
const promotion = await createFlashSale(['solar'], 25, 3); // 25% off solar cameras for 3 days
await PromotionSystem.sendPromotionNotification(promotion.id);
```

### Validate Discount Codes:
```javascript
// In your WooCommerce checkout
const validation = await PromotionSystem.validateDiscountCode('SOLAR25', orderTotal);
if (validation.valid) {
  // Apply discount
  const discount = orderTotal * (validation.discountPercentage / 100);
}
```

## 🎯 Next Steps

1. **Set up webhook endpoints** on your server
2. **Configure webhooks** in WooCommerce admin
3. **Test with sample orders**
4. **Monitor webhook delivery**
5. **Launch promotional campaigns**

Your mobile app is now ready to sync with WooCommerce and send promotional notifications! 🚀