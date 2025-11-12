import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Upload image
router.post(
  '/upload/image',
  upload.single('image'),
  handleUploadError,
  uploadController.uploadImage
);

export default router;
