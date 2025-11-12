import prisma from '../config/database.js';
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import logger from '../config/logger.js';

// Create notification queue
const notificationQueue = new Queue('notification-send', {
  connection: redisConnection,
});

/**
 * Queue notification to be sent to subscribers
 * @param {string} notificationId - ID of the notification to send
 */
export const queueNotificationSend = async (notificationId) => {
  try {
    logger.info(`Queueing notification ${notificationId} for sending`);

    // Get notification with site details
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        site: true,
        segment: true,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    // Update status to sending
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'SENDING',
        sentAt: new Date(),
      },
    });

    // Get subscribers
    const where = {
      siteId: notification.siteId,
      isActive: true,
    };

    // If segmented, apply segment filter
    if (notification.segmentId && notification.segment) {
      // TODO: Apply segment rules to filter subscribers
      // For now, we'll just get all active subscribers
    }

    const subscribers = await prisma.subscriber.findMany({ where });

    if (subscribers.length === 0) {
      logger.warn(`No subscribers found for notification ${notificationId}`);

      // Update status to completed if no subscribers
      await prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'COMPLETED' },
      });

      return { subscribersCount: 0 };
    }

    // Queue notification jobs for each subscriber
    const jobs = subscribers.map((subscriber) => ({
      name: 'send-push',
      data: {
        notificationId: notification.id,
        subscriberId: subscriber.id,
        subscription: {
          endpoint: subscriber.endpoint,
          keys: {
            p256dh: subscriber.p256dhKey,
            auth: subscriber.authKey,
          },
        },
        payload: {
          title: notification.title,
          body: notification.message,
          icon: notification.iconUrl,
          image: notification.imageUrl,
          data: {
            notificationId: notification.id,
            url: notification.destinationUrl,
            actionButtons: notification.actionButtons,
          },
        },
        vapidKeys: {
          publicKey: notification.site.vapidPublicKey,
          privateKey: notification.site.vapidPrivateKey,
        },
      },
    }));

    await notificationQueue.addBulk(jobs);

    logger.info(`Queued notification ${notificationId} for ${subscribers.length} subscribers`);

    return {
      subscribersCount: subscribers.length,
    };
  } catch (error) {
    logger.error(`Failed to queue notification ${notificationId}:`, error);
    throw error;
  }
};
