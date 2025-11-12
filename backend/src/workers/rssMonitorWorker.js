import { Queue, QueueScheduler, Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import prisma from '../config/database.js';
import logger from '../config/logger.js';
import { getNewItems } from '../services/rssParser.js';

// Create queue for RSS monitoring
export const rssMonitorQueue = new Queue('rss-monitor', {
  connection: redisConnection,
});

// Create scheduler for recurring jobs
export const rssScheduler = new QueueScheduler('rss-monitor', {
  connection: redisConnection,
});

/**
 * Process RSS feed monitoring
 */
export const processRSSMonitor = async () => {
  try {
    logger.info('Starting RSS feed monitoring...');

    // Get all active RSS feeds
    const feeds = await prisma.rssFeed.findMany({
      where: {
        isActive: true,
      },
      include: {
        site: {
          select: {
            id: true,
            vapidPublicKey: true,
            vapidPrivateKey: true,
          },
        },
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info(`Found ${feeds.length} active RSS feeds to monitor`);

    // Process each feed
    for (const feed of feeds) {
      try {
        await processFeed(feed);
      } catch (error) {
        logger.error(`Error processing RSS feed ${feed.id}:`, error);
      }
    }

    logger.info('RSS feed monitoring completed');
  } catch (error) {
    logger.error('RSS monitoring failed:', error);
    throw error;
  }
};

/**
 * Process individual RSS feed
 */
const processFeed = async (feed) => {
  try {
    logger.info(`Checking RSS feed: ${feed.name} (${feed.url})`);

    // Get new items since last check
    const newItems = await getNewItems(feed.url, feed.lastItemGuid);

    if (newItems.length === 0) {
      logger.info(`No new items for feed: ${feed.name}`);

      // Update last fetched time
      await prisma.rssFeed.update({
        where: { id: feed.id },
        data: { lastFetchedAt: new Date() },
      });

      return;
    }

    logger.info(`Found ${newItems.length} new items for feed: ${feed.name}`);

    // Check max pushes per day limit
    if (feed.maxPushesPerDay) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const notificationsSentToday = await prisma.notification.count({
        where: {
          siteId: feed.siteId,
          type: 'RSS',
          createdAt: {
            gte: today,
          },
        },
      });

      const remainingPushes = feed.maxPushesPerDay - notificationsSentToday;

      if (remainingPushes <= 0) {
        logger.info(`Max pushes per day reached for feed: ${feed.name}`);
        return;
      }

      // Limit new items to remaining pushes
      newItems.splice(remainingPushes);
      logger.info(`Limited to ${newItems.length} items due to daily limit`);
    }

    // Create notifications for new items
    for (const item of newItems) {
      await createNotificationFromItem(feed, item);
    }

    // Update last item GUID and last fetched time
    await prisma.rssFeed.update({
      where: { id: feed.id },
      data: {
        lastItemGuid: newItems[0].guid,
        lastFetchedAt: new Date(),
      },
    });

    logger.info(`Successfully processed ${newItems.length} items for feed: ${feed.name}`);
  } catch (error) {
    logger.error(`Failed to process feed ${feed.name}:`, error);
    throw error;
  }
};

/**
 * Create notification from RSS feed item
 */
const createNotificationFromItem = async (feed, item) => {
  try {
    // Build destination URL with UTM parameters
    let destinationUrl = item.link;

    if (feed.utmParams && Object.keys(feed.utmParams).length > 0) {
      const url = new URL(destinationUrl);
      Object.entries(feed.utmParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
      destinationUrl = url.toString();
    }

    // Prepare action buttons if enabled
    let actionButtons = null;
    if (feed.showActionButtons) {
      actionButtons = [
        {
          action: 'view',
          title: 'Read More',
        },
      ];
    }

    // Determine notification status
    const status = feed.createDraft ? 'DRAFT' : 'SCHEDULED';

    // Get the first user associated with the site (for createdBy)
    const site = await prisma.site.findUnique({
      where: { id: feed.siteId },
      select: { ownerId: true },
    });

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        siteId: feed.siteId,
        type: 'RSS',
        status,
        title: item.title,
        message: item.description.substring(0, 500), // Limit to 500 chars
        iconUrl: feed.iconUrl || item.image,
        imageUrl: item.image,
        destinationUrl,
        utmParams: feed.utmParams,
        actionButtons,
        segmentId: feed.segmentId,
        createdBy: site.ownerId,
        scheduledAt: new Date(),
      },
    });

    logger.info(`Created notification ${notification.id} for RSS item: ${item.title}`);

    // If not draft, trigger sending
    if (!feed.createDraft) {
      // Import notification service to send
      const { queueNotificationSend } = await import('../services/notificationService.js');
      await queueNotificationSend(notification.id);

      logger.info(`Queued notification ${notification.id} for sending`);
    }

    return notification;
  } catch (error) {
    logger.error(`Failed to create notification for RSS item:`, error);
    throw error;
  }
};

/**
 * Create RSS monitor worker
 */
export const createRSSMonitorWorker = () => {
  const worker = new Worker('rss-monitor', processRSSMonitor, {
    connection: redisConnection,
    concurrency: 1, // Process one monitoring job at a time
  });

  worker.on('completed', (job) => {
    logger.info(`RSS monitoring job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`RSS monitoring job ${job?.id} failed:`, err);
  });

  worker.on('error', (err) => {
    logger.error('RSS monitoring worker error:', err);
  });

  logger.info('✅ RSS monitor worker started');

  return worker;
};

/**
 * Initialize RSS monitoring scheduler
 * Runs every 15 minutes
 */
export const initializeRSSMonitoring = async () => {
  try {
    logger.info('Initializing RSS monitoring scheduler...');

    // Remove existing repeatable jobs
    const repeatableJobs = await rssMonitorQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await rssMonitorQueue.removeRepeatableByKey(job.key);
    }

    // Add repeatable job - every 15 minutes
    await rssMonitorQueue.add(
      'monitor-feeds',
      {},
      {
        repeat: {
          pattern: '*/15 * * * *', // Every 15 minutes
        },
        removeOnComplete: 10, // Keep last 10 completed jobs
        removeOnFail: 20, // Keep last 20 failed jobs
      }
    );

    // Also run immediately on startup
    await rssMonitorQueue.add('monitor-feeds', {});

    logger.info('✅ RSS monitoring scheduler initialized (runs every 15 minutes)');
  } catch (error) {
    logger.error('Failed to initialize RSS monitoring:', error);
    throw error;
  }
};

export default createRSSMonitorWorker;
