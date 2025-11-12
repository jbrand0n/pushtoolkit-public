import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
} from '../middleware/validators.js';

const router = express.Router();

// Public routes (with rate limiting and validation)
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);
router.post('/verify-email', validateVerifyEmail, verifyEmail);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/resend-verification', authenticate, resendVerification);

export default router;
