// Vercel Webhook Handler - Enhanced with Tracking Number Support
const crypto = require('crypto');

// Webhook signature verification
const verifyWebhookSignature = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('base64');
  return signature === expectedSignature;
};

// Supabase client setup
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ezddhpptywphszvxnmto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZGRocHB0eXdwaHN6dnhubXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjEwMjIsImV4cCI6MjA2Njg5NzAyMn0.a8DCZIXhs-Ye3EMBGNrNyNMWpvZm7RfumtGtoE80qrA'
);

// Enhanced tracking number parsing function
const parseTrackingInfo = (orderData) => {
  const trackingInfo = {
    tracking_number: null,
    carrier_provider: null,
    tracking_url: null,
    updated_at: new Date().toISOString()
  };

  try {
    // Method 1: Check order notes for tracking format
    if (orderData.customer_note) {
      const trackingMatch = orderData.customer_note.match(
        /carrier provider:\s*([^,]+),\s*tracking ID:\s*([^\s,]+)/i
      );
      
      if (trackingMatch) {
        trackingInfo.carrier_provider = trackingMatch[1].trim();
        trackingInfo.tracking_number = trackingMatch[2].trim();
        console.log(`📦 Found tracking in customer note: ${trackingInfo.carrier_provider} - ${trackingInfo.tracking_number}`);
      }
    }

    // Method 2: Check meta data for tracking plugins
    if (orderData.meta_data && Array.isArray(orderData.meta_data)) {
      const trackingMeta = orderData.meta_data.find(meta => 
        meta.key === '_tracking_number' || 
        meta.key === 'tracking_number' ||
        meta.key === '_shipment_tracking_number'
      );
      
      const carrierMeta = orderData.meta_data.find(meta => 
        meta.key === '_tracking_provider' || 
        meta.key === 'tracking_provider' ||
        meta.key === '_shipment_tracking_provider'
      );

      if (trackingMeta && trackingMeta.value) {
        trackingInfo.tracking_number = trackingMeta.value;
        console.log(`📦 Found tracking in meta: ${trackingInfo.tracking_number}`);
      }

      if (carrierMeta && carrierMeta.value) {
        trackingInfo.carrier_provider = carrierMeta.value;
        console.log(`🚚 Found carrier in meta: ${trackingInfo.carrier_provider}`);
      }
    }

    // Method 3: Check order notes array (some plugins add structured notes)
    if (orderData.order_notes && Array.isArray(orderData.order_notes)) {
      for (const note of orderData.order_notes) {
        if (note.note && typeof note.note === 'string') {
          const trackingMatch = note.note.match(
            /carrier provider:\s*([^,]+),\s*tracking ID:\s*([^\s,]+)/i
          );
          
          if (trackingMatch) {
            trackingInfo.carrier_provider = trackingMatch[1].trim();
            trackingInfo.tracking_number = trackingMatch[2].trim();
            console.log(`📦 Found tracking in order notes: ${trackingInfo.carrier_provider} - ${trackingInfo.tracking_number}`);
            break;
          }
        }
      }
    }

    // Generate tracking URL if we have the info
    if (trackingInfo.tracking_number && trackingInfo.carrier_provider) {
      trackingInfo.tracking_url = generateTrackingUrl(
        trackingInfo.carrier_provider, 
        trackingInfo.tracking_number
      );
    }

    return trackingInfo;
  } catch (error) {
    console.error('Error parsing tracking info:', error);
    return trackingInfo;
  }
};

// Generate tracking URLs for different carriers
const generateTrackingUrl = (carrier, trackingNumber) => {
  const carrierLower = carrier.toLowerCase().replace(/\s+/g, '');
  
  const carrierUrls = {
    'australiapost': `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`,
    'auspost': `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`,
    'startrack': `https://startrack.com.au/track-trace?id=${trackingNumber}`,
    'fastway': `https://www.fastway.com.au/courier-services/track-your-parcel?l=${trackingNumber}`,
    'tnt': `https://www.tnt.com/express/en_au/site/shipping-tools/tracking.html?searchType=con&cons=${trackingNumber}`,
    'dhl': `https://www.dhl.com/au-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`,
    'fedex': `https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=${trackingNumber}`,
    'ups': `https://www.ups.com/track?loc=en_AU&tracknum=${trackingNumber}`,
    'courier': `https://www.courierpost.com.au/tools/track-trace?trackNumber=${trackingNumber}`,
    'toll': `https://www.tollgroup.com/track-trace?trackingNumber=${trackingNumber}`
  };

  return carrierUrls[carrierLower] || `https://www.google.com/search?q=track+${carrier}+${trackingNumber}`;
};

// Enhanced order sync with tracking support
const syncOrderData = async (orderData) => {
  try {
    console.log(`Processing order ${orderData.number} for customer ${orderData.billing.email}`);

    // Parse tracking information
    const trackingInfo = parseTrackingInfo(orderData);

    // First, ensure the customer exists in our system
    if (orderData.customer_id > 0) {
      await supabase
        .from('users_so2024')
        .upsert({
          woocommerce_customer_id: orderData.customer_id,
          email: orderData.billing.email,
          first_name: orderData.billing.first_name,
          last_name: orderData.billing.last_name,
          phone: orderData.billing.phone || null,
          created_at: new Date().toISOString(),
          last_login: null
        }, { onConflict: 'email' });
    }

    // Sync order data with tracking information
    const { data: order, error: orderError } = await supabase
      .from('orders_so2024')
      .upsert({
        woocommerce_order_id: orderData.id,
        customer_email: orderData.billing.email,
        order_number: orderData.number,
        status: orderData.status,
        total_amount: parseFloat(orderData.total),
        currency: orderData.currency,
        order_date: orderData.date_created,
        
        // Enhanced tracking fields
        tracking_number: trackingInfo.tracking_number,
        carrier_provider: trackingInfo.carrier_provider,
        tracking_url: trackingInfo.tracking_url,
        
        shipping_address: {
          first_name: orderData.shipping?.first_name || orderData.billing.first_name,
          last_name: orderData.shipping?.last_name || orderData.billing.last_name,
          address_1: orderData.shipping?.address_1 || orderData.billing.address_1,
          address_2: orderData.shipping?.address_2 || orderData.billing.address_2,
          city: orderData.shipping?.city || orderData.billing.city,
          state: orderData.shipping?.state || orderData.billing.state,
          postcode: orderData.shipping?.postcode || orderData.billing.postcode,
          country: orderData.shipping?.country || orderData.billing.country
        },
        billing_address: {
          first_name: orderData.billing.first_name,
          last_name: orderData.billing.last_name,
          address_1: orderData.billing.address_1,
          address_2: orderData.billing.address_2,
          city: orderData.billing.city,
          state: orderData.billing.state,
          postcode: orderData.billing.postcode,
          country: orderData.billing.country
        },
        payment_method: orderData.payment_method_title,
        notes: orderData.customer_note || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'woocommerce_order_id' });

    if (orderError) throw orderError;

    // Log tracking info if found
    if (trackingInfo.tracking_number) {
      console.log(`✅ Order ${orderData.number} synced with tracking: ${trackingInfo.carrier_provider} - ${trackingInfo.tracking_number}`);
    } else {
      console.log(`✅ Order ${orderData.number} synced (no tracking info found)`);
    }

    // Sync order items if order was created successfully
    if (order && order[0] && orderData.line_items && orderData.line_items.length > 0) {
      // First, delete existing items for this order
      await supabase
        .from('order_items_so2024')
        .delete()
        .eq('order_id', order[0].id);

      // Insert new items
      const orderItems = orderData.line_items.map(item => ({
        order_id: order[0].id,
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
        console.error('Error inserting order items:', itemsError);
        // Don't throw here, order sync is more important than items
      }
    }

    return order;
  } catch (error) {
    console.error('Error syncing order data:', error);
    throw error;
  }
};

// Sync customer data to Supabase (unchanged)
const syncCustomerData = async (customerData) => {
  try {
    console.log(`Processing customer ${customerData.email}`);

    const { data: user, error: userError } = await supabase
      .from('users_so2024')
      .upsert({
        woocommerce_customer_id: customerData.id,
        email: customerData.email,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        phone: customerData.billing?.phone || null,
        created_at: new Date().toISOString(),
        last_login: null,
        total_spent: parseFloat(customerData.total_spent || 0),
        orders_count: parseInt(customerData.orders_count || 0),
        date_created: customerData.date_created
      }, { onConflict: 'email' });

    if (userError) throw userError;

    console.log(`✅ Customer ${customerData.email} synced successfully`);
    return user;
  } catch (error) {
    console.error('Error syncing customer data:', error);
    throw error;
  }
};

// Main Vercel handler function (unchanged)
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-WC-Webhook-Source, X-WC-Webhook-Topic, X-WC-Webhook-Resource, X-WC-Webhook-Event, X-WC-Webhook-Signature, X-WC-Webhook-ID, X-WC-Webhook-Delivery-ID');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Simply Online Webhook Handler with Tracking Support!',
      timestamp: new Date().toISOString(),
      features: [
        'Order sync with tracking numbers',
        'Automatic carrier detection',
        'Tracking URL generation',
        'Multiple parsing methods'
      ]
    });
  }

  if (req.method === 'POST') {
    try {
      const signature = req.headers['x-wc-webhook-signature'];
      const topic = req.headers['x-wc-webhook-topic'];
      const source = req.headers['x-wc-webhook-source'];
      const payload = JSON.stringify(req.body);

      console.log(`📨 Webhook received: ${topic} from ${source}`);

      if (!verifyWebhookSignature(payload, signature, 'simply_online_2024_secure_webhook_key')) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }

      switch (topic) {
        case 'order.created':
        case 'order.updated':
          await syncOrderData(req.body);
          console.log(`✅ Order webhook processed: ${req.body.number}`);
          break;

        case 'customer.created':
        case 'customer.updated':
          await syncCustomerData(req.body);
          console.log(`✅ Customer webhook processed: ${req.body.email}`);
          break;

        default:
          console.log(`ℹ️ Unhandled webhook topic: ${topic}`);
      }

      return res.status(200).json({ 
        success: true, 
        topic,
        processed_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};