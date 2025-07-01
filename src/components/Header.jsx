import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft } = FiIcons;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Simply Online';
      case '/tutorials': return 'Video Tutorials';
      case '/faq': return 'FAQ';
      case '/products': return 'Products';
      case '/support': return 'Support';
      case '/testimonials': return 'Testimonials';
      default:
        if (location.pathname.startsWith('/tutorials/')) return 'Tutorial';
        if (location.pathname.startsWith('/products/')) return 'Product Details';
        return 'Simply Online';
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-soft border-b border-secondary-100 safe-area-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-4 h-16">
        <div className="flex items-center space-x-3">
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-secondary-50 transition-colors touch-target"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-secondary-700" />
            </button>
          )}
          
          {isHomePage && (
            <div className="flex items-center space-x-3">
              {/* Updated Simply Online Logo - PNG format */}
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751365731047-Logo.png"
                alt="Simply Online Australia"
                className="w-10 h-10 rounded-xl shadow-medium object-contain"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f97316' rx='8'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3ESO%3C/text%3E%3C/svg%3E";
                }}
              />
              <div>
                <h1 className="text-lg font-bold text-secondary-900">Simply Online</h1>
                <p className="text-xs text-primary-600">Security Experts</p>
              </div>
            </div>
          )}
        </div>

        {!isHomePage && (
          <h1 className="text-lg font-semibold text-secondary-900 truncate">
            {getPageTitle()}
          </h1>
        )}

        <div className="w-10"></div>
      </div>
    </motion.header>
  );
};

export default Header;