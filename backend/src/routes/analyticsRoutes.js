import express from 'express';
import { getDashboardMetrics } from '../controllers/analyticsController.js';
import { authenticate, checkSiteAccess } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard metrics
router.get('/sites/:siteId/analytics/dashboard', checkSiteAccess, getDashboardMetrics);

export default router;
