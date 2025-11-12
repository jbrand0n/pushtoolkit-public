import 'dotenv/config';
import logger from '../config/logger.js';
import createNotificationWorker from './notificationWorker.js';
import createRSSMonitorWorker, { initializeRSSMonitoring } from './rssMonitorWorker.js';

// Start all workers
const startWorkers = async () => {
  try {
    logger.info('Starting workers...');

    // Start notification worker
    const notificationWorker = createNotificationWorker();

    // Start RSS monitor worker
    const rssMonitorWorker = createRSSMonitorWorker();

    // Initialize RSS monitoring scheduler
    await initializeRSSMonitoring();

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down workers...');
      await notificationWorker.close();
      await rssMonitorWorker.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    logger.info('✅ All workers started successfully');
  } catch (error) {
    logger.error('Failed to start workers:', error);
    process.exit(1);
  }
};

startWorkers();
