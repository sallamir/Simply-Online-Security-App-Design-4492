import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import UserAuth from '../components/UserAuth';
import supabase from '../lib/supabase';
import { useHistoricalOrders } from '../hooks/useHistoricalOrders';

const { FiPackage, FiTruck, FiMapPin, FiCalendar, FiDollarSign, FiUser, FiPhone, FiMail, FiCheck, FiClock, FiAlertCircle, FiLogIn, FiLogOut, FiExternalLink, FiNavigation, FiDownload, FiRefreshCw } = FiIcons;

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showHistoricalButton, setShowHistoricalButton] = useState(false);
  
  const { fetchHistoricalOrders, loading: historicalLoading, error: historicalError } = useHistoricalOrders();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setCurrentUser(user);
      setUserEmail(user.email);
      fetchUserOrders(user.email);
    } else {
      const email = localStorage.getItem('userEmail') || '';
      setUserEmail(email);
      if (email) {
        fetchUserOrders(email);
      } else {
        setLoading(false);
      }
    }
  };

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
      
      // Check if we should show the historical orders button
      // Show if user has some orders but they're all recent (no historical flag)
      const hasHistoricalOrders = data?.some(order => order.is_historical);
      const hasRecentOrders = data?.some(order => !order.is_historical);
      
      // Show button if user has recent orders but no historical ones
      setShowHistoricalButton(hasRecentOrders && !hasHistoricalOrders);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoricalOrdersFetch = async () => {
    try {
      const result = await fetchHistoricalOrders(userEmail);
      
      if (result.success) {
        // Refresh the orders list
        await fetchUserOrders(userEmail);
        
        // Hide the button since we now have historical data
        setShowHistoricalButton(false);
        
        if (result.cached) {
          alert('Historical orders already loaded!');
        } else if (result.count === 0) {
          alert('No additional historical orders found.');
        } else {
          alert(`Successfully loaded ${result.count} historical orders!`);
        }
      }
    } catch (error) {
      console.error('Error fetching historical orders:', error);
      alert(`Failed to load historical orders: ${error.message}`);
    }
  };

  const handleEmailSearch = (e) => {
    e.preventDefault();
    if (searchEmail) {
      setUserEmail(searchEmail);
      localStorage.setItem('userEmail', searchEmail);
      fetchUserOrders(searchEmail);
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setUserEmail(user.email);
    fetchUserOrders(user.email);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserEmail('');
    setOrders([]);
    setShowHistoricalButton(false);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
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

  // Enhanced carrier icon function
  const getCarrierIcon = (carrier) => {
    if (!carrier) return FiTruck;
    
    const carrierLower = carrier.toLowerCase();
    if (carrierLower.includes('australia') || carrierLower.includes('auspost')) {
      return FiPackage; // Australia Post
    } else if (carrierLower.includes('star')) {
      return FiTruck; // StarTrack
    } else if (carrierLower.includes('dhl') || carrierLower.includes('fedex')) {
      return FiNavigation; // International carriers
    }
    return FiTruck;
  };

  // Enhanced tracking URL opening
  const openTrackingUrl = (trackingUrl, carrier, trackingNumber) => {
    if (trackingUrl) {
      window.open(trackingUrl, '_blank', 'noopener,noreferrer');
    } else if (carrier && trackingNumber) {
      // Fallback: generate URL if not stored
      const searchUrl = `https://www.google.com/search?q=track+${encodeURIComponent(carrier)}+${encodeURIComponent(trackingNumber)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
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
        
        {currentUser && (
          <div className="mt-4 flex items-center justify-center space-x-4">
            <span className="text-sm text-primary-100">
              Welcome back, {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs bg-primary-500 hover:bg-primary-400 px-3 py-1 rounded-full transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-3 h-3 inline mr-1" />
              Logout
            </button>
          </div>
        )}
      </motion.div>

      {/* Authentication Options */}
      {!userEmail && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-soft border border-secondary-200"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Access Your Orders</h3>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowAuth(true)}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiLogIn} className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">or</span>
              </div>
            </div>

            <form onSubmit={handleEmailSearch} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Quick Order Lookup (Guest)
                </label>
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter your order email address"
                  className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary-600 text-white py-3 rounded-lg font-medium hover:bg-secondary-700 transition-colors"
              >
                Find My Orders
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Historical Orders Button */}
      {showHistoricalButton && userEmail && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <SafeIcon icon={FiDownload} className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Load Your Older Orders</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            We found recent orders for your account. Would you like to see your complete order history from our website?
          </p>
          <button
            onClick={handleHistoricalOrdersFetch}
            disabled={historicalLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <SafeIcon 
              icon={historicalLoading ? FiRefreshCw : FiDownload} 
              className={`w-4 h-4 ${historicalLoading ? 'animate-spin' : ''}`} 
            />
            <span>{historicalLoading ? 'Loading...' : 'Show My Older Orders'}</span>
          </button>
          {historicalError && (
            <p className="text-sm text-red-600 mt-2">
              Error: {historicalError}
            </p>
          )}
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">
              Your Orders ({orders.length})
            </h3>
            {userEmail && !currentUser && (
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Create Account
              </button>
            )}
          </div>

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
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-secondary-900">
                      Order #{order.order_number}
                    </h4>
                    {order.is_historical && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Historical
                      </span>
                    )}
                  </div>
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

              {/* Enhanced Tracking Section */}
              {(order.tracking_number || order.carrier_provider) && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <SafeIcon icon={getCarrierIcon(order.carrier_provider)} className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-bold text-blue-900">
                          Package Tracking
                        </span>
                      </div>
                      
                      {order.carrier_provider && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs text-blue-700 font-medium">Carrier:</span>
                          <span className="text-sm text-blue-800 font-semibold">{order.carrier_provider}</span>
                        </div>
                      )}
                      
                      {order.tracking_number && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs text-blue-700 font-medium">Tracking ID:</span>
                          <span className="text-sm text-blue-800 font-mono bg-white px-2 py-1 rounded border">
                            {order.tracking_number}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-xs text-blue-600">
                        Click "Track Package" to see real-time delivery updates
                      </p>
                    </div>
                    
                    {/* Track Package Button */}
                    <button
                      onClick={() => openTrackingUrl(order.tracking_url, order.carrier_provider, order.tracking_number)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-medium"
                    >
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      <span>Track Package</span>
                    </button>
                  </div>
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
              : "Sign in or enter your email address to view your order history."
            }
          </p>
          <div className="space-y-3">
            <a
              href="https://simplyonline.com.au/products/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Shop Now
            </a>
            {!currentUser && (
              <button
                onClick={() => setShowAuth(true)}
                className="block w-full max-w-xs mx-auto text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Create Account for Better Experience
              </button>
            )}
          </div>
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

      {/* Authentication Modal */}
      {showAuth && (
        <UserAuth
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}
    </motion.div>
  );
};

export default OrderTracking;