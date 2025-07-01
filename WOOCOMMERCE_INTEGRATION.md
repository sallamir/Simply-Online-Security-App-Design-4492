# WooCommerce Integration Setup Guide

## 🎯 Overview
This guide will help you integrate your Simply Online WooCommerce website with the mobile app for seamless order tracking and customer management.

## 📋 Prerequisites

### 1. WooCommerce Store Requirements
- WordPress with WooCommerce plugin
- SSL certificate (HTTPS)
- Admin access to WordPress dashboard
- Customer order data with email addresses

### 2. Required Information from You
Please provide the following details:

#### WordPress Admin Access:
- WordPress admin username/password
- Website URL: `https://simplyonline.com.au`
- WooCommerce API access

#### Database Information (if needed):
- Database host, username, password
- Table prefix (usually `wp_`)

## 🔧 Integration Steps

### Step 1: WooCommerce API Setup

1. **Go to WooCommerce → Settings → Advanced → REST API**
2. **Click "Add key"**
3. **Configure API Key:**
   ```
   Description: Mobile App Integration
   User: Your admin user
   Permissions: Read/Write
   ```
4. **Save the generated Consumer Key and Consumer Secret**

### Step 2: Webhook Configuration

Create webhooks in **WooCommerce → Settings → Advanced → Webhooks**:

#### Webhook 1: Order Updates
```
Name: Mobile App - Order Updates
Status: Active
Topic: Order created
Delivery URL: https://your-app-server.com/api/webhooks/orders
Secret: [Generate a secure secret]
```

#### Webhook 2: Customer Updates
```
Name: Mobile App - Customer Updates  
Status: Active
Topic: Customer created
Delivery URL: https://your-app-server.com/api/webhooks/customers
Secret: [Generate a secure secret]
```

### Step 3: Required Customer Data Fields

Ensure your WooCommerce captures these fields:
- ✅ First Name
- ✅ Last Name  
- ✅ Email Address (required for app login)
- ✅ Phone Number
- ✅ Billing Address
- ✅ Shipping Address

### Step 4: Order Tracking Integration

#### Install Tracking Plugin:
Recommended: **"Advanced Shipment Tracking for WooCommerce"**
- Adds tracking numbers to orders
- Sends tracking emails to customers
- Provides tracking API

## 🚀 App Features After Integration

### 1. Customer Login System
```javascript
// Customers can login with their WooCommerce email
- Email: customer@example.com  
- Password: [Set in app or use WooCommerce password]
- View order history
- Track shipments
```

### 2. Order Tracking
- Real-time order status updates
- Tracking number integration
- Shipping address display
- Order item details with images

### 3. Promotional Notifications
- Send discount codes to app users
- Flash sale notifications
- New product announcements
- Seasonal promotions

## 📱 Promotional System Usage

### Send Flash Sale Notification:
```javascript
// Example: 25% off solar cameras
const promotion = await createFlashSale(['solar'], 25, 3); // 3 days
await PromotionSystem.sendPromotionNotification(promotion.id);
```

### Create Seasonal Sale:
```javascript
// Example: Summer sale
const summerSale = await createSeasonalSale('summer', 30); // 30% off
```

### Validate Discount Codes:
```javascript
// When customer enters code in WooCommerce
const validation = await PromotionSystem.validateDiscountCode('SOLAR25', 450);
if (validation.valid) {
  // Apply discount
  const discount = orderTotal * (validation.discountPercentage / 100);
}
```

## 🔐 Security Considerations

### 1. Webhook Security
- Use HTTPS only
- Verify webhook signatures
- Implement rate limiting

### 2. API Security  
- Rotate API keys regularly
- Use read-only keys where possible
- Monitor API usage

### 3. Customer Data
- Encrypt sensitive data
- Comply with privacy laws
- Implement data retention policies

## 📊 Data Sync Process

### 1. Initial Data Migration
```sql
-- Export existing customers and orders
SELECT 
  customer_id,
  email,
  first_name,
  last_name,
  order_count,
  total_spent
FROM wp_woocommerce_customer_lookup;
```

### 2. Real-time Sync
- New orders → Webhook → App database
- Order updates → Webhook → App database  
- Customer updates → Webhook → App database

## 🎨 Product Recommendations

Based on your comparison page, we can implement:

### Camera Type Recommendations:
- **4G Solar**: For remote properties
- **WiFi Solar**: For homes with WiFi
- **4G AC**: For construction sites
- **Smart Locks**: For home security

### Usage-based Recommendations:
```javascript
// Recommend based on previous purchases
if (customerBought('4g-camera')) {
  recommend(['solar-panel', 'extra-batteries', 'mounting-bracket']);
}
```

## 🔄 Testing Checklist

### Before Go-Live:
- [ ] Test webhook endpoints
- [ ] Verify order sync
- [ ] Test customer login
- [ ] Send test promotion
- [ ] Validate discount codes
- [ ] Check tracking numbers
- [ ] Test notifications

## 📞 Next Steps

### 1. Provide Access
Send us:
- WooCommerce API keys
- Webhook endpoints
- Test order data

### 2. We'll Set Up:
- Webhook handlers
- Database sync
- Authentication system  
- Notification system

### 3. Testing Phase:
- Create test orders
- Verify data sync
- Test customer experience
- Send test promotions

## 🆘 Support

**For technical setup:**
- Email: developer@simplyonline.com.au
- Phone: (02) 6189 2020
- Available: Mon-Thu 3:00 PM - 6:00 PM

**What we need from you:**
1. WooCommerce API access
2. List of existing discount codes
3. Preferred notification schedule
4. Customer data export (if migration needed)

This integration will give your customers a seamless experience to track orders and receive exclusive promotions through the mobile app! 🚀