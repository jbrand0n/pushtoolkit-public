/**
 * PushToolkit Service Worker
 *
 * Handles push notifications for WordPress
 */

const API_URL = '{{API_URL}}';

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(self.clients.claim());
});

// Push event - when notification is received
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);

    if (!event.data) {
        console.log('Push event has no data');
        return;
    }

    let data;
    try {
        data = event.data.json();
    } catch (e) {
        console.error('Failed to parse push data:', e);
        return;
    }

    const options = {
        body: data.message || data.body || '',
        icon: data.icon || data.iconUrl || '/wp-content/uploads/push-icon.png',
        badge: data.badge || data.icon || '/wp-content/uploads/push-badge.png',
        image: data.image || data.imageUrl,
        data: {
            url: data.url || data.destinationUrl || '/',
            notificationId: data.notificationId,
            clickAction: data.clickAction || 'open_url'
        },
        requireInteraction: data.requireInteraction || false,
        tag: data.tag || 'pushtoolkit-notification',
        renotify: data.renotify || false,
        vibrate: data.vibrate || [200, 100, 200],
        timestamp: Date.now()
    };

    // Add action buttons if provided
    if (data.actions && Array.isArray(data.actions)) {
        options.actions = data.actions.map(action => ({
            action: action.action,
            title: action.title,
            icon: action.icon
        }));
    }

    event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
            .then(() => {
                // Track impression
                if (data.notificationId) {
                    trackEvent('impression', data.notificationId);
                }
            })
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);

    event.notification.close();

    const data = event.notification.data || {};
    const url = data.url || '/';
    const notificationId = data.notificationId;

    // Track click
    if (notificationId) {
        trackEvent('click', notificationId);
    }

    // Handle action button clicks
    if (event.action) {
        console.log('Action clicked:', event.action);
        // You can handle different actions here
    }

    // Open URL
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open with this URL
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If no window is open, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);

    const data = event.notification.data || {};
    const notificationId = data.notificationId;

    // Track dismissal
    if (notificationId) {
        trackEvent('dismissed', notificationId);
    }
});

// Track event to backend
function trackEvent(eventType, notificationId) {
    if (!notificationId) {
        return;
    }

    const trackingUrl = `${API_URL}/track`;
    const trackingData = {
        notificationId: notificationId,
        event: eventType,
        timestamp: new Date().toISOString()
    };

    fetch(trackingUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackingData)
    }).catch((error) => {
        console.error('Failed to track event:', error);
    });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
