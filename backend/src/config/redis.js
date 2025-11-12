import Redis from 'ioredis';
import logger from './logger.js';

// Check if Redis is configured
const isRedisConfigured = process.env.REDIS_HOST && process.env.REDIS_PORT;

let redis = null;
let redisConnection = null;

if (isRedisConfigured) {
  const redisConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  };

  // Create Redis connection for general use
  redis = new Redis(redisConfig);

  // Create separate Redis connection for BullMQ
  redisConnection = new Redis(redisConfig);

  redis.on('connect', () => {
    logger.info('✅ Redis connected');
  });

  redis.on('error', (err) => {
    logger.error('❌ Redis connection error:', err);
  });

  redis.on('close', () => {
    logger.warn('⚠️ Redis connection closed');
  });
} else {
  logger.warn('⚠️ Redis not configured - background jobs disabled');
}

export { redis, redisConnection };
export default redis;
