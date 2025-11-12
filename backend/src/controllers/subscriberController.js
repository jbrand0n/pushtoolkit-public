import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Subscribe to push notifications (public endpoint)
 */
export const subscribe = async (req, res, next) => {
  try {
    const { siteId, subscription, browser, os, country, metadata } = req.body;

    // Validate input
    if (!siteId || !subscription || !subscription.endpoint) {
      throw new AppError('Site ID and subscription are required', 400);
    }

    // Verify site exists
    const site = await prisma.site.findUnique({
      where: { siteId },
    });

    if (!site) {
      throw new AppError('Invalid site ID', 404);
    }

    // Extract subscription keys
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys || {};

    if (!p256dh || !auth) {
      throw new AppError('Invalid subscription format', 400);
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { endpoint },
    });

    if (existingSubscriber) {
      // Update last seen
      const updatedSubscriber = await prisma.subscriber.update({
        where: { endpoint },
        data: {
          lastSeenAt: new Date(),
          isActive: true,
        },
      });

      return res.json({
        success: true,
        data: { subscriber: updatedSubscriber },
        message: 'Subscription updated',
      });
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        siteId: site.id,
        endpoint,
        p256dhKey: p256dh,
        authKey: auth,
        browser,
        os,
        country,
        metadata,
        lastSeenAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: { subscriber },
      message: 'Subscribed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all subscribers for a site
 */
export const getSubscribers = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const { page = 1, limit = 50, isActive } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      siteId,
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
    };

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          subscribedAt: 'desc',
        },
      }),
      prisma.subscriber.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        subscribers,
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
 * Get single subscriber
 */
export const getSubscriber = async (req, res, next) => {
  try {
    const { subscriberId } = req.params;

    const subscriber = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
      include: {
        deliveryLogs: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    res.json({
      success: true,
      data: { subscriber },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsubscribe (public endpoint)
 */
export const unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      throw new AppError('Endpoint is required', 400);
    }

    const subscriber = await prisma.subscriber.update({
      where: { endpoint },
      data: {
        isActive: false,
      },
    });

    res.json({
      success: true,
      data: { subscriber },
      message: 'Unsubscribed successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new AppError('Subscriber not found', 404));
    }
    next(error);
  }
};

/**
 * Delete subscriber (admin)
 */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const { subscriberId } = req.params;

    await prisma.subscriber.delete({
      where: { id: subscriberId },
    });

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new AppError('Subscriber not found', 404));
    }
    next(error);
  }
};

/**
 * Update subscriber tags
 */
export const updateSubscriberTags = async (req, res, next) => {
  try {
    const { subscriberId } = req.params;
    const { tags } = req.body;

    const subscriber = await prisma.subscriber.update({
      where: { id: subscriberId },
      data: { tags },
    });

    res.json({
      success: true,
      data: { subscriber },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new AppError('Subscriber not found', 404));
    }
    next(error);
  }
};
