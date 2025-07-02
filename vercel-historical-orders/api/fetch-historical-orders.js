// Vercel Function: Secure Historical Orders Fetcher
const crypto = require('crypto');

// WooCommerce API Configuration (Server-side only)
const WOOCOMMERCE_CONFIG = {
  url: 'https://simplyonline.com.au',
  consumerKey: process.env.WC_CONSUMER_KEY, // Store in Vercel env vars
  consumerSecret: process.env.WC_CONSUMER_SECRET, // Store in Vercel env vars
  version: 'wc/v3'
};

// Supabase client setup
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ezddhpptywphszvxnmto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZGRocHB0eXdwaHN6dnhubXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjEwMjIsImV4cCI6MjA2Njg5NzAyMn0.a8DCZIXhs-Ye3EMBGNrNyNMWpvZm7RfumtGtoE80qrA'
);

// Rate limiting storage (in-memory for simplicity, use Redis for production)
const rateLimitStore = new Map();

// Rate limiting function
const checkRateLimit = (email) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3; // Max 3 requests per 15 minutes per email

  const userRequests = rateLimitStore.get(email) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(email, recentRequests);
  
  return true; // Request allowed
};

// Fetch orders from WooCommerce API with pagination
const fetchWooCommerceOrders = async (email, beforeDate = null) => {
  try {
    const auth = Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64');
    
    let url = `${WOOCOMMERCE_CONFIG.url}/wp-json/${WOOCOMMERCE_CONFIG.version}/orders`;
    const params = new URLSearchParams({
      customer: email,
      per_page: '50', // Reasonable batch size
      orderby: 'date',
      order: 'desc',
      status: 'any' // Include all order statuses
    });

    // Only fetch orders before webhook integration date
    if (beforeDate) {
      params.append('before', beforeDate);
    }

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    const orders = await response.json();
    console.log(`📦 Fetched ${orders.length} historical orders for ${email}`);
    
    return orders;
  } catch (error) {
    console.error('Error fetching WooCommerce orders:', error);
    throw error;
  }
};

// Convert WooCommerce order to Supabase format
const convertOrderFormat = (wooOrder) => {
  return {
    woocommerce_order_id: wooOrder.id,
    customer_email: wooOrder.billing.email,
    order_number: wooOrder.number,
    status: wooOrder.status,
    total_amount: parseFloat(wooOrder.total),
    currency: wooOrder.currency,
    order_date: wooOrder.date_created,
    shipping_address: {
      first_name: wooOrder.shipping?.first_name || wooOrder.billing.first_name,
      last_name: wooOrder.shipping?.last_name || wooOrder.billing.last_name,
      address_1: wooOrder.shipping?.address_1 || wooOrder.billing.address_1,
      address_2: wooOrder.shipping?.address_2 || wooOrder.billing.address_2,
      city: wooOrder.shipping?.city || wooOrder.billing.city,
      state: wooOrder.shipping?.state || wooOrder.billing.state,
      postcode: wooOrder.shipping?.postcode || wooOrder.billing.postcode,
      country: wooOrder.shipping?.country || wooOrder.billing.country
    },
    billing_address: {
      first_name: wooOrder.billing.first_name,
      last_name: wooOrder.billing.last_name,
      address_1: wooOrder.billing.address_1,
      address_2: wooOrder.billing.address_2,
      city: wooOrder.billing.city,
      state: wooOrder.billing.state,
      postcode: wooOrder.billing.postcode,
      country: wooOrder.billing.country
    },
    payment_method: wooOrder.payment_method_title,
    notes: wooOrder.customer_note || null,
    is_historical: true, // Flag to identify historical imports
    updated_at: new Date().toISOString()
  };
};

// Save historical orders to Supabase
const saveHistoricalOrders = async (orders) => {
  if (!orders || orders.length === 0) return [];

  try {
    const formattedOrders = orders.map(convertOrderFormat);
    
    // Upsert orders (insert or update if exists)
    const { data: savedOrders, error: orderError } = await supabase
      .from('orders_so2024')
      .upsert(formattedOrders, { 
        onConflict: 'woocommerce_order_id',
        ignoreDuplicates: false 
      })
      .select();

    if (orderError) throw orderError;

    // Process order items for each order
    for (let i = 0; i < orders.length; i++) {
      const wooOrder = orders[i];
      const savedOrder = savedOrders[i];

      if (wooOrder.line_items && wooOrder.line_items.length > 0) {
        // Delete existing items first
        await supabase
          .from('order_items_so2024')
          .delete()
          .eq('order_id', savedOrder.id);

        // Insert new items
        const orderItems = wooOrder.line_items.map(item => ({
          order_id: savedOrder.id,
          woocommerce_product_id: item.product_id,
          product_name: item.name,
          product_sku: item.sku || null,
          quantity: item.quantity,
          unit_price: parseFloat(item.price || 0),
          total_price: parseFloat(item.total || 0),
          product_image: item.image?.src || null
        }));

        const { error: itemsError } = await supabase
          .from('order_items_so2024')
          .insert(orderItems);

        if (itemsError) {
          console.error(`Error inserting items for order ${wooOrder.number}:`, itemsError);
        }
      }
    }

    console.log(`✅ Saved ${savedOrders.length} historical orders to Supabase`);
    return savedOrders;
  } catch (error) {
    console.error('Error saving historical orders:', error);
    throw error;
  }
};

// Main handler function
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, webhookStartDate } = req.body;

    // Validate input
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in 15 minutes.',
        retryAfter: 15 * 60 // seconds
      });
    }

    console.log(`📨 Fetching historical orders for ${email}`);

    // Check if we already have historical data for this customer
    const { data: existingHistorical, error: checkError } = await supabase
      .from('orders_so2024')
      .select('id, order_number, is_historical')
      .eq('customer_email', email)
      .eq('is_historical', true)
      .limit(1);

    if (checkError) {
      console.error('Error checking existing data:', checkError);
    }

    if (existingHistorical && existingHistorical.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Historical orders already loaded',
        cached: true,
        count: 0
      });
    }

    // Fetch historical orders from WooCommerce
    const historicalOrders = await fetchWooCommerceOrders(
      email, 
      webhookStartDate || '2024-01-01T00:00:00Z' // Default cutoff date
    );

    if (!historicalOrders || historicalOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No historical orders found',
        count: 0,
        orders: []
      });
    }

    // Save to Supabase
    const savedOrders = await saveHistoricalOrders(historicalOrders);

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Successfully loaded ${savedOrders.length} historical orders`,
      count: savedOrders.length,
      orders: savedOrders.map(order => ({
        order_number: order.order_number,
        order_date: order.order_date,
        total_amount: order.total_amount,
        status: order.status
      }))
    });

  } catch (error) {
    console.error('❌ Historical orders fetch error:', error);
    
    return res.status(500).json({
      error: 'Failed to fetch historical orders',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};