// FINAL CORRECTED VERSION - Two-step lookup only
import { useState } from 'react';
import supabase from '../lib/supabase';

export const useSupabaseOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CORRECTED: Pure two-step lookup - NO customer_email filtering
  const fetchUserOrders = async (email) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Step 1: Looking up user by email:', email);

      // STEP 1: Find user in users_so2024 by email
      const { data: userData, error: userError } = await supabase
        .from('users_so2024')
        .select('id, email, first_name, last_name, woocommerce_customer_id')
        .eq('email', email)
        .single();

      if (userError) {
        console.log('❌ User lookup failed:', userError);
        if (userError.code === 'PGRST116') {
          // No user found - return empty results
          console.log('📭 No user found for email:', email);
          return { user: null, orders: [] };
        }
        throw userError;
      }

      console.log('✅ Step 1 success - User found:', userData.id);

      // STEP 2: Find orders using ONLY the user's UUID as customer_id
      console.log('🔍 Step 2: Looking up orders for user ID:', userData.id);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders_so2024')
        .select(`
          *,
          order_items_so2024 (*)
        `)
        .eq('customer_id', userData.id) // ONLY filter by customer_id (UUID)
        .order('date_created', { ascending: false }); // Use date_created

      if (ordersError) {
        console.log('❌ Orders lookup failed:', ordersError);
        throw ordersError;
      }

      console.log(`✅ Step 2 success - Found ${ordersData?.length || 0} orders`);

      return {
        user: userData,
        orders: ordersData || []
      };

    } catch (err) {
      console.error('❌ fetchUserOrders error:', err);
      setError(err.message);
      return { user: null, orders: [] };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserOrders,
    loading,
    error
  };
};