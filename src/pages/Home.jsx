import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiPlay, FiHelpCircle, FiShoppingBag, FiPhone, FiMail, FiStar, FiTrendingUp, FiAward } = FiIcons;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const mainSections = [
    {
      title: 'Browse Products',
      description: 'Solar & 4G security cameras - 34+ products',
      icon: FiShoppingBag,
      path: '/products',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step installation guides',
      icon: FiPlay,
      path: '/tutorials',
      gradient: 'from-secondary-600 to-secondary-700',
    },
    {
      title: 'Customer Reviews',
      description: 'See what our customers say',
      icon: FiStar,
      path: '/testimonials',
      gradient: 'from-accent-500 to-accent-600',
    },
  ];

  // Updated stats based on actual company information
  const stats = [
    { icon: FiStar, value: '4.3', label: 'Customer Rating', color: 'text-primary-600' },
    { icon: FiAward, value: '5+', label: 'Years Experience', color: 'text-secondary-600' },
    { icon: FiTrendingUp, value: '2000+', label: 'Cameras Sold/Year', color: 'text-accent-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 space-y-8"
    >
      {/* Welcome Section with Hero Product */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center py-6"
      >
        {/* Hero Product Image with Floating Animation */}
        <motion.div
          className="mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative mx-auto w-48 h-32">
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751367379821-Camera-4g.jpg"
              alt="4G Solar Camera PTZ - Best Seller"
              className="w-full h-full object-contain rounded-2xl shadow-strong"
            />
            {/* Best Seller Badge */}
            <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-medium">
              #1 Best Seller
            </div>
          </div>
        </motion.div>
        
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Simply Online Australia</h1>
        <p className="text-secondary-600 mb-4">Solar & 4G Security Camera Experts Since 2019</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-soft border border-secondary-100"
            >
              <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className="text-lg font-bold text-secondary-900">{stat.value}</div>
              <div className="text-xs text-secondary-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Global Search Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <form onSubmit={handleGlobalSearch}>
          <SafeIcon
            icon={FiSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400"
          />
          <input
            type="text"
            placeholder="Search products, tutorials & support..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-soft text-base transition-all duration-200"
          />
        </form>
      </motion.div>

      {/* Main Sections */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {mainSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + (index * 0.1) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={section.path}
              className="block relative overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300"
            >
              <div className={`bg-gradient-to-r ${section.gradient} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <SafeIcon icon={section.icon} className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{section.title}</h3>
                    <p className="text-white opacity-90 text-sm">{section.description}</p>
                  </div>
                  <div className="w-8 h-8 text-white opacity-60">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile Apps Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100"
      >
        <h2 className="text-xl font-bold text-secondary-900 mb-6 text-center">Camera Apps</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Ubox App - Updated Links */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-medium">
              <span className="text-white font-bold text-sm">UBOX</span>
            </div>
            <div className="space-y-2">
              <a
                href="https://apps.apple.com/us/app/ubox/id1436112326"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-secondary-900 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary-800 transition-colors"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=cn.ubia.ubox&hl=en&gl=US"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-600 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
              >
                Google Play
              </a>
            </div>
          </div>

          {/* CamHi Pro App */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-medium">
              <span className="text-white font-bold text-xs">CamHi</span>
            </div>
            <div className="space-y-2">
              <a
                href="https://apps.apple.com/app/camhipro/id1420815722"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-secondary-900 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary-800 transition-colors"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.hichip.campro"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-600 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
              >
                Google Play
              </a>
            </div>
          </div>

          {/* iCSee App */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-medium">
              <span className="text-white font-bold text-xs">iCSee</span>
            </div>
            <div className="space-y-2">
              <a
                href="https://apps.apple.com/app/icsee/id1130153523"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-secondary-900 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary-800 transition-colors"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.xm.csee"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-600 text-white px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-secondary-600 mt-4">
          Download the app that matches your camera model
        </p>
      </motion.div>

      {/* Quick Contact */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-6 border border-secondary-200"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Need Expert Help?</h3>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="tel:0261892020"
            className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors shadow-medium"
          >
            <SafeIcon icon={FiPhone} className="w-4 h-4" />
            <span className="text-sm font-medium">Call Now</span>
          </a>
          <Link
            to="/support"
            className="flex items-center justify-center space-x-2 bg-secondary-700 text-white py-3 px-4 rounded-xl hover:bg-secondary-800 transition-colors shadow-medium"
          >
            <SafeIcon icon={FiMail} className="w-4 h-4" />
            <span className="text-sm font-medium">Contact</span>
          </Link>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-secondary-600">
            Call us at <span className="font-semibold text-primary-600">(02) 6189 2020</span>
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            Mon-Thu 3:00 PM - 6:00 PM
          </p>
        </div>
      </motion.div>

      {/* Website Link */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <a
          href="https://simplyonline.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          <span>Visit simplyonline.com.au</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Home;