import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import { NotificationService } from '../lib/pushNotifications';

const { FiSend, FiPercent, FiTag, FiUsers, FiCalendar, FiDollarSign, FiTarget, FiTrendingUp } = FiIcons;

// Admin component for sending promotional notifications
const PromotionNotificationSender = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  useEffect(() => {
    fetchActiveCampaigns();
  }, []);

  const fetchActiveCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('promotion_campaigns_so2024')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const sendPromotionalNotification = async (campaign) => {
    setLoading(true);
    setSendStatus('');

    try {
      // Send notification using the promotion system
      await NotificationService.sendPromotionNotification(
        campaign.notification_title,
        campaign.notification_body,
        campaign.discount_code,
        campaign.target_products
      );

      setSendStatus(`✅ Promotion "${campaign.name}" sent successfully!`);
      
      // You could also log this in your analytics
      console.log(`Sent promotion: ${campaign.name} to audience: ${campaign.target_audience}`);
    } catch (error) {
      console.error('Error sending promotion:', error);
      setSendStatus(`❌ Failed to send promotion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountDisplay = (campaign) => {
    if (campaign.discount_percentage) {
      return `${campaign.discount_percentage}% OFF`;
    } else if (campaign.discount_amount) {
      return `$${campaign.discount_amount} OFF`;
    }
    return 'Special Offer';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'flash_sale': return 'bg-red-500';
      case 'seasonal': return 'bg-green-500';
      case 'new_customer': return 'bg-blue-500';
      case 'clearance': return 'bg-purple-500';
      default: return 'bg-primary-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-soft border border-secondary-200"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiSend} className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-secondary-900">Promotional Notifications</h2>
      </div>

      {/* Status Display */}
      {sendStatus && (
        <div className="mb-6 p-4 rounded-lg bg-secondary-50 border border-secondary-200">
          <p className="text-sm text-secondary-700">{sendStatus}</p>
        </div>
      )}

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-secondary-900">Active Campaigns</h3>
        
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-secondary-600">
            <SafeIcon icon={FiTag} className="w-12 h-12 mx-auto mb-3 text-secondary-400" />
            <p>No active campaigns found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-secondary-200 rounded-xl p-4 hover:shadow-medium transition-all duration-200"
              >
                {/* Campaign Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${getTypeColor(campaign.type)}`}>
                        {campaign.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-lg font-bold text-primary-600">
                        {getDiscountDisplay(campaign)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-secondary-900">{campaign.name}</h4>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <SafeIcon icon={FiTag} className="w-4 h-4" />
                    <span>Code: <strong>{campaign.discount_code}</strong></span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <SafeIcon icon={FiUsers} className="w-4 h-4" />
                    <span>Target: {campaign.target_audience.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>Ends: {new Date(campaign.end_date).toLocaleDateString()}</span>
                  </div>

                  {campaign.min_order_amount && (
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
                      <span>Min Order: ${campaign.min_order_amount}</span>
                    </div>
                  )}

                  {campaign.target_products && campaign.target_products.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <SafeIcon icon={FiTarget} className="w-4 h-4" />
                      <span>Products: {campaign.target_products.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Notification Preview */}
                <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-secondary-900 mb-1">
                    {campaign.notification_title}
                  </p>
                  <p className="text-xs text-secondary-600">
                    {campaign.notification_body}
                  </p>
                </div>

                {/* Send Button */}
                <button
                  onClick={() => sendPromotionalNotification(campaign)}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send Notification'}</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <h3 className="font-medium text-primary-900 mb-3 flex items-center space-x-2">
          <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
          <span>Quick Promotion Templates</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => sendPromotionalNotification({
              name: 'Flash Sale',
              notification_title: '🔥 Flash Sale: 25% Off Solar Cameras!',
              notification_body: 'Limited time offer on all solar cameras. Free shipping Australia-wide!',
              discount_code: 'FLASH25',
              target_products: ['solar'],
              target_audience: 'all'
            })}
            disabled={loading}
            className="p-3 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors text-left"
          >
            <div className="text-sm font-medium text-primary-900">Flash Sale</div>
            <div className="text-xs text-primary-700">25% off solar cameras</div>
          </button>

          <button
            onClick={() => sendPromotionalNotification({
              name: 'New Customer Welcome',
              notification_title: '🎉 Welcome! Get 15% Off',
              notification_body: 'Start securing your property with our premium cameras. Use code WELCOME15',
              discount_code: 'WELCOME15',
              target_products: ['all'],
              target_audience: 'new_customers'
            })}
            disabled={loading}
            className="p-3 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors text-left"
          >
            <div className="text-sm font-medium text-primary-900">New Customer</div>
            <div className="text-xs text-primary-700">15% welcome offer</div>
          </button>

          <button
            onClick={() => sendPromotionalNotification({
              name: '4G Camera Sale',
              notification_title: '📱 4G Camera Special',
              notification_body: 'Perfect for remote monitoring! Save 20% on all 4G cameras',
              discount_code: '4GSAVE20',
              target_products: ['4g'],
              target_audience: 'all'
            })}
            disabled={loading}
            className="p-3 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors text-left"
          >
            <div className="text-sm font-medium text-primary-900">4G Special</div>
            <div className="text-xs text-primary-700">20% off 4G cameras</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionNotificationSender;