import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { NotificationService } from '../lib/pushNotifications';

const { FiBell, FiX, FiSettings, FiCheck, FiTrash2, FiExternalLink } = FiIcons;

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    promotions: true,
    tutorials: true,
    products: true,
    general: true
  });

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      // Get recent notifications from backend
      const recentNotifications = await NotificationService.getNotificationAnalytics();
      setNotifications(recentNotifications.slice(0, 10)); // Show last 10
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handlePreferenceChange = (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    setPreferences(newPreferences);
    
    // Update preferences in backend
    import('../lib/pushNotifications').then(({ default: pushManager }) => {
      pushManager.updatePreferences(newPreferences);
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promotion': return '🔥';
      case 'new_tutorial': return '📹';
      case 'new_product': return '🚀';
      case 'faq_update': return '💡';
      default: return '🔔';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBell} className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-secondary-900">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-secondary-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Notification Preferences */}
            <div className="p-4 border-b border-secondary-100">
              <div className="flex items-center space-x-2 mb-3">
                <SafeIcon icon={FiSettings} className="w-4 h-4 text-secondary-600" />
                <h3 className="font-medium text-secondary-900">Notification Preferences</h3>
              </div>
              
              <div className="space-y-3">
                {Object.entries(preferences).map(([key, enabled]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-secondary-700 capitalize">
                      {key === 'promotions' ? 'Promotions & Offers' : 
                       key === 'tutorials' ? 'New Tutorials' :
                       key === 'products' ? 'Product Launches' : 'General Updates'}
                    </span>
                    <button
                      onClick={() => handlePreferenceChange(key)}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        enabled ? 'bg-primary-600' : 'bg-secondary-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="p-4">
              <h3 className="font-medium text-secondary-900 mb-3">Recent Notifications</h3>
              
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 bg-secondary-50 rounded-lg border border-secondary-200"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">
                          {getNotificationIcon(notification.push_notifications_so2024?.notification_type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-secondary-900 mb-1">
                            {notification.push_notifications_so2024?.title}
                          </h4>
                          <p className="text-xs text-secondary-600 mb-2">
                            {new Date(notification.delivered_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              notification.status === 'clicked' ? 'bg-blue-100 text-blue-700' :
                              'bg-secondary-100 text-secondary-700'
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SafeIcon icon={FiBell} className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-sm text-secondary-600">No notifications yet</p>
                  <p className="text-xs text-secondary-500 mt-1">
                    You'll see updates about products and tutorials here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-200">
            <button
              className="w-full text-sm text-primary-600 hover:text-primary-700 transition-colors"
              onClick={() => window.open('https://simplyonline.com.au', '_blank')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Visit simplyonline.com.au</span>
                <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;