# Simply Online Australia - WooCommerce Integration Guide

## Overview
This guide explains how to integrate the Simply Online mobile app with your existing WooCommerce website for order tracking and user management.

## Required Integrations

### 1. WooCommerce Webhooks Setup

You need to set up webhooks in your WooCommerce admin to sync data with the app:

#### Webhook Endpoints to Create:
1. **Order Created/Updated**: `https://your-app-domain.com/api/webhooks/woocommerce/orders`
2. **Customer Created/Updated**: `https://your-app-domain.com/api/webhooks/woocommerce/customers`

#### Steps to Set Up Webhooks:
1. Go to WooCommerce → Settings → Advanced → Webhooks
2. Click "Add webhook"
3. Configure each webhook:
   - **Delivery URL**: Your app's webhook endpoint
   - **Secret**: Generate a secure secret key
   - **Topic**: Select appropriate topic (Order created, Order updated, etc.)
   - **API Version**: WC API v3
   - **Status**: Active

### 2. Required WooCommerce Data Fields

Ensure your WooCommerce orders capture these fields:
- Customer email (required for order lookup)
- Order number
- Order status
- Billing and shipping addresses
- Line items with product details
- Payment method
- Customer notes
- Tracking numbers (via tracking plugins)

### 3. API Webhook Handler (Backend)

Create an API endpoint to handle WooCommerce webhooks:

```javascript
// Example webhook handler (Node.js/Express)
app.post('/api/webhooks/woocommerce/orders', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-wc-webhook-signature'];
    const payload = JSON.stringify(req.body);
    
    // Validate signature with your webhook secret
    if (!verifyWebhookSignature(payload, signature)) {
      return res.status(401).send('Unauthorized');
    }
    
    const orderData = req.body;
    
    // Sync with Supabase
    await syncOrderToSupabase(orderData);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});
```

### 4. Promotional Notification System

#### Backend Promotion Scheduler
Set up a system to send promotional notifications:

```javascript
// Example: Send flash sale notification
const sendFlashSaleNotification = async () => {
  const campaign = {
    title: '🔥 Flash Sale: 25% Off Solar Cameras!',
    body: 'Limited time offer on all solar cameras. Use code SOLAR25',
    data: {
      type: 'promotion',
      code: 'SOLAR25',
      products: ['solar'],
      discount: 25
    }
  };
  
  // Send to all subscribed devices
  await sendNotificationToAllDevices(campaign);
};
```

#### Automated Triggers
- New customer welcome (trigger: first order)
- Abandoned cart (trigger: items in cart for 24 hours)
- Seasonal sales (trigger: scheduled campaigns)
- Product restocks (trigger: inventory updates)

### 5. Customer Authentication

#### Option A: Simple Email-Based Lookup
- No login required
- Customers enter email to view orders
- Most user-friendly for customers

#### Option B: Full Authentication System
- Integrate with WooCommerce customer accounts
- Sync customer data on registration/login
- Secure access with password protection

### 6. Required WooCommerce Plugins

#### Essential:
1. **WooCommerce REST API** (included in WooCommerce)
2. **Shipment Tracking Plugin** (for tracking numbers)

#### Recommended:
1. **WooCommerce Webhooks** (for real-time sync)
2. **WooCommerce Customer/Order CSV Export** (for data migration)
3. **Advanced Shipment Tracking** (enhanced tracking)

### 7. Database Schema (Already Created)

The app includes these Supabase tables:
- `users_so2024`: Customer data from WooCommerce
- `orders_so2024`: Order information
- `order_items_so2024`: Individual order items
- `promotion_campaigns_so2024`: Marketing campaigns
- `camera_comparisons_so2024`: Product comparison data

### 8. Implementation Steps

#### Phase 1: Basic Order Tracking
1. Set up order webhooks
2. Create webhook handler endpoint
3. Test with sample orders
4. Deploy to production

#### Phase 2: Customer Management
1. Set up customer webhooks
2. Implement authentication (if required)
3. Sync existing customer data
4. Test customer order lookup

#### Phase 3: Promotional System
1. Create promotion campaigns in database
2. Set up notification sending system
3. Implement automated triggers
4. Test notification delivery

#### Phase 4: Advanced Features
1. Add inventory tracking
2. Implement wishlist functionality
3. Create customer support integration
4. Add analytics tracking

### 9. Testing Checklist

- [ ] Webhook endpoints respond correctly
- [ ] Order data syncs properly
- [ ] Customer lookup works
- [ ] Notifications send successfully
- [ ] Tracking numbers display
- [ ] Error handling works
- [ ] Security measures in place

### 10. Security Considerations

1. **Webhook Signature Verification**: Always verify webhook signatures
2. **API Rate Limiting**: Implement rate limiting on endpoints
3. **Data Encryption**: Encrypt sensitive customer data
4. **Access Control**: Implement proper access controls
5. **Audit Logging**: Log all data access and modifications

### 11. Promotion Campaign Examples

```sql
-- Flash Sale Campaign
INSERT INTO promotion_campaigns_so2024 (
  name, type, discount_code, discount_percentage,
  target_products, target_audience, start_date, end_date,
  notification_title, notification_body
) VALUES (
  'Solar Camera Flash Sale',
  'flash_sale',
  'SOLAR25',
  25,
  ARRAY['solar'],
  'all',
  NOW(),
  NOW() + INTERVAL '3 days',
  '🔥 Flash Sale: 25% Off Solar Cameras!',
  'Limited time offer on all solar cameras. Free shipping Australia-wide!'
);
```

### 12. Monitoring and Analytics

Track these metrics:
- Order sync success rate
- Notification delivery rate
- Customer engagement
- App usage patterns
- Error rates and types

## Next Steps

1. **Set up webhooks** in your WooCommerce admin
2. **Create webhook handlers** on your server
3. **Test with sample data** before going live
4. **Monitor logs** for any sync issues
5. **Set up promotional campaigns** for customer engagement

## Support

For technical support with the integration:
- Email: Info@simplyonline.com.au
- Phone: (02) 6189 2020
- Documentation: Available in the app codebase

This integration will provide your customers with a seamless experience to track orders and receive promotional notifications directly through the mobile app.