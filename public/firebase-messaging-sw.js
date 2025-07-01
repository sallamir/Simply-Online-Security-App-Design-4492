// Firebase Cloud Messaging Service Worker
// This file is conditionally loaded and will only work when Firebase is properly configured

// Check if Firebase scripts are available
let firebaseAvailable = false;

try {
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
  firebaseAvailable = true;
} catch (error) {
  console.log('Firebase scripts not loaded:', error);
}

if (firebaseAvailable && typeof firebase !== 'undefined') {
  // Initialize Firebase
  firebase.initializeApp({
    apiKey: "your-api-key",
    authDomain: "simply-online-australia.firebaseapp.com",
    projectId: "simply-online-australia",
    storageBucket: "simply-online-australia.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  });

  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title || 'Simply Online Australia';
    const notificationOptions = {
      body: payload.notification.body || 'You have a new update',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'simply-online-notification',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Handle the click action
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Fallback for when Firebase is not available
self.addEventListener('message', function(event) {
  console.log('Service worker received message:', event.data);
});