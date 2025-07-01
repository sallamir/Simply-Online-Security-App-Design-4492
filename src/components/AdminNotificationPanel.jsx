import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { NotificationService } from '../lib/pushNotifications';

const { FiSend, FiUsers, FiTag, FiCalendar, FiBarChart3 } = FiIcons;

// Admin panel for sending notifications (would be protected in real app)
const AdminNotificationPanel = () => {
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    body: '',
    type: 'general',
    targetAudience: 'all',
    data: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      switch (notificationForm.type) {
        case 'promotion':
          await NotificationService.sendPromotionNotification(
            notificationForm.title,
            notificationForm.body,
            notificationForm.data.code,
            notificationForm.data.products
          );
          break;
        case 'new_tutorial':
          await NotificationService.sendTutorialNotification(
            notificationForm.body,
            notificationForm.data.tutorial_id,
            notificationForm.data.category
          );
          break;
        case 'new_product':
          await NotificationService.sendProductNotification(
            notificationForm.body,
            notificationForm.data.product_id,
            notificationForm.data.category
          );
          break;
        default:
          // Handle general notifications
          break;
      }

      alert('Notification scheduled successfully!');
      
      // Reset form
      setNotificationForm({
        title: '',
        body: '',
        type: 'general',
        targetAudience: 'all',
        data: {}
      });

    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error scheduling notification');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setNotificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDataChange = (field, value) => {
    setNotificationForm(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-soft border border-secondary-200"
    >
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiSend} className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-secondary-900">Send Push Notification</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notification Type */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Notification Type
          </label>
          <select
            value={notificationForm.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="general">General Announcement</option>
            <option value="promotion">Promotion/Sale</option>
            <option value="new_tutorial">New Tutorial</option>
            <option value="new_product">New Product Launch</option>
            <option value="faq_update">FAQ Update</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={notificationForm.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., 🔥 Flash Sale: 20% Off Solar Cameras!"
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Message
          </label>
          <textarea
            value={notificationForm.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="e.g., Limited time offer on all 4G Solar PTZ cameras. Free shipping Australia-wide!"
            rows={3}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Conditional Fields Based on Type */}
        {notificationForm.type === 'promotion' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Discount Code
              </label>
              <input
                type="text"
                value={notificationForm.data.code || ''}
                onChange={(e) => handleDataChange('code', e.target.value)}
                placeholder="e.g., SOLAR20"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Target Products
              </label>
              <input
                type="text"
                value={notificationForm.data.products || ''}
                onChange={(e) => handleDataChange('products', e.target.value.split(','))}
                placeholder="e.g., 4g-solar,wifi-cameras"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {notificationForm.type === 'new_tutorial' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tutorial ID
              </label>
              <input
                type="text"
                value={notificationForm.data.tutorial_id || ''}
                onChange={(e) => handleDataChange('tutorial_id', e.target.value)}
                placeholder="e.g., 15"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category
              </label>
              <select
                value={notificationForm.data.category || ''}
                onChange={(e) => handleDataChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                <option value="ubox">UBOX App</option>
                <option value="camhipro">CamHi Pro</option>
                <option value="4g">4G Setup</option>
                <option value="wifi">WiFi Setup</option>
                <option value="solar">Solar Cameras</option>
              </select>
            </div>
          </div>
        )}

        {notificationForm.type === 'new_product' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Product ID
              </label>
              <input
                type="text"
                value={notificationForm.data.product_id || ''}
                onChange={(e) => handleDataChange('product_id', e.target.value)}
                placeholder="e.g., 76631"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category
              </label>
              <select
                value={notificationForm.data.category || ''}
                onChange={(e) => handleDataChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                <option value="4g">4G Cameras</option>
                <option value="wifi">WiFi Cameras</option>
                <option value="solar">Solar Cameras</option>
                <option value="accessories">Accessories</option>
                <option value="doorlock">Smart Locks</option>
              </select>
            </div>
          </div>
        )}

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Target Audience
          </label>
          <select
            value={notificationForm.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Users</option>
            <option value="customers">Existing Customers</option>
            <option value="new_users">New Users</option>
            <option value="active_users">Active Users</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Scheduling...' : 'Schedule Notification'}
        </button>
      </form>

      {/* Quick Action Buttons */}
      <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
        <h3 className="font-medium text-secondary-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setNotificationForm({
              title: '🔥 Flash Sale: 20% Off Solar Cameras!',
              body: 'Limited time offer on all 4G Solar PTZ cameras. Free shipping Australia-wide!',
              type: 'promotion',
              targetAudience: 'all',
              data: { code: 'SOLAR20', products: ['4g-solar'] }
            })}
            className="p-3 border border-secondary-200 rounded-lg hover:bg-white transition-colors text-left"
          >
            <SafeIcon icon={FiTag} className="w-5 h-5 text-primary-600 mb-1" />
            <div className="text-sm font-medium text-secondary-900">Promotion Template</div>
            <div className="text-xs text-secondary-600">20% off solar cameras</div>
          </button>

          <button
            type="button"
            onClick={() => setNotificationForm({
              title: '📹 New Tutorial Available!',
              body: 'Watch: Complete 4G Camera Setup Guide',
              type: 'new_tutorial',
              targetAudience: 'all',
              data: { tutorial_id: '15', category: '4g' }
            })}
            className="p-3 border border-secondary-200 rounded-lg hover:bg-white transition-colors text-left"
          >
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-secondary-600 mb-1" />
            <div className="text-sm font-medium text-secondary-900">Tutorial Template</div>
            <div className="text-xs text-secondary-600">New setup guide</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminNotificationPanel;