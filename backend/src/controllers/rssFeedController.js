import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';

/**
 * Create new RSS feed
 */
export const createFeed = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const {
      name,
      url,
      iconUrl,
      utmParams,
      showActionButtons,
      createDraft,
      maxPushesPerDay,
      segmentId,
    } = req.body;

    // Validate input
    if (!name || !url) {
      throw new AppError('Feed name and URL are required', 400);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new AppError('Invalid RSS feed URL format', 400);
    }

    // Verify user has access to this site
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
    });

    if (!site) {
      throw new AppError('Site not found or access denied', 404);
    }

    // If segment is specified, verify it exists and belongs to this site
    if (segmentId) {
      const segment = await prisma.segment.findFirst({
        where: {
          id: segmentId,
          siteId,
        },
      });

      if (!segment) {
        throw new AppError('Segment not found', 404);
      }
    }

    // Create RSS feed
    const feed = await prisma.rssFeed.create({
      data: {
        siteId,
        name,
        url,
        iconUrl,
        utmParams,
        showActionButtons: showActionButtons || false,
        createDraft: createDraft || false,
        maxPushesPerDay,
        segmentId,
      },
      include: {
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info(`RSS feed created: ${feed.id} for site ${siteId}`);

    res.status(201).json({
      success: true,
      data: { feed },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all RSS feeds for a site
 */
export const getFeeds = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    // Verify user has access to this site
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
    });

    if (!site) {
      throw new AppError('Site not found or access denied', 404);
    }

    // Get all RSS feeds for this site
    const feeds = await prisma.rssFeed.findMany({
      where: {
        siteId,
      },
      include: {
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: { feeds },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single RSS feed
 */
export const getFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;

    const feed = await prisma.rssFeed.findUnique({
      where: {
        id: feedId,
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            siteUsers: {
              select: {
                userId: true,
              },
            },
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

    if (!feed) {
      throw new AppError('RSS feed not found', 404);
    }

    // Verify user has access to this feed's site
    const hasAccess =
      feed.site.ownerId === req.user.id ||
      feed.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      success: true,
      data: { feed },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update RSS feed
 */
export const updateFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const {
      name,
      url,
      iconUrl,
      utmParams,
      showActionButtons,
      createDraft,
      maxPushesPerDay,
      segmentId,
      is_active,
    } = req.body;

    // Get existing feed and verify access
    const existingFeed = await prisma.rssFeed.findUnique({
      where: {
        id: feedId,
      },
      include: {
        site: {
          select: {
            id: true,
            ownerId: true,
            siteUsers: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!existingFeed) {
      throw new AppError('RSS feed not found', 404);
    }

    // Verify user has access
    const hasAccess =
      existingFeed.site.ownerId === req.user.id ||
      existingFeed.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        throw new AppError('Invalid RSS feed URL format', 400);
      }
    }

    // If segment is specified, verify it exists and belongs to this site
    if (segmentId) {
      const segment = await prisma.segment.findFirst({
        where: {
          id: segmentId,
          siteId: existingFeed.site.id,
        },
      });

      if (!segment) {
        throw new AppError('Segment not found', 404);
      }
    }

    // Update feed
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (utmParams !== undefined) updateData.utmParams = utmParams;
    if (showActionButtons !== undefined) updateData.showActionButtons = showActionButtons;
    if (createDraft !== undefined) updateData.createDraft = createDraft;
    if (maxPushesPerDay !== undefined) updateData.maxPushesPerDay = maxPushesPerDay;
    if (segmentId !== undefined) updateData.segmentId = segmentId;
    if (is_active !== undefined) updateData.isActive = is_active;

    const feed = await prisma.rssFeed.update({
      where: {
        id: feedId,
      },
      data: updateData,
      include: {
        segment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info(`RSS feed updated: ${feedId}`);

    res.json({
      success: true,
      data: { feed },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete RSS feed
 */
export const deleteFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;

    // Get existing feed and verify access
    const existingFeed = await prisma.rssFeed.findUnique({
      where: {
        id: feedId,
      },
      include: {
        site: {
          select: {
            id: true,
            ownerId: true,
            siteUsers: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!existingFeed) {
      throw new AppError('RSS feed not found', 404);
    }

    // Verify user has access
    const hasAccess =
      existingFeed.site.ownerId === req.user.id ||
      existingFeed.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    // Delete feed
    await prisma.rssFeed.delete({
      where: {
        id: feedId,
      },
    });

    logger.info(`RSS feed deleted: ${feedId}`);

    res.json({
      success: true,
      data: { message: 'RSS feed deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Test RSS feed by fetching and parsing it
 */
export const testFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;

    // Get feed and verify access
    const feed = await prisma.rssFeed.findUnique({
      where: {
        id: feedId,
      },
      include: {
        site: {
          select: {
            id: true,
            ownerId: true,
            siteUsers: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!feed) {
      throw new AppError('RSS feed not found', 404);
    }

    // Verify user has access
    const hasAccess =
      feed.site.ownerId === req.user.id ||
      feed.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    // Import RSS parser service (will create this next)
    const { parseFeed } = await import('../services/rssParser.js');

    // Try to fetch and parse the feed
    const parsedFeed = await parseFeed(feed.url);

    res.json({
      success: true,
      data: {
        message: 'RSS feed is valid',
        feedInfo: {
          title: parsedFeed.title,
          description: parsedFeed.description,
          itemCount: parsedFeed.items.length,
          latestItems: parsedFeed.items.slice(0, 3),
        },
      },
    });
  } catch (error) {
    logger.error(`RSS feed test failed: ${error.message}`);
    next(new AppError(`Failed to fetch or parse RSS feed: ${error.message}`, 400));
  }
};
