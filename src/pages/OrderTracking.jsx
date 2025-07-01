import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiPackage, FiTruck, FiMapPin, FiCalendar, FiDollarSign, FiUser, FiPhone, FiMail, FiCheck, FiClock, FiAlertCircle } = FiIcons;

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in (you'll implement this based on your auth system)
    const email = localStorage.getItem('userEmail') || '';
    setUserEmail(email);
    if (email) {
      fetchUserOrders(email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders_so2024')
        .select(`
          *,
          order_items_so2024 (*)
        `)
        .eq('customer_email', email)
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = (e) => {
    e.preventDefault();
    if (searchEmail) {
      fetchUserOrders(searchEmail);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return FiCheck;
      case 'processing': return FiClock;
      case 'shipped': return FiTruck;
      case 'pending': return FiAlertCircle;
      default: return FiPackage;
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center py-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white"
      >
        <SafeIcon icon={FiPackage} className="w-12 h-12 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
        <p className="text-primary-100">
          Track your Simply Online Australia orders
        </p>
      </motion.div>

      {/* Email Search (if not logged in) */}
      {!userEmail && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-soft border border-secondary-200"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Find Your Orders</h3>
          <form onSubmit={handleEmailSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Enter the email used for your order"
                className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Find My Orders
            </button>
          </form>
        </motion.div>
      )}

      {/* Orders List */}
      {orders.length > 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-secondary-900">
            Your Orders ({orders.length})
          </h3>
          
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-soft border border-secondary-100"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900">
                    Order #{order.order_number}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{new Date(order.order_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
                      <span>${order.total_amount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={getStatusIcon(order.status)} className="w-4 h-4" />
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Tracking Number */}
              {order.tracking_number && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiTruck} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Tracking Number: {order.tracking_number}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Track your package with Australia Post or your carrier
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                <h5 className="font-medium text-secondary-900">Items Ordered:</h5>
                {order.order_items_so2024?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-lg">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h6 className="font-medium text-secondary-900">{item.product_name}</h6>
                      {item.product_sku && (
                        <p className="text-sm text-secondary-600">SKU: {item.product_sku}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-secondary-600">
                        <span>Qty: {item.quantity}</span>
                        <span>${item.unit_price} each</span>
                        <span className="font-medium">${item.total_price} total</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="border-t border-secondary-200 pt-4">
                  <h5 className="font-medium text-secondary-900 mb-2 flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                    <span>Shipping Address</span>
                  </h5>
                  <div className="text-sm text-secondary-700">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="border-t border-secondary-200 pt-4 mt-4">
                  <h5 className="font-medium text-secondary-900 mb-2">Order Notes</h5>
                  <p className="text-sm text-secondary-700">{order.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // No orders found
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiPackage} className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No Orders Found</h3>
          <p className="text-secondary-600 mb-6">
            {userEmail || searchEmail 
              ? "We couldn't find any orders for this email address."
              : "Enter your email address to view your order history."}
          </p>
          <a
            href="https://simplyonline.com.au/products/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Shop Now
          </a>
        </motion.div>
      )}

      {/* Help Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-secondary-50 rounded-xl p-6 border border-secondary-200"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Need Help with Your Order?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiPhone} className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-secondary-900">Call Us</p>
              <a href="tel:0261892020" className="text-sm text-primary-600 hover:text-primary-700">
                (02) 6189 2020
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiMail} className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-secondary-900">Email Support</p>
              <a href="mailto:Info@simplyonline.com.au" className="text-sm text-primary-600 hover:text-primary-700">
                Info@simplyonline.com.au
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderTracking;