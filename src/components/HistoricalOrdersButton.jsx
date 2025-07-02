// Standalone component for the historical orders functionality
// Use this if you want better separation of concerns

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useHistoricalOrders } from '../hooks/useHistoricalOrders';

const { FiDownload, FiRefreshCw, FiCheck, FiAlertCircle } = FiIcons;

const HistoricalOrdersButton = ({ 
  userEmail, 
  onOrdersLoaded, 
  showButton = true 
}) => {
  const { fetchHistoricalOrders, loading, error } = useHistoricalOrders();
  const [loadingStatus, setLoadingStatus] = useState('');

  const handleFetchHistoricalOrders = async () => {
    if (!userEmail) return;

    setLoadingStatus('Connecting to our systems...');
    
    try {
      const result = await fetchHistoricalOrders(userEmail);
      
      if (result.success) {
        if (result.cached) {
          setLoadingStatus('Already loaded!');
          setTimeout(() => setLoadingStatus(''), 3000);
        } else if (result.count === 0) {
          setLoadingStatus('No additional orders found');
          setTimeout(() => setLoadingStatus(''), 3000);
        } else {
          setLoadingStatus(`Loaded ${result.count} orders!`);
          setTimeout(() => setLoadingStatus(''), 3000);
          
          // Notify parent component to refresh orders
          if (onOrdersLoaded) {
            onOrdersLoaded(result);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching historical orders:', error);
      setLoadingStatus('Failed to load orders');
      setTimeout(() => setLoadingStatus(''), 5000);
    }
  };

  if (!showButton) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
    >
      <div className="flex items-center space-x-3 mb-3">
        <SafeIcon icon={FiDownload} className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Load Your Complete Order History</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-4">
        We found recent orders for your account. Would you like to see your complete purchase history from our website?
      </p>
      
      {/* Status Display */}
      {loadingStatus && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            {loading && <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-blue-600 animate-spin" />}
            {!loading && loadingStatus.includes('Loaded') && <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />}
            {!loading && loadingStatus.includes('Failed') && <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-red-600" />}
            <span className="text-sm font-medium text-secondary-900">{loadingStatus}</span>
          </div>
        </div>
      )}
      
      <button
        onClick={handleFetchHistoricalOrders}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <SafeIcon 
          icon={loading ? FiRefreshCw : FiDownload} 
          className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
        />
        <span>
          {loading ? 'Loading Orders...' : 'Show My Complete History'}
        </span>
      </button>
      
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          Error: {error}
        </div>
      )}
      
      <div className="mt-3 text-xs text-blue-600">
        ✓ Secure connection to your WooCommerce orders
        <br />
        ✓ One-time fetch - results are cached for future visits
      </div>
    </motion.div>
  );
};

export default HistoricalOrdersButton;