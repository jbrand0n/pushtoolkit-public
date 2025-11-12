import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error(`Database error: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logger.warn(`Database warning: ${e.message}`);
});

// Test connection
prisma.$connect()
  .then(() => logger.info('✅ Database connected'))
  .catch((err) => logger.error('❌ Database connection failed:', err));

export default prisma;
