import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import prisma from '../config/database.js';
import logger from '../config/logger.js';
import { sendPushNotification, setVapidDetails } from '../utils/vapid.js';

/**
 * Process notification send jobs
 */
const processNotificationJob = async (job) => {
  const { notificationId, subscriberId, subscription, payload, vapidKeys } = job.data;

  try {
    logger.info(`Processing notification job for subscriber ${subscriberId}`);

    // Set VAPID details for this notification
    setVapidDetails(vapidKeys.publicKey, vapidKeys.privateKey);

    // Send push notification
    await sendPushNotification(subscription, payload);

    // Log successful delivery
    await prisma.deliveryLog.create({
      data: {
        notificationId,
        subscriberId,
        status: 'SENT',
        deliveredAt: new Date(),
      },
    });

    logger.info(`Notification sent successfully to subscriber ${subscriberId}`);

    return { success: true, subscriberId };
  } catch (error) {
    logger.error(`Failed to send notification to subscriber ${subscriberId}:`, error);

    // Log failed delivery
    await prisma.deliveryLog.create({
      data: {
        notificationId,
        subscriberId,
        status: 'FAILED',
        errorMessage: error.message,
      },
    });

    // If subscriber endpoint is invalid (410 Gone), mark as inactive
    if (error.statusCode === 410) {
      await prisma.subscriber.update({
        where: { id: subscriberId },
        data: { isActive: false },
      });
      logger.info(`Subscriber ${subscriberId} marked as inactive (410 Gone)`);
    }

    throw error;
  }
};

/**
 * Create and start notification worker
 */
export const createNotificationWorker = () => {
  const worker = new Worker('notification-send', processNotificationJob, {
    connection: redisConnection,
    concurrency: 10, // Process 10 notifications concurrently
    limiter: {
      max: 100, // Max 100 jobs
      duration: 1000, // Per second
    },
  });

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err);
  });

  worker.on('error', (err) => {
    logger.error('Worker error:', err);
  });

  logger.info('✅ Notification worker started');

  return worker;
};

export default createNotificationWorker;
