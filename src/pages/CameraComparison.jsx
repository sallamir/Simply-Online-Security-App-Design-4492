import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiZap, FiWifi, FiSun, FiSignal, FiCheck, FiX, FiDollarSign, FiClock, FiShield, FiEye, FiLock, FiHome, FiTruck, FiMapPin } = FiIcons;

const CameraComparison = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    try {
      const { data, error } = await supabase
        .from('camera_comparisons_so2024')
        .select('*')
        .order('camera_type');

      if (error) throw error;
      setComparisons(data || []);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case '4g_solar': return FiSignal;
      case 'wifi_solar': return FiSun;
      case '4g_ac': return FiZap;
      case 'wifi_ac': return FiWifi;
      case 'smart_lock': return FiLock;
      default: return FiHome;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '4g_solar': return 'from-blue-500 to-green-500';
      case 'wifi_solar': return 'from-green-500 to-yellow-500';
      case '4g_ac': return 'from-blue-500 to-purple-500';
      case 'wifi_ac': return 'from-purple-500 to-pink-500';
      case 'smart_lock': return 'from-gray-600 to-gray-800';
      default: return 'from-primary-500 to-primary-600';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const filteredComparisons = selectedType === 'all' 
    ? comparisons 
    : comparisons.filter(comp => comp.camera_type === selectedType);

  if (loading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-secondary-100 rounded-xl"></div>
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
        <SafeIcon icon={FiHome} className="w-12 h-12 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Camera Comparison Guide</h1>
        <p className="text-primary-100">
          Find the perfect security solution for your needs
        </p>
      </motion.div>

      {/* Quick Filter */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-2 overflow-x-auto pb-2"
      >
        <button
          onClick={() => setSelectedType('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-secondary-600 border border-secondary-200'
          }`}
        >
          All Types
        </button>
        {comparisons.map((comp) => (
          <button
            key={comp.camera_type}
            onClick={() => setSelectedType(comp.camera_type)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedType === comp.camera_type
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 border border-secondary-200'
            }`}
          >
            {comp.title}
          </button>
        ))}
      </motion.div>

      {/* Comparison Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredComparisons.map((comparison, index) => (
          <motion.div
            key={comparison.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl overflow-hidden shadow-soft border border-secondary-100"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getTypeColor(comparison.camera_type)} p-6 text-white`}>
              <div className="flex items-center space-x-3 mb-3">
                <SafeIcon icon={getTypeIcon(comparison.camera_type)} className="w-8 h-8" />
                <h3 className="text-xl font-bold">{comparison.title}</h3>
              </div>
              <p className="text-white opacity-90 text-sm">{comparison.description}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiZap} className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-secondary-700 capitalize">{comparison.power_source?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiWifi} className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-secondary-700 uppercase">{comparison.connectivity}</span>
                </div>
              </div>

              {/* Price Range */}
              {comparison.price_range_min && (
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-secondary-900">
                    ${comparison.price_range_min} - ${comparison.price_range_max}
                  </span>
                </div>
              )}

              {/* Setup Difficulty */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-700">Setup Difficulty:</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(comparison.setup_difficulty)}`}>
                  {comparison.setup_difficulty}
                </span>
              </div>

              {/* Monthly Cost */}
              {comparison.monthly_cost && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-700">Monthly Cost:</span>
                  <span className="text-sm font-medium text-secondary-900">{comparison.monthly_cost}</span>
                </div>
              )}

              {/* Ideal For */}
              <div>
                <h4 className="text-sm font-medium text-secondary-900 mb-2">Ideal For:</h4>
                <div className="flex flex-wrap gap-1">
                  {comparison.ideal_for?.slice(0, 3).map((use, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                    >
                      {use.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros */}
              <div>
                <h4 className="text-sm font-medium text-secondary-900 mb-2">Advantages:</h4>
                <div className="space-y-1">
                  {comparison.pros?.slice(0, 3).map((pro, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheck} className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-secondary-700">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <h4 className="text-sm font-medium text-secondary-900 mb-2">Considerations:</h4>
                <div className="space-y-1">
                  {comparison.cons?.slice(0, 2).map((con, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiX} className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-secondary-700">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => window.location.href = `/#/products?category=${comparison.camera_type?.split('_')[0]}`}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-4"
              >
                View {comparison.title}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-6 text-center border border-secondary-200"
      >
        <SafeIcon icon={FiMapPin} className="w-12 h-12 mx-auto mb-4 text-primary-600" />
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Need Help Choosing?</h3>
        <p className="text-secondary-700 text-sm mb-4">
          Our experts can help you select the perfect camera system for your specific needs.
        </p>
        <div className="flex space-x-3 justify-center">
          <a
            href="tel:0261892020"
            className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-soft"
          >
            Call (02) 6189 2020
          </a>
          <a
            href="/#/support"
            className="bg-white text-primary-600 border border-primary-600 px-4 py-2 rounded-xl font-medium hover:bg-primary-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CameraComparison;