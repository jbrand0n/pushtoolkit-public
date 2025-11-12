import express from 'express';
import {
  createSegment,
  getSegments,
  getSegment,
  updateSegment,
  deleteSegment,
  estimateSegment,
} from '../controllers/segmentController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCreateSegment } from '../middleware/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Segment routes nested under sites
router.post('/sites/:siteId/segments', validateCreateSegment, createSegment);
router.get('/sites/:siteId/segments', getSegments);

// Individual segment routes
router.get('/segments/:segmentId', getSegment);
router.patch('/segments/:segmentId', validateCreateSegment, updateSegment);
router.delete('/segments/:segmentId', deleteSegment);
router.post('/segments/:segmentId/estimate', estimateSegment);

export default router;
