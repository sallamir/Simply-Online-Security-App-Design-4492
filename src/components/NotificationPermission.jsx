import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import pushNotificationManager from '../lib/pushNotifications';

const { FiBell, FiX, FiCheckCircle, FiAlertCircle } = FiIcons;

const NotificationPermission = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setPermissionStatus(permission);
      
      // Show prompt if permission is default (not asked yet)
      if (permission === 'default') {
        // Show after 3 seconds to not be intrusive
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    
    try {
      const token = await pushNotificationManager.requestPermissionAndGetToken();
      
      if (token) {
        setPermissionStatus('granted');
        setShowPrompt(false);
        
        // Show success message
        setTimeout(() => {
          alert('🔔 Notifications enabled! You\'ll receive updates about new products, tutorials, and promotions.');
        }, 500);
      } else {
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setPermissionStatus('denied');
    }
    
    setIsLoading(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('notificationPromptDismissed', 'true');
  };

  // Don't show if already dismissed this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('notificationPromptDismissed');
    if (dismissed) {
      setShowPrompt(false);
    }
  }, []);

  if (!showPrompt || permissionStatus !== 'default') {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-xl p-4 shadow-strong border border-primary-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <SafeIcon icon={FiBell} className="w-5 h-5 text-primary-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-secondary-900 mb-1">
                  Stay Updated with Simply Online
                </h3>
                <p className="text-sm text-secondary-600 mb-3">
                  Get notified about new tutorials, product launches, and exclusive promotions for security cameras.
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={requestPermission}
                    disabled={isLoading}
                    className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Enabling...' : 'Enable Notifications'}
                  </button>
                  <button
                    onClick={dismissPrompt}
                    className="px-3 py-2 text-secondary-500 hover:text-secondary-700 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification Status Indicator Component
export const NotificationStatus = () => {
  const [permissionStatus, setPermissionStatus] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const getStatusConfig = () => {
    switch (permissionStatus) {
      case 'granted':
        return {
          icon: FiCheckCircle,
          text: 'Notifications Enabled',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'denied':
        return {
          icon: FiAlertCircle,
          text: 'Notifications Disabled',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      default:
        return {
          icon: FiBell,
          text: 'Enable Notifications',
          color: 'text-secondary-600',
          bgColor: 'bg-secondary-100'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${config.bgColor}`}>
      <SafeIcon icon={config.icon} className={`w-4 h-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default NotificationPermission;