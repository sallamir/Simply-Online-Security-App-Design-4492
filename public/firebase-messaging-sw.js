// Firebase Cloud Messaging Service Worker for Simply Online Australia
// This handles background notifications when the app is not in focus

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase (replace with your actual config)
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

  const notificationTitle = payload.notification?.title || 'Simply Online Australia';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'simply-online-notification',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true, // Keep notification visible until user interacts
    silent: false
  };

  // Customize notification based on type
  if (payload.data?.type === 'promotion') {
    notificationOptions.badge = '🔥';
    notificationOptions.actions = [
      {
        action: 'shop',
        title: 'Shop Now',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Later'
      }
    ];
  } else if (payload.data?.type === 'new_tutorial') {
    notificationOptions.badge = '📹';
    notificationOptions.actions = [
      {
        action: 'watch',
        title: 'Watch Now',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Later'
      }
    ];
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  notification.close();

  // Handle different actions
  if (action === 'dismiss') {
    // Just close the notification
    return;
  }

  // Default action or specific actions
  let urlToOpen = '/';

  switch (data.type) {
    case 'promotion':
      if (action === 'shop') {
        urlToOpen = '/#/products';
        // Store promo code for the app to use
        if (data.code) {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'PROMO_CODE',
                code: data.code
              });
            });
          });
        }
      }
      break;
    case 'new_tutorial':
      if (action === 'watch') {
        urlToOpen = data.tutorial_id ? `/#/tutorials/${data.tutorial_id}` : '/#/tutorials';
      }
      break;
    case 'new_product':
      urlToOpen = data.product_id ? `/#/products/${data.product_id}` : '/#/products';
      break;
    default:
      urlToOpen = '/';
  }

  // Open the app or focus existing tab
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(function(clientList) {
      // Check if app is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Navigate to the specific URL
          client.postMessage({
            type: 'NAVIGATE',
            url: urlToOpen
          });
          return client.focus();
        }
      }
      
      // If no existing window, open new one
      if (clients.openWindow) {
        return clients.openWindow(self.location.origin + urlToOpen);
      }
    })
  );

  // Log the click for analytics
  fetch('/api/notification-analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notification_id: data.notification_id,
      action: action || 'click',
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.log('Analytics logging failed:', err));
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('[firebase-messaging-sw.js] Notification closed.');
  
  const data = event.notification.data || {};
  
  // Log the dismissal for analytics
  fetch('/api/notification-analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notification_id: data.notification_id,
      action: 'dismiss',
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.log('Analytics logging failed:', err));
});

// Listen for messages from the main app
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});