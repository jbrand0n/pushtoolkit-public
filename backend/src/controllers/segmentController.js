import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create new segment
 */
export const createSegment = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const { name, rules } = req.body;

    // Validate input
    if (!name) {
      throw new AppError('Segment name is required', 400);
    }

    if (!rules || typeof rules !== 'object') {
      throw new AppError('Segment rules are required and must be an object', 400);
    }

    // Verify site exists and user has access
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

    // Estimate segment size based on rules
    const estimatedCount = await estimateSegmentCount(siteId, rules);

    // Create segment
    const segment = await prisma.segment.create({
      data: {
        siteId,
        name,
        rules,
        estimatedCount,
      },
    });

    res.status(201).json({
      success: true,
      data: { segment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all segments for a site
 */
export const getSegments = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    // Verify site access
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

    const segments = await prisma.segment.findMany({
      where: { siteId },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      data: { segments },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single segment
 */
export const getSegment = async (req, res, next) => {
  try {
    const { segmentId } = req.params;

    const segment = await prisma.segment.findUnique({
      where: { id: segmentId },
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
      },
    });

    if (!segment) {
      throw new AppError('Segment not found', 404);
    }

    // Check access
    const hasAccess =
      segment.site.ownerId === req.user.id ||
      segment.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      success: true,
      data: { segment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update segment
 */
export const updateSegment = async (req, res, next) => {
  try {
    const { segmentId } = req.params;
    const { name, rules } = req.body;

    // Get segment with site info for access check
    const existingSegment = await prisma.segment.findUnique({
      where: { id: segmentId },
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

    if (!existingSegment) {
      throw new AppError('Segment not found', 404);
    }

    // Check access
    const hasAccess =
      existingSegment.site.ownerId === req.user.id ||
      existingSegment.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    // Calculate new estimated count if rules changed
    let estimatedCount = existingSegment.estimatedCount;
    if (rules && JSON.stringify(rules) !== JSON.stringify(existingSegment.rules)) {
      estimatedCount = await estimateSegmentCount(existingSegment.site.id, rules);
    }

    // Update segment
    const segment = await prisma.segment.update({
      where: { id: segmentId },
      data: {
        ...(name && { name }),
        ...(rules && { rules, estimatedCount }),
      },
    });

    res.json({
      success: true,
      data: { segment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete segment
 */
export const deleteSegment = async (req, res, next) => {
  try {
    const { segmentId } = req.params;

    // Get segment with site info for access check
    const segment = await prisma.segment.findUnique({
      where: { id: segmentId },
      include: {
        site: {
          select: {
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

    if (!segment) {
      throw new AppError('Segment not found', 404);
    }

    // Check access
    const hasAccess =
      segment.site.ownerId === req.user.id ||
      segment.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    await prisma.segment.delete({
      where: { id: segmentId },
    });

    res.json({
      success: true,
      message: 'Segment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Estimate segment size
 */
export const estimateSegment = async (req, res, next) => {
  try {
    const { segmentId } = req.params;

    const segment = await prisma.segment.findUnique({
      where: { id: segmentId },
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

    if (!segment) {
      throw new AppError('Segment not found', 404);
    }

    // Check access
    const hasAccess =
      segment.site.ownerId === req.user.id ||
      segment.site.siteUsers.some((su) => su.userId === req.user.id);

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    const estimatedCount = await estimateSegmentCount(segment.site.id, segment.rules);

    // Update the segment with new count
    await prisma.segment.update({
      where: { id: segmentId },
      data: { estimatedCount },
    });

    res.json({
      success: true,
      data: { estimatedCount },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to estimate segment size based on rules
 */
async function estimateSegmentCount(siteId, rules) {
  const where = {
    siteId,
    isActive: true,
  };

  // Apply rules to build where clause
  if (rules.browser) {
    where.browser = rules.browser;
  }

  if (rules.os) {
    where.os = rules.os;
  }

  if (rules.country) {
    where.country = rules.country;
  }

  if (rules.subscribed_days_ago) {
    const daysAgo = parseInt(rules.subscribed_days_ago);
    if (!isNaN(daysAgo)) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      where.subscribedAt = {
        lte: date,
      };
    }
  }

  const count = await prisma.subscriber.count({ where });
  return count;
}
