/**
 * PushToolkit SDK
 * Client-side script for websites to enable push notifications
 * Supports Chrome, Firefox, and Safari 16.4+
 */

(function() {
  'use strict';

  const PushSDK = {
    config: {
      apiUrl: null,
      siteId: null,
      vapidPublicKey: null,
      serviceWorkerPath: '/sw.js',
      autoPrompt: false,
      promptDelay: 0,
    },

    /**
     * Initialize the SDK
     * @param {Object} options - Configuration options
     */
    init: function(options) {
      if (!options.apiUrl || !options.siteId || !options.vapidPublicKey) {
        console.error('[PushSDK] Missing required configuration');
        return;
      }

      this.config = { ...this.config, ...options };

      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('[PushSDK] Service workers not supported');
        return;
      }

      // Check if Push API is supported
      if (!('PushManager' in window)) {
        console.warn('[PushSDK] Push messaging not supported');
        return;
      }

      // Register service worker
      this.registerServiceWorker();

      // Auto-prompt if configured
      if (this.config.autoPrompt) {
        setTimeout(() => {
          this.promptForPermission();
        }, this.config.promptDelay);
      }
    },

    /**
     * Register the service worker
     */
    registerServiceWorker: async function() {
      try {
        const registration = await navigator.serviceWorker.register(
          this.config.serviceWorkerPath,
          { scope: '/' }
        );

        console.log('[PushSDK] Service worker registered:', registration);

        // Send API endpoint configuration to service worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'SET_API_ENDPOINT',
            endpoint: this.config.apiUrl
          });
        } else {
          // Wait for service worker to activate
          navigator.serviceWorker.ready.then((reg) => {
            reg.active.postMessage({
              type: 'SET_API_ENDPOINT',
              endpoint: this.config.apiUrl
            });
          });
        }

        return registration;
      } catch (error) {
        console.error('[PushSDK] Service worker registration failed:', error);
        throw error;
      }
    },

    /**
     * Prompt user for notification permission
     */
    promptForPermission: async function() {
      try {
        const permission = await Notification.requestPermission();
        console.log('[PushSDK] Permission result:', permission);

        if (permission === 'granted') {
          await this.subscribe();
        } else if (permission === 'denied') {
          console.log('[PushSDK] Notification permission denied');
        }

        return permission;
      } catch (error) {
        console.error('[PushSDK] Error requesting permission:', error);
        throw error;
      }
    },

    /**
     * Subscribe to push notifications
     */
    subscribe: async function() {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          // Create new subscription
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.config.vapidPublicKey)
          });

          console.log('[PushSDK] New subscription created');
        } else {
          console.log('[PushSDK] Already subscribed');
        }

        // Send subscription to server
        await this.sendSubscriptionToServer(subscription);

        return subscription;
      } catch (error) {
        console.error('[PushSDK] Subscription failed:', error);
        throw error;
      }
    },

    /**
     * Unsubscribe from push notifications
     */
    unsubscribe: async function() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          await this.removeSubscriptionFromServer(subscription);
          console.log('[PushSDK] Unsubscribed successfully');
          return true;
        }

        return false;
      } catch (error) {
        console.error('[PushSDK] Unsubscribe failed:', error);
        throw error;
      }
    },

    /**
     * Get current subscription status
     */
    getSubscription: async function() {
      try {
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
      } catch (error) {
        console.error('[PushSDK] Error getting subscription:', error);
        return null;
      }
    },

    /**
     * Check notification permission status
     */
    getPermissionStatus: function() {
      if (!('Notification' in window)) {
        return 'unsupported';
      }
      return Notification.permission;
    },

    /**
     * Send subscription to backend API
     */
    sendSubscriptionToServer: async function(subscription) {
      try {
        const response = await fetch(`${this.config.apiUrl}/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            siteId: this.config.siteId,
            subscription: subscription.toJSON(),
            userAgent: navigator.userAgent,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save subscription');
        }

        const data = await response.json();
        console.log('[PushSDK] Subscription saved:', data);
        return data;
      } catch (error) {
        console.error('[PushSDK] Error sending subscription:', error);
        throw error;
      }
    },

    /**
     * Remove subscription from backend API
     */
    removeSubscriptionFromServer: async function(subscription) {
      try {
        const response = await fetch(`${this.config.apiUrl}/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });

        if (!response.ok) {
          throw new Error('Failed to remove subscription');
        }

        console.log('[PushSDK] Subscription removed from server');
      } catch (error) {
        console.error('[PushSDK] Error removing subscription:', error);
        throw error;
      }
    },

    /**
     * Convert VAPID key to Uint8Array
     */
    urlBase64ToUint8Array: function(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  };

  // Expose SDK globally
  window.PushSDK = PushSDK;
})();
