import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tutorials from './pages/Tutorials';
import FAQ from './pages/FAQ';
import Products from './pages/Products';
import Support from './pages/Support';
import Testimonials from './pages/Testimonials';
import TutorialDetail from './pages/TutorialDetail';
import CameraComparison from './pages/CameraComparison';
import OrderTracking from './pages/OrderTracking';
import NotificationPermission from './components/NotificationPermission';
import pushNotificationManager from './lib/pushNotifications';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize push notifications when app loads
    const setupNotifications = async () => {
      try {
        const initialized = await pushNotificationManager.initialize();
        if (initialized) {
          console.log('Push notification system ready');
          
          // Check for any promotional codes from notifications
          const promoCode = localStorage.getItem('promoCode');
          if (promoCode) {
            console.log('Promo code from notification:', promoCode);
            // Could show a banner or apply discount
            localStorage.removeItem('promoCode');
          }
          
          // Check for new tutorial notifications
          const newTutorial = localStorage.getItem('newTutorial');
          if (newTutorial) {
            console.log('New tutorial notification:', newTutorial);
            // Could highlight the tutorial or show a badge
            localStorage.removeItem('newTutorial');
          }
          
          // Check for new product notifications
          const newProduct = localStorage.getItem('newProduct');
          if (newProduct) {
            console.log('New product notification:', newProduct);
            // Could highlight the product or show a badge
            localStorage.removeItem('newProduct');
          }
        }
      } catch (error) {
        console.log('Notifications setup skipped:', error.message);
      }
    };

    setupNotifications();
  }, []);

  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tutorials/:id" element={<TutorialDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/support" element={<Support />} />
            <Route path="/compare" element={<CameraComparison />} />
            <Route path="/orders" element={<OrderTracking />} />
          </Routes>
        </AnimatePresence>
        
        {/* Notification Permission Prompt */}
        <NotificationPermission />
      </Layout>
    </Router>
  );
}

export default App;