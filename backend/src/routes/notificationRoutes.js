import express from 'express';
import {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  sendNotification,
  cancelNotification,
  deleteNotification,
  getNotificationPerformance,
} from '../controllers/notificationController.js';
import { authenticate, checkSiteAccess, requireSiteAdmin } from '../middleware/auth.js';
import { validateCreateNotification, validateUpdateNotification, validatePagination } from '../middleware/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Notification CRUD
router.post('/sites/:siteId/notifications', checkSiteAccess, requireSiteAdmin, validateCreateNotification, createNotification);
router.get('/sites/:siteId/notifications', checkSiteAccess, validatePagination, getNotifications);
router.get('/notifications/:notificationId', getNotification);
router.patch('/notifications/:notificationId', requireSiteAdmin, validateUpdateNotification, updateNotification);
router.delete('/notifications/:notificationId', requireSiteAdmin, deleteNotification);

// Notification actions
router.post('/notifications/:notificationId/send', requireSiteAdmin, sendNotification);
router.post('/notifications/:notificationId/cancel', requireSiteAdmin, cancelNotification);

// Analytics
router.get('/notifications/:notificationId/performance', getNotificationPerformance);

export default router;
