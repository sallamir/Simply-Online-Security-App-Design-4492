// Push Notification System for Simply Online Australia
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ezddhpptywphszvxnmto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZGRocHB0eXdwaHN6dnhubXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjEwMjIsImV4cCI6MjA2Njg5NzAyMn0.a8DCZIXhs-Ye3EMBGNrNyNMWpvZm7RfumtGtoE80qrA'
);

// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "simply-online-australia.firebaseapp.com",
  projectId: "simply-online-australia",
  storageBucket: "simply-online-australia.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  vapidKey: "your-vapid-key"
};

class PushNotificationManager {
  constructor() {
    this.messaging = null;
    this.isInitialized = false;
    this.deviceToken = null;
  }

  // Initialize Firebase Messaging
  async initialize() {
    try {
      if (typeof window === 'undefined') return false;

      const { initializeApp } = await import('firebase/app');
      const { getMessaging, getToken, onMessage } = await import('firebase/messaging');

      const app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(app);
      this.isInitialized = true;

      // Set up foreground message listener
      this.setupForegroundListener();

      console.log('Push notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Request notification permission and get token
  async requestPermissionAndGetToken() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.messaging) {
      console.log('Firebase messaging not available');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const { getToken } = await import('firebase/messaging');
        
        const token = await getToken(this.messaging, {
          vapidKey: firebaseConfig.vapidKey
        });

        if (token) {
          this.deviceToken = token;
          await this.saveDeviceToken(token);
          console.log('Device token obtained and saved:', token);
          return token;
        } else {
          console.log('No registration token available');
        }
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error getting notification token:', error);
    }

    return null;
  }

  // Save device token to Supabase
  async saveDeviceToken(token) {
    try {
      const deviceInfo = this.getDeviceInfo();
      
      const { data, error } = await supabase
        .from('device_tokens_so2024')
        .upsert({
          token: token,
          device_type: deviceInfo.type,
          user_agent: deviceInfo.userAgent,
          last_active: new Date().toISOString(),
          subscribed: true,
          preferences: {
            promotions: true,
            tutorials: true,
            products: true,
            general: true
          }
        }, {
          onConflict: 'token'
        });

      if (error) throw error;
      
      console.log('Device token saved successfully');
      return data;
    } catch (error) {
      console.error('Error saving device token:', error);
    }
  }

  // Get device information
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'web';

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      deviceType = 'ios';
    } else if (/android/i.test(userAgent)) {
      deviceType = 'android';
    }

    return {
      type: deviceType,
      userAgent: userAgent
    };
  }

  // Set up foreground message listener
  setupForegroundListener() {
    if (!this.messaging) return;

    import('firebase/messaging').then(({ onMessage }) => {
      onMessage(this.messaging, (payload) => {
        console.log('Foreground message received:', payload);
        
        // Log delivery
        this.logNotificationDelivery(payload, 'delivered');
        
        // Show custom notification
        this.showCustomNotification(payload);
        
        // Handle notification data
        this.handleNotificationData(payload);
      });
    });
  }

  // Show custom in-app notification
  showCustomNotification(payload) {
    const { title, body } = payload.notification || {};
    
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        new Notification(title || 'Simply Online Australia', {
          body: body || 'You have a new update',
          icon: '/icon-192.png',
          tag: 'simply-online-notification',
          data: payload.data
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }

  // Handle notification data and routing
  handleNotificationData(payload) {
    const data = payload.data || {};
    
    // Route based on notification type
    switch (data.type) {
      case 'promotion':
        // Could navigate to products page with discount code
        if (data.code) {
          localStorage.setItem('promoCode', data.code);
        }
        break;
      case 'new_tutorial':
        // Could navigate to specific tutorial
        if (data.tutorial_id) {
          localStorage.setItem('newTutorial', data.tutorial_id);
        }
        break;
      case 'new_product':
        // Could navigate to specific product
        if (data.product_id) {
          localStorage.setItem('newProduct', data.product_id);
        }
        break;
      default:
        console.log('General notification received');
    }
  }

  // Log notification delivery
  async logNotificationDelivery(payload, status) {
    try {
      const { data, error } = await supabase
        .from('notification_delivery_log_so2024')
        .insert({
          notification_id: payload.data?.notification_id,
          status: status,
          delivered_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging notification delivery:', error);
    }
  }

  // Update notification preferences
  async updatePreferences(preferences) {
    if (!this.deviceToken) return;

    try {
      const { data, error } = await supabase
        .from('device_tokens_so2024')
        .update({
          preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('token', this.deviceToken);

      if (error) throw error;
      
      console.log('Notification preferences updated');
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  // Unsubscribe from notifications
  async unsubscribe() {
    if (!this.deviceToken) return;

    try {
      const { data, error } = await supabase
        .from('device_tokens_so2024')
        .update({
          subscribed: false,
          updated_at: new Date().toISOString()
        })
        .eq('token', this.deviceToken);

      if (error) throw error;
      
      console.log('Unsubscribed from notifications');
      return data;
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  }

  // Get pending notifications from backend
  async getPendingNotifications() {
    try {
      const { data, error } = await supabase
        .from('push_notifications_so2024')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
}

// Notification Service Functions for Admin/Backend
export class NotificationService {
  // Send promotion notification
  static async sendPromotionNotification(title, body, discountCode, targetProducts) {
    try {
      const { data, error } = await supabase
        .from('push_notifications_so2024')
        .insert({
          title: title,
          body: body,
          notification_type: 'promotion',
          data: {
            type: 'promotion',
            code: discountCode,
            products: targetProducts
          },
          target_audience: 'all',
          status: 'pending'
        });

      if (error) throw error;
      
      console.log('Promotion notification scheduled');
      return data;
    } catch (error) {
      console.error('Error scheduling promotion:', error);
    }
  }

  // Send new tutorial notification
  static async sendTutorialNotification(tutorialTitle, tutorialId, category) {
    try {
      const { data, error } = await supabase
        .from('push_notifications_so2024')
        .insert({
          title: '📹 New Tutorial Available!',
          body: `Watch: ${tutorialTitle}`,
          notification_type: 'new_tutorial',
          data: {
            type: 'new_tutorial',
            tutorial_id: tutorialId,
            category: category
          },
          target_audience: 'all',
          status: 'pending'
        });

      if (error) throw error;
      
      console.log('Tutorial notification scheduled');
      return data;
    } catch (error) {
      console.error('Error scheduling tutorial notification:', error);
    }
  }

  // Send new product notification
  static async sendProductNotification(productName, productId, category) {
    try {
      const { data, error } = await supabase
        .from('push_notifications_so2024')
        .insert({
          title: '🚀 New Product Launch!',
          body: `Introducing: ${productName}`,
          notification_type: 'new_product',
          data: {
            type: 'new_product',
            product_id: productId,
            category: category
          },
          target_audience: 'customers',
          status: 'pending'
        });

      if (error) throw error;
      
      console.log('Product notification scheduled');
      return data;
    } catch (error) {
      console.error('Error scheduling product notification:', error);
    }
  }

  // Get notification analytics
  static async getNotificationAnalytics() {
    try {
      const { data, error } = await supabase
        .from('notification_delivery_log_so2024')
        .select(`
          status,
          notification_id,
          delivered_at,
          clicked_at,
          push_notifications_so2024 (
            notification_type,
            title,
            created_at
          )
        `);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }
}

// Create singleton instance
const pushNotificationManager = new PushNotificationManager();

export default pushNotificationManager;
export { PushNotificationManager };