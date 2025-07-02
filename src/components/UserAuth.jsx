import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserPlus, FiShoppingBag } = FiIcons;

const UserAuth = ({ onAuthSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        // Update last login in our users table
        await supabase
          .from('users_so2024')
          .update({ last_login: new Date().toISOString() })
          .eq('email', formData.email);

        // Store user info
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userId', data.user.id);
        
        onAuthSuccess?.(data.user);
        onClose?.();
      } else {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName
            }
          }
        });

        if (error) throw error;

        // Create user profile in our table
        if (data.user) {
          await supabase
            .from('users_so2024')
            .upsert({
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            }, { onConflict: 'email' });
        }

        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userId', data.user.id);
        
        onAuthSuccess?.(data.user);
        onClose?.();
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.message.includes('User already registered')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (error.message.includes('Password should be at least 6 characters')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-strong"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={isLogin ? FiLogIn : FiUserPlus} className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-secondary-600">
            {isLogin 
              ? 'Sign in to track your Simply Online orders' 
              : 'Join Simply Online for order tracking and exclusive offers'
            }
          </p>
        </div>

        {/* WooCommerce Customer Info */}
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <SafeIcon icon={FiShoppingBag} className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Existing Customer?</p>
                <p>Use the email address from your Simply Online orders to access your purchase history.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields for registration */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Smith"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Password
            </label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-secondary-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <p className="text-secondary-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: ''
                });
              }}
              className="text-primary-600 font-medium hover:text-primary-700 ml-1"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Guest Option */}
        <div className="border-t border-secondary-200 mt-6 pt-4">
          <button
            onClick={onClose}
            className="w-full text-secondary-600 py-2 text-sm hover:text-secondary-700 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserAuth;