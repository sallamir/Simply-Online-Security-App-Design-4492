// CORRECTED: Fixed table references and WooCommerce API usage
import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

// WooCommerce API Configuration
const WOOCOMMERCE_CONFIG = {
  url: 'https://simplyonline.com.au',
  consumerKey: 'ck_405ddfc2f786a368df374491a4880228f8b960cf',
  consumerSecret: 'cs_c84da70af7decbf2cc719350745b595b6b542ba2',
  version: 'wc/v3'
};

export const useWooCommerceSync = () => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSync, setLastSync] = useState(null);

  // CORRECTED: Use users_so2024 not users_so2025
  const syncCustomerData = async (customerData) => {
    try {
      setSyncStatus('syncing');

      // Upsert customer data to CORRECT table
      const { data: user, error: userError } = await supabase
        .from('users_so2024') // CORRECTED: was users_so2025
        .upsert({
          woocommerce_customer_id: customerData.id,
          email: customerData.email,
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          phone: customerData.billing?.phone || null,
          last_login: new Date().toISOString()
        }, { onConflict: 'woocommerce_customer_id' });

      if (userError) throw userError;

      setSyncStatus('success');
      setLastSync(new Date());
      return user;
    } catch (error) {
      console.error('Error syncing customer data:', error);
      setSyncStatus('error');
      throw error;
    }
  };

  // Sync order data from WooCommerce webhook
  const syncOrderData = async (orderData) => {
    try {
      setSyncStatus('syncing');

      // First, ensure the customer exists
      if (orderData.customer_id > 0) {
        await supabase
          .from('users_so2024') // CORRECTED: was users_so2025
          .upsert({
            woocommerce_customer_id: orderData.customer_id,
            email: orderData.billing.email,
            first_name: orderData.billing.first_name,
            last_name: orderData.billing.last_name,
            phone: orderData.billing.phone
          }, { onConflict: 'woocommerce_customer_id' });
      }

      // CORRECTED: Use proper column names
      const { data: order, error: orderError } = await supabase
        .from('orders_so2024')
        .upsert({
          woocommerce_order_id: orderData.id,
          customer_email: orderData.billing.email,
          order_number: orderData.number,
          status: orderData.status,
          total: parseFloat(orderData.total), // CORRECTED: use 'total' not 'total_amount'
          currency: orderData.currency,
          date_created: orderData.date_created, // CORRECTED: use 'date_created' not 'order_date'
          shipping_address: {
            first_name: orderData.shipping.first_name,
            last_name: orderData.shipping.last_name,
            address_1: orderData.shipping.address_1,
            address_2: orderData.shipping.address_2,
            city: orderData.shipping.city,
            state: orderData.shipping.state,
            postcode: orderData.shipping.postcode,
            country: orderData.shipping.country
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
          notes: orderData.customer_note,
          updated_at: new Date().toISOString()
        }, { onConflict: 'woocommerce_order_id' });

      if (orderError) throw orderError;

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
          product_sku: item.sku,
          quantity: item.quantity,
          unit_price: parseFloat(item.price),
          total_price: parseFloat(item.total),
          product_image: item.image?.src || null
        }));

        const { error: itemsError } = await supabase
          .from('order_items_so2024')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      setSyncStatus('success');
      setLastSync(new Date());
      return order;
    } catch (error) {
      console.error('Error syncing order data:', error);
      setSyncStatus('error');
      throw error;
    }
  };

  // CORRECTED: Fixed API usage - use fetch instead of WooCommerceRestApi
  const fetchOrdersFromWooCommerce = async (page = 1, perPage = 50) => {
    try {
      const auth = Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64');
      
      const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}/wp-json/${WOOCOMMERCE_CONFIG.version}/orders?page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching WooCommerce orders:', error);
      throw error;
    }
  };

  return {
    syncStatus,
    lastSync,
    syncCustomerData,
    syncOrderData,
    fetchOrdersFromWooCommerce
  };
};

// CORRECTED: Standalone utility functions for webhook handling
export const syncCustomerDataStandalone = async (customerData) => {
  try {
    // Upsert customer data to CORRECT table
    const { data: user, error: userError } = await supabase
      .from('users_so2024') // CORRECTED: was users_so2025
      .upsert({
        woocommerce_customer_id: customerData.id,
        email: customerData.email,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        phone: customerData.billing?.phone || null,
        last_login: new Date().toISOString()
      }, { onConflict: 'woocommerce_customer_id' });

    if (userError) throw userError;
    return user;
  } catch (error) {
    console.error('Error syncing customer data:', error);
    throw error;
  }
};

export const syncOrderDataStandalone = async (orderData) => {
  try {
    // First, ensure the customer exists
    if (orderData.customer_id > 0) {
      await supabase
        .from('users_so2024') // CORRECTED: was users_so2025
        .upsert({
          woocommerce_customer_id: orderData.customer_id,
          email: orderData.billing.email,
          first_name: orderData.billing.first_name,
          last_name: orderData.billing.last_name,
          phone: orderData.billing.phone
        }, { onConflict: 'woocommerce_customer_id' });
    }

    // CORRECTED: Use proper column names
    const { data: order, error: orderError } = await supabase
      .from('orders_so2024')
      .upsert({
        woocommerce_order_id: orderData.id,
        customer_email: orderData.billing.email,
        order_number: orderData.number,
        status: orderData.status,
        total: parseFloat(orderData.total), // CORRECTED
        currency: orderData.currency,
        date_created: orderData.date_created, // CORRECTED
        shipping_address: {
          first_name: orderData.shipping.first_name,
          last_name: orderData.shipping.last_name,
          address_1: orderData.shipping.address_1,
          address_2: orderData.shipping.address_2,
          city: orderData.shipping.city,
          state: orderData.shipping.state,
          postcode: orderData.shipping.postcode,
          country: orderData.shipping.country
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
        notes: orderData.customer_note,
        updated_at: new Date().toISOString()
      }, { onConflict: 'woocommerce_order_id' });

    if (orderError) throw orderError;

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
        product_sku: item.sku,
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
        total_price: parseFloat(item.total),
        product_image: item.image?.src || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items_so2024')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return order;
  } catch (error) {
    console.error('Error syncing order data:', error);
    throw error;
  }
};