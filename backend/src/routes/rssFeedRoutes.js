import express from 'express';
import * as rssFeedController from '../controllers/rssFeedController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCreateRssFeed } from '../middleware/validators.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// RSS Feed Routes
router.post('/sites/:siteId/rss-feeds', validateCreateRssFeed, rssFeedController.createFeed);
router.get('/sites/:siteId/rss-feeds', rssFeedController.getFeeds);
router.get('/rss-feeds/:feedId', rssFeedController.getFeed);
router.patch('/rss-feeds/:feedId', validateCreateRssFeed, rssFeedController.updateFeed);
router.delete('/rss-feeds/:feedId', rssFeedController.deleteFeed);
router.post('/rss-feeds/:feedId/test', rssFeedController.testFeed);

export default router;
