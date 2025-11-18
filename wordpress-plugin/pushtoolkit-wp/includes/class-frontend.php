<?php
/**
 * PushToolkit Frontend
 *
 * Handles frontend integration and service worker
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class PushToolkit_Frontend {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('wp_footer', array($this, 'add_installation_script'));
        add_action('wp_head', array($this, 'add_meta_tags'));
    }

    /**
     * Add installation script to footer
     */
    public function add_installation_script() {
        $settings = get_option('pushtoolkit_settings', array());
        $api_url = isset($settings['api_url']) ? $settings['api_url'] : '';
        $site_id = isset($settings['site_id']) ? $settings['site_id'] : '';

        if (empty($api_url) || empty($site_id)) {
            return;
        }

        // Get VAPID public key
        $api = pushtoolkit_wp()->api;
        $vapid_key = $api->get_vapid_public_key();

        if (is_wp_error($vapid_key) || empty($vapid_key)) {
            return;
        }

        $upload_dir = wp_upload_dir();
        $sw_url = $upload_dir['baseurl'] . '/sw.js';

        ?>
        <script>
        (function() {
            'use strict';

            const pushToolkitConfig = {
                apiUrl: '<?php echo esc_js($api_url); ?>/api',
                siteId: '<?php echo esc_js($site_id); ?>',
                publicKey: '<?php echo esc_js($vapid_key); ?>',
                swUrl: '<?php echo esc_js($sw_url); ?>'
            };

            // Check for service worker support
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.log('Push notifications not supported');
                return;
            }

            // Convert base64 string to Uint8Array
            function urlBase64ToUint8Array(base64String) {
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

            // Initialize push notifications
            function initPushNotifications() {
                navigator.serviceWorker.register(pushToolkitConfig.swUrl)
                    .then(function(registration) {
                        console.log('Service Worker registered:', registration);

                        // Check if already subscribed
                        return registration.pushManager.getSubscription();
                    })
                    .then(function(existingSubscription) {
                        if (existingSubscription) {
                            console.log('Already subscribed to push notifications');
                            return null;
                        }

                        // Request notification permission
                        return Notification.requestPermission();
                    })
                    .then(function(permission) {
                        if (permission === null) {
                            // Already subscribed
                            return null;
                        }

                        if (permission !== 'granted') {
                            console.log('Notification permission denied');
                            return null;
                        }

                        console.log('Notification permission granted');

                        // Get service worker registration
                        return navigator.serviceWorker.ready;
                    })
                    .then(function(registration) {
                        if (!registration) {
                            return null;
                        }

                        // Subscribe to push notifications
                        const applicationServerKey = urlBase64ToUint8Array(pushToolkitConfig.publicKey);
                        return registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: applicationServerKey
                        });
                    })
                    .then(function(subscription) {
                        if (!subscription) {
                            return;
                        }

                        console.log('Push subscription:', subscription);

                        // Send subscription to backend
                        const subscriptionData = {
                            siteId: pushToolkitConfig.siteId,
                            subscription: subscription.toJSON(),
                            browser: navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0] || 'unknown',
                            os: navigator.platform || 'unknown',
                            metadata: {
                                url: window.location.href,
                                referrer: document.referrer
                            }
                        };

                        return fetch(pushToolkitConfig.apiUrl + '/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(subscriptionData)
                        });
                    })
                    .then(function(response) {
                        if (!response) {
                            return;
                        }

                        if (!response.ok) {
                            throw new Error('Failed to send subscription to server');
                        }

                        return response.json();
                    })
                    .then(function(data) {
                        if (!data) {
                            return;
                        }

                        console.log('Subscription sent to server:', data);
                    })
                    .catch(function(error) {
                        console.error('Push notification error:', error);
                    });
            }

            // Wait for page load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initPushNotifications);
            } else {
                initPushNotifications();
            }
        })();
        </script>
        <?php
    }

    /**
     * Add meta tags for manifest
     */
    public function add_meta_tags() {
        echo '<meta name="theme-color" content="#000000">' . "\n";
    }
}
