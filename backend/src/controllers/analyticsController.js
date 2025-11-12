import prisma from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Get dashboard metrics for a site
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    const { siteId } = req.params;

    // Get site with settings for value goals
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: {
        id: true,
        settings: true,
      },
    });

    if (!site) {
      return res.status(404).json({
        success: false,
        error: { message: 'Site not found' },
      });
    }

    // Get total subscribers count
    const totalSubscribers = await prisma.subscriber.count({
      where: {
        siteId,
        isActive: true,
      },
    });

    // Get total notifications sent
    const notificationsSent = await prisma.notification.count({
      where: {
        siteId,
        status: 'COMPLETED',
      },
    });

    // Get total clicks from delivery logs
    const totalClicks = await prisma.deliveryLog.count({
      where: {
        notification: {
          siteId,
        },
        status: 'CLICKED',
      },
    });

    // Calculate click rate
    const totalDelivered = await prisma.deliveryLog.count({
      where: {
        notification: {
          siteId,
        },
        status: {
          in: ['DELIVERED', 'CLICKED'],
        },
      },
    });

    const clickRate = totalDelivered > 0
      ? ((totalClicks / totalDelivered) * 100).toFixed(1)
      : 0;

    // Calculate value generated based on site settings
    const valuePerSubscriber = site.settings?.valuePerSubscriber || 0;
    const valuePerClick = site.settings?.valuePerClick || 0;
    const valueGenerated = (totalSubscribers * valuePerSubscriber) + (totalClicks * valuePerClick);

    // Get recent notifications
    const recentNotifications = await prisma.notification.findMany({
      where: {
        siteId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        title: true,
        message: true,
        sentAt: true,
        deliveryLogs: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 5,
    });

    // Calculate stats for recent notifications
    const recentNotificationsWithStats = recentNotifications.map(notification => {
      const sent = notification.deliveryLogs.length;
      const clicked = notification.deliveryLogs.filter(log => log.status === 'CLICKED').length;
      const clickRate = sent > 0 ? ((clicked / sent) * 100).toFixed(1) : 0;

      return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        sent_at: notification.sentAt,
        sent_count: sent,
        click_rate: clickRate,
      };
    });

    // Get chart data for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayNotifications = await prisma.notification.findMany({
        where: {
          siteId,
          sentAt: {
            gte: date,
            lt: nextDate,
          },
        },
        include: {
          deliveryLogs: true,
        },
      });

      const sent = dayNotifications.reduce((acc, n) => acc + n.deliveryLogs.length, 0);
      const delivered = dayNotifications.reduce((acc, n) =>
        acc + n.deliveryLogs.filter(log =>
          log.status === 'DELIVERED' || log.status === 'CLICKED'
        ).length, 0
      );
      const clicked = dayNotifications.reduce((acc, n) =>
        acc + n.deliveryLogs.filter(log => log.status === 'CLICKED').length, 0
      );

      chartData.push({
        date: date.toISOString().split('T')[0],
        sent,
        delivered,
        clicked,
      });
    }

    return res.json({
      success: true,
      data: {
        totalSubscribers,
        notificationsSent,
        clickRate: parseFloat(clickRate),
        valueGenerated: parseFloat(valueGenerated.toFixed(2)),
        recentNotifications: recentNotificationsWithStats,
        chart: chartData,
      },
    });
  } catch (error) {
    logger.error('Error getting dashboard metrics:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to get dashboard metrics' },
    });
  }
};
