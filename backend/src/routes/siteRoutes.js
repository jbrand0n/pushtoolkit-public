import express from 'express';
import {
  createSite,
  getSites,
  getSite,
  updateSite,
  getInstallCode,
  deleteSite,
} from '../controllers/siteController.js';
import { authenticate, checkSiteAccess, requireSiteAdmin } from '../middleware/auth.js';
import { validateCreateSite, validateUpdateSite } from '../middleware/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Site CRUD
router.post('/', validateCreateSite, createSite);
router.get('/', getSites);
router.get('/:siteId', checkSiteAccess, getSite);
router.patch('/:siteId', checkSiteAccess, requireSiteAdmin, validateUpdateSite, updateSite);
router.delete('/:siteId', deleteSite);

// Installation code
router.get('/:siteId/install-code', checkSiteAccess, getInstallCode);

export default router;
