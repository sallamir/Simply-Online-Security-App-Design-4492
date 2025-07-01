import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeadphones, FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageCircle, FiMessageSquare } = FiIcons;

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleCall = () => {
    window.location.href = 'tel:0261892020';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:Info@simplyonline.com.au';
  };

  const handleChat = () => {
    // Redirect to website contact page for chat
    window.open('https://simplyonline.com.au/contact-us/', '_blank', 'noopener,noreferrer');
  };

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
        <SafeIcon icon={FiHeadphones} className="w-12 h-12 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
        <p className="text-primary-100">
          Get in touch with Simply Online Australia
        </p>
      </motion.div>

      {/* Contact Methods - Reordered as requested */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* 1. Chat - First Priority */}
        <div className="bg-white rounded-xl p-6 border border-secondary-200 text-center shadow-soft">
          <SafeIcon icon={FiMessageSquare} className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold text-secondary-900 mb-2">Live Chat</h3>
          <p className="text-lg font-bold text-primary-600 mb-3">Instant Support</p>
          <p className="text-sm text-secondary-600 mb-4">Get immediate help from our support team</p>
          <button
            onClick={handleChat}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 shadow-medium"
          >
            <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
            <span>Start Chat</span>
          </button>
        </div>

        {/* 2. Contact Form - Second Priority */}
        <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-soft">
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiMessageCircle} className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-secondary-900">Send us a Message</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="How can we help you? Please describe your question or issue in detail..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 shadow-medium"
            >
              <SafeIcon icon={FiSend} className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* 3. Email - Third Priority */}
        <div className="bg-white rounded-xl p-6 border border-secondary-200 text-center shadow-soft">
          <SafeIcon icon={FiMail} className="w-8 h-8 text-secondary-600 mx-auto mb-3" />
          <h3 className="font-semibold text-secondary-900 mb-2">Email Us</h3>
          <p className="text-lg font-bold text-primary-600 mb-3">Info@simplyonline.com.au</p>
          <p className="text-sm text-secondary-600 mb-4">We respond within 24 hours</p>
          <button
            onClick={handleEmail}
            className="w-full bg-secondary-600 text-white py-3 px-4 rounded-xl hover:bg-secondary-700 transition-colors flex items-center justify-center space-x-2 shadow-medium"
          >
            <SafeIcon icon={FiMail} className="w-4 h-4" />
            <span>Send Email</span>
          </button>
        </div>

        {/* 4. Phone - Fourth Priority */}
        <div className="bg-white rounded-xl p-6 border border-secondary-200 text-center shadow-soft">
          <SafeIcon icon={FiPhone} className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-secondary-900 mb-2">Call Us</h3>
          <p className="text-lg font-bold text-primary-600 mb-3">(02) 6189 2020</p>
          <p className="text-sm text-secondary-600 mb-4">Monday to Thursday, 3:00 PM - 6:00 PM</p>
          <button
            onClick={handleCall}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 shadow-medium"
          >
            <SafeIcon icon={FiPhone} className="w-4 h-4" />
            <span>Call Now</span>
          </button>
        </div>
      </motion.div>

      {/* Business Information */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-secondary-50 rounded-xl p-6 border border-secondary-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751365731047-Logo.png"
            alt="Simply Online" 
            className="w-8 h-8 rounded-lg object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h3 className="text-lg font-semibold text-secondary-900">Simply Online Australia</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiMapPin} className="w-5 h-5 text-secondary-500 mt-0.5" />
            <div>
              <p className="font-medium text-secondary-900">Address</p>
              <p className="text-sm text-secondary-600">
                Australia-wide delivery and support<br />
                Online security camera specialists
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiPhone} className="w-5 h-5 text-secondary-500 mt-0.5" />
            <div>
              <p className="font-medium text-secondary-900">Phone</p>
              <p className="text-sm text-secondary-600">(02) 6189 2020</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiMail} className="w-5 h-5 text-secondary-500 mt-0.5" />
            <div>
              <p className="font-medium text-secondary-900">Email</p>
              <p className="text-sm text-secondary-600">Info@simplyonline.com.au</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Hours - Simplified */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 border border-secondary-200 text-center shadow-soft"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Business Hours</h3>
        <div className="text-sm text-secondary-600 space-y-3">
          <div>
            <p className="font-semibold text-secondary-900">Monday to Thursday:</p>
            <p className="text-lg font-bold text-primary-600">3:00 PM - 6:00 PM</p>
          </div>
          <div className="pt-3 border-t border-secondary-200">
            <p><strong>Friday - Sunday:</strong> Closed</p>
          </div>
          <p className="text-xs text-secondary-500 mt-3">
            Email support available 24/7 with responses within 24 hours
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Support;