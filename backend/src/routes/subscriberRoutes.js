import express from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  getSubscriber,
  deleteSubscriber,
  updateSubscriberTags,
} from '../controllers/subscriberController.js';
import { authenticate, checkSiteAccess } from '../middleware/auth.js';
import { validateSubscribe, validateUnsubscribe, validatePagination } from '../middleware/validators.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/subscribe', validateSubscribe, subscribe);
router.post('/unsubscribe', validateUnsubscribe, unsubscribe);

// Protected routes (require auth and site access)
router.get('/sites/:siteId/subscribers', authenticate, checkSiteAccess, validatePagination, getSubscribers);
router.get('/subscribers/:subscriberId', authenticate, getSubscriber);
router.delete('/subscribers/:subscriberId', authenticate, deleteSubscriber);
router.patch('/subscribers/:subscriberId/tags', authenticate, updateSubscriberTags);

export default router;
