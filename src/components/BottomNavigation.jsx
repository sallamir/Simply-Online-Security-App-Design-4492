import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiPlay, FiHelpCircle, FiShoppingBag, FiHeadphones, FiStar, FiPackage } = FiIcons;

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/products', icon: FiShoppingBag, label: 'Products' },
    { path: '/tutorials', icon: FiPlay, label: 'Tutorials' },
    { path: '/orders', icon: FiPackage, label: 'Orders' },
    { path: '/support', icon: FiHeadphones, label: 'Support' },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-secondary-100 safe-area-bottom shadow-strong"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-2 px-3 min-w-0 touch-target"
            >
              <motion.div
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50 shadow-soft'
                    : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
              </motion.div>
              <span
                className={`text-xs mt-1 truncate font-medium ${
                  isActive ? 'text-primary-600' : 'text-secondary-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;