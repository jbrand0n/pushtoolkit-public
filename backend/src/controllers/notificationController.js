import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { decrypt } from '../utils/encryption.js';
import { buildSegmentWhereClause, filterSubscribersBySegment } from '../utils/segmentFilter.js';

// Create notification queue
const notificationQueue = new Queue('notification-send', {
  connection: redisConnection,
});

/**
 * Create notification
 */
export const createNotification = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const {
      type = 'ONE_TIME',
      title,
      message,
      iconUrl,
      imageUrl,
      destinationUrl,
      utmParams,
      actionButtons,
      scheduledAt,
      segmentId,
      recurring_schedule,
    } = req.body;

    // Validate input
    if (!title || !message) {
      throw new AppError('Title and message are required', 400);
    }

    // Validate recurring schedule if type is RECURRING
    if (type === 'RECURRING' && !recurring_schedule) {
      throw new AppError('Recurring schedule is required for recurring notifications', 400);
    }

    // Create notification with optional recurring schedule
    const notificationData = {
      siteId,
      type,
      status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
      title,
      message,
      iconUrl,
      imageUrl,
      destinationUrl,
      utmParams,
      actionButtons,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      segmentId,
      createdBy: req.user.id,
    };

    // If recurring, add recurring schedule
    if (type === 'RECURRING' && recurring_schedule) {
      const startDate = new Date(recurring_schedule.start_date);
      notificationData.recurringSchedule = {
        create: {
          intervalType: recurring_schedule.interval_type,
          intervalValue: recurring_schedule.interval_value,
          startDate,
          endDate: recurring_schedule.end_date ? new Date(recurring_schedule.end_date) : null,
          nextRunAt: startDate,
          isActive: true,
        },
      };
    }

    const notification = await prisma.notification.create({
      data: notificationData,
      include: {
        recurringSchedule: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all notifications for site
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const { page = 1, limit = 20, status, type } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      siteId,
      ...(status && { status }),
      ...(type && { type }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          segment: {
            select: {
              id: true,
              name: true,
            },
          },
          recurringSchedule: true,
          _count: {
            select: {
              deliveryLogs: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single notification
 */
export const getNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        segment: true,
        recurringSchedule: true,
        _count: {
          select: {
            deliveryLogs: true,
          },
        },
      },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update notification
 */
export const updateNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const {
      title,
      message,
      iconUrl,
      imageUrl,
      destinationUrl,
      utmParams,
      actionButtons,
      scheduledAt,
      status,
      recurring_schedule,
    } = req.body;

    // Get the notification to check its type
    const existingNotification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: { recurringSchedule: true },
    });

    if (!existingNotification) {
      throw new AppError('Notification not found', 404);
    }

    const updateData = {
      ...(title && { title }),
      ...(message && { message }),
      ...(iconUrl !== undefined && { iconUrl }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(destinationUrl !== undefined && { destinationUrl }),
      ...(utmParams !== undefined && { utmParams }),
      ...(actionButtons !== undefined && { actionButtons }),
      ...(scheduledAt !== undefined && {
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      }),
      ...(status && { status }),
    };

    // Handle recurring schedule updates
    if (existingNotification.type === 'RECURRING' && recurring_schedule) {
      const startDate = new Date(recurring_schedule.start_date);

      if (existingNotification.recurringSchedule) {
        // Update existing schedule
        updateData.recurringSchedule = {
          update: {
            intervalType: recurring_schedule.interval_type,
            intervalValue: recurring_schedule.interval_value,
            startDate,
            endDate: recurring_schedule.end_date ? new Date(recurring_schedule.end_date) : null,
            nextRunAt: startDate,
          },
        };
      } else {
        // Create new schedule if it doesn't exist
        updateData.recurringSchedule = {
          create: {
            intervalType: recurring_schedule.interval_type,
            intervalValue: recurring_schedule.interval_value,
            startDate,
            endDate: recurring_schedule.end_date ? new Date(recurring_schedule.end_date) : null,
            nextRunAt: startDate,
            isActive: true,
          },
        };
      }
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: updateData,
      include: {
        recurringSchedule: true,
      },
    });

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send notification immediately
 */
export const sendNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        site: true,
      },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.status === 'SENDING' || notification.status === 'COMPLETED') {
      throw new AppError('Notification already sent or sending', 400);
    }

    // Update status to sending
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'SENDING',
        sentAt: new Date(),
      },
    });

    // Get subscribers - start with base criteria
    let where = {
      siteId: notification.siteId,
      isActive: true,
    };

    let subscribers;
    let segment = null;

    // If segmented, apply segment filter
    if (notification.segmentId) {
      segment = await prisma.segment.findUnique({
        where: { id: notification.segmentId },
      });

      if (segment && segment.rules) {
        // Try to build database query for simple rules
        const segmentWhere = buildSegmentWhereClause(segment.rules);
        where = { ...where, ...segmentWhere };
      }
    }

    // Fetch all matching subscribers
    subscribers = await prisma.subscriber.findMany({ where });

    // Apply in-memory filtering for complex segment rules
    if (segment && segment.rules) {
      subscribers = filterSubscribersBySegment(subscribers, segment.rules);
    }

    // Decrypt VAPID private key
    const decryptedPrivateKey = decrypt(notification.site.vapidPrivateKey);

    // Queue notification jobs for each subscriber
    const jobs = subscribers.map((subscriber) => ({
      name: 'send-push',
      data: {
        notificationId: notification.id,
        subscriberId: subscriber.id,
        subscription: {
          endpoint: subscriber.endpoint,
          p256dhKey: subscriber.p256dhKey,
          authKey: subscriber.authKey,
        },
        payload: {
          title: notification.title,
          message: notification.message,
          icon: notification.iconUrl,
          image: notification.imageUrl,
          url: notification.destinationUrl,
          data: {
            notificationId: notification.id,
            url: notification.destinationUrl,
          },
        },
        vapidKeys: {
          publicKey: notification.site.vapidPublicKey,
          privateKey: decryptedPrivateKey,
        },
      },
    }));

    await notificationQueue.addBulk(jobs);

    res.json({
      success: true,
      message: `Notification queued for ${subscribers.length} subscribers`,
      data: {
        notification,
        subscribersCount: subscribers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel notification
 */
export const cancelNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'CANCELLED',
      },
    });

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new AppError('Notification not found', 404));
    }
    next(error);
  }
};

/**
 * Get notification performance/analytics
 */
export const getNotificationPerformance = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const [notification, deliveryStats, aggregates] = await Promise.all([
      prisma.notification.findUnique({
        where: { id: notificationId },
      }),
      prisma.deliveryLog.groupBy({
        by: ['status'],
        where: { notificationId },
        _count: true,
      }),
      prisma.analyticsAggregate.findMany({
        where: { notificationId },
        orderBy: { date: 'asc' },
      }),
    ]);

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    // Format delivery stats
    const stats = deliveryStats.reduce(
      (acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count;
        return acc;
      },
      { sent: 0, delivered: 0, clicked: 0, dismissed: 0, failed: 0 }
    );

    // Calculate totals
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    const clickRate = stats.sent > 0 ? (stats.clicked / stats.sent) * 100 : 0;
    const deliveryRate = stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0;

    res.json({
      success: true,
      data: {
        notification,
        stats,
        metrics: {
          total,
          clickRate: clickRate.toFixed(2),
          deliveryRate: deliveryRate.toFixed(2),
        },
        aggregates,
      },
    });
  } catch (error) {
    next(error);
  }
};
