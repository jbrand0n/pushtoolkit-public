import webpush from 'web-push';

/**
 * Generate VAPID keys for a new site
 * @returns {Object} Object containing publicKey and privateKey
 */
export const generateVapidKeys = () => {
  return webpush.generateVAPIDKeys();
};

/**
 * Configure web-push with VAPID details
 * @param {string} publicKey - VAPID public key
 * @param {string} privateKey - VAPID private key
 * @param {string} subject - Contact email or URL
 */
export const setVapidDetails = (publicKey, privateKey, subject = 'mailto:admin@example.com') => {
  webpush.setVapidDetails(subject, publicKey, privateKey);
};

/**
 * Send push notification to subscriber
 * @param {Object} subscription - Push subscription object
 * @param {Object} payload - Notification payload
 * @param {Object} options - Push options
 * @returns {Promise} Send result
 */
export const sendPushNotification = async (subscription, payload, options = {}) => {
  const subscriptionObject = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dhKey,
      auth: subscription.authKey,
    },
  };

  const payloadString = JSON.stringify(payload);

  return await webpush.sendNotification(subscriptionObject, payloadString, options);
};
