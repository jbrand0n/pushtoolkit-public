import prisma from '../config/database.js';
import { generateVapidKeys } from '../utils/vapid.js';
import { AppError } from '../middleware/errorHandler.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { randomBytes } from 'crypto';

/**
 * Generate unique site ID
 */
const generateSiteId = () => {
  return randomBytes(16).toString('hex');
};

/**
 * Create new site
 */
export const createSite = async (req, res, next) => {
  try {
    const { name, url, settings } = req.body;

    // Validate input
    if (!name || !url) {
      throw new AppError('Site name and URL are required', 400);
    }

    // Generate VAPID keys for the site
    const vapidKeys = generateVapidKeys();
    const siteId = generateSiteId();

    // Encrypt VAPID private key before storing
    const encryptedPrivateKey = encrypt(vapidKeys.privateKey);

    // Create site
    const site = await prisma.site.create({
      data: {
        name,
        url,
        siteId,
        vapidPublicKey: vapidKeys.publicKey,
        vapidPrivateKey: encryptedPrivateKey,
        ownerId: req.user.id,
        settings: settings || {},
      },
      select: {
        id: true,
        name: true,
        url: true,
        siteId: true,
        vapidPublicKey: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { site },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all sites for current user
 */
export const getSites = async (req, res, next) => {
  try {
    const sites = await prisma.site.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          {
            siteUsers: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        url: true,
        siteId: true,
        vapidPublicKey: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subscribers: true,
            notifications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: { sites },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single site details
 */
export const getSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        OR: [
          { ownerId: req.user.id },
          {
            siteUsers: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        url: true,
        siteId: true,
        vapidPublicKey: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subscribers: true,
            notifications: true,
          },
        },
      },
    });

    if (!site) {
      throw new AppError('Site not found', 404);
    }

    res.json({
      success: true,
      data: { site },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update site
 */
export const updateSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const { name, url, settings } = req.body;

    const site = await prisma.site.update({
      where: { id: siteId },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(settings && { settings }),
      },
      select: {
        id: true,
        name: true,
        url: true,
        siteId: true,
        vapidPublicKey: true,
        settings: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: { site },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get installation code for site
 */
export const getInstallCode = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: {
        siteId: true,
        vapidPublicKey: true,
      },
    });

    if (!site) {
      throw new AppError('Site not found', 404);
    }

    // Generate installation script
    const installCode = `<script>
  (function() {
    var siteId = '${site.siteId}';
    var publicKey = '${site.vapidPublicKey}';
    var apiUrl = '${process.env.API_URL || 'http://localhost:3000'}/api';

    // Load service worker and register for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('Service Worker registered:', registration);

          // Request notification permission
          return Notification.requestPermission();
        })
        .then(function(permission) {
          if (permission === 'granted') {
            return navigator.serviceWorker.ready;
          }
        })
        .then(function(registration) {
          if (registration) {
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey)
            });
          }
        })
        .then(function(subscription) {
          if (subscription) {
            // Send subscription to server
            return fetch(apiUrl + '/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                siteId: siteId,
                subscription: subscription
              })
            });
          }
        })
        .catch(function(error) {
          console.error('Push subscription failed:', error);
        });
    }

    function urlBase64ToUint8Array(base64String) {
      var padding = '='.repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');
      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);
      for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  })();
</script>`;

    res.json({
      success: true,
      data: {
        installCode,
        siteId: site.siteId,
        publicKey: site.vapidPublicKey,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete site
 */
export const deleteSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    // Only owner can delete site
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      throw new AppError('Site not found', 404);
    }

    if (site.ownerId !== req.user.id) {
      throw new AppError('Only site owner can delete the site', 403);
    }

    await prisma.site.delete({
      where: { id: siteId },
    });

    res.json({
      success: true,
      message: 'Site deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
