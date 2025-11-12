/* eslint-disable no-restricted-globals */
/**
 * PushToolkit Service Worker
 * Handles push events, notification display, and click tracking
 * Supports Chrome, Firefox, and Safari (16.4+)
 */

// API endpoint is injected at registration time via postMessage
// or falls back to relative path (works if SW is served from same domain)
let API_ENDPOINT = self.location.origin + '/api';

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  if (!event.data) {
    console.log('[Service Worker] Push event but no data');
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.message || data.body,
      icon: data.icon || data.iconUrl || '/default-icon.png',
      image: data.image || data.imageUrl,
      badge: data.badge || '/badge-icon.png',
      tag: data.tag || 'notification',
      data: {
        url: data.url || data.destinationUrl || '/',
        notificationId: data.notificationId,
        clickTrackingUrl: data.clickTrackingUrl,
        ...data.data
      },
      requireInteraction: data.requireInteraction || false,
      vibrate: data.vibrate || [200, 100, 200],
      actions: data.actions || data.actionButtons || []
    };

    // Show the notification
    event.waitUntil(
      self.registration.showNotification(data.title, options)
        .then(() => {
          // Track impression
          return trackEvent('impression', data.notificationId);
        })
    );
  } catch (error) {
    console.error('[Service Worker] Error handling push:', error);
  }
});

// Listen for notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);

  event.notification.close();

  const notificationData = event.notification.data;
  const targetUrl = notificationData.url || '/';

  event.waitUntil(
    // Track the click event
    trackEvent('click', notificationData.notificationId)
      .then(() => {
        // Open or focus the target URL
        return clients.matchAll({ type: 'window', includeUncontrolled: true });
      })
      .then((clientList) => {
        // Check if there's already a window open with the target URL
        for (let client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
      .catch((error) => {
        console.error('[Service Worker] Error handling click:', error);
      })
  );
});

// Listen for notification close events
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed:', event);

  const notificationData = event.notification.data;

  event.waitUntil(
    trackEvent('dismissed', notificationData.notificationId)
  );
});

// Track events (impressions, clicks, dismissals)
async function trackEvent(eventType, notificationId) {
  if (!notificationId) {
    console.warn('[Service Worker] No notification ID for tracking');
    return;
  }

  try {
    const response = await fetch(`${API_ENDPOINT}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        notificationId,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('[Service Worker] Tracking failed:', response.status);
    }
  } catch (error) {
    console.error('[Service Worker] Error tracking event:', error);
  }
}

// Install event - cache service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the main thread to configure API endpoint
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_API_ENDPOINT') {
    API_ENDPOINT = event.data.endpoint;
    console.log('[Service Worker] API endpoint configured:', API_ENDPOINT);
  }
});

// Background sync for offline tracking
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tracking') {
    event.waitUntil(syncPendingEvents());
  }
});

async function syncPendingEvents() {
  // TODO: Implement offline event queue and sync
  console.log('[Service Worker] Syncing pending events...');
}
