// Firebase Cloud Messaging setup with conditional loading
let firebaseApp = null;
let messaging = null;
let isFirebaseAvailable = false;

// Check if Firebase is available and initialize
const initializeFirebase = async () => {
  try {
    const { initializeApp } = await import('firebase/app');
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
    
    const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "simply-online-australia.firebaseapp.com",
      projectId: "simply-online-australia",
      storageBucket: "simply-online-australia.appspot.com",
      messagingSenderId: "123456789",
      appId: "your-app-id"
    };

    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
    isFirebaseAvailable = true;
    
    return { getToken, onMessage };
  } catch (error) {
    console.log('Firebase not available or not configured:', error.message);
    isFirebaseAvailable = false;
    return null;
  }
};

// Request permission for notifications
export const requestNotificationPermission = async () => {
  if (!isFirebaseAvailable) {
    console.log('Firebase not initialized, attempting to initialize...');
    const firebaseModules = await initializeFirebase();
    if (!firebaseModules) {
      console.log('Firebase initialization failed, notifications disabled');
      return null;
    }
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get registration token
      const { getToken } = await import('firebase/messaging');
      const token = await getToken(messaging, {
        vapidKey: 'your-vapid-key'
      });
      
      if (token) {
        console.log('Registration token:', token);
        // Send token to your server to store for sending notifications
        return token;
      } else {
        console.log('No registration token available.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token: ', error);
  }
  
  return null;
};

// Listen for foreground messages
export const onForegroundMessage = async (callback) => {
  if (!isFirebaseAvailable) {
    await initializeFirebase();
  }
  
  if (!isFirebaseAvailable || !messaging) {
    console.log('Firebase messaging not available');
    return;
  }

  try {
    const { onMessage } = await import('firebase/messaging');
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      
      // Show custom notification or handle the message
      if (callback) {
        callback(payload);
      }
      
      // You can also show a custom in-app notification here
      showCustomNotification(payload);
    });
  } catch (error) {
    console.error('Error setting up foreground message listener:', error);
  }
};

// Show custom notification
const showCustomNotification = (payload) => {
  const { title, body } = payload.notification || {};
  
  // Create a custom notification element or use browser notification
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      new Notification(title || 'Simply Online Australia', {
        body: body || 'You have a new update',
        icon: '/icon-192.png',
        tag: 'simply-online-notification'
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};

// Initialize notifications when app loads
export const initializeNotifications = async () => {
  console.log('Initializing notifications...');
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.log('Not in browser environment, skipping notifications');
    return;
  }

  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  try {
    // Request permission on app start
    await requestNotificationPermission();
    
    // Listen for foreground messages
    await onForegroundMessage((payload) => {
      console.log('Received foreground message:', payload);
    });
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};