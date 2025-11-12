import { body, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// ============================================================================
// Query Parameter Validators
// ============================================================================

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  handleValidationErrors,
];

// ============================================================================
// Auth Validators
// ============================================================================

export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  handleValidationErrors,
];

export const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  handleValidationErrors,
];

export const validateVerifyEmail = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required'),
  handleValidationErrors,
];

// ============================================================================
// Site Validators
// ============================================================================

export const validateCreateSite = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Site name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Site name must be between 2 and 100 characters'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('Site URL is required')
    .isURL()
    .withMessage('Must be a valid URL'),
  handleValidationErrors,
];

export const validateUpdateSite = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Site name must be between 2 and 100 characters'),
  body('url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Must be a valid URL'),
  handleValidationErrors,
];

// ============================================================================
// Notification Validators
// ============================================================================

export const validateCreateNotification = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Notification title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Notification message is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('type')
    .optional()
    .isIn(['ONE_TIME', 'RECURRING', 'TRIGGERED', 'WELCOME', 'RSS'])
    .withMessage('Invalid notification type'),
  body('iconUrl')
    .optional()
    .isURL()
    .withMessage('Icon URL must be a valid URL'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('destinationUrl')
    .optional()
    .isURL()
    .withMessage('Destination URL must be a valid URL'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
  handleValidationErrors,
];

export const validateUpdateNotification = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'SCHEDULED', 'SENDING', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid notification status'),
  body('iconUrl')
    .optional()
    .isURL()
    .withMessage('Icon URL must be a valid URL'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('destinationUrl')
    .optional()
    .isURL()
    .withMessage('Destination URL must be a valid URL'),
  handleValidationErrors,
];

// ============================================================================
// Subscriber Validators
// ============================================================================

export const validateSubscribe = [
  body('siteId')
    .notEmpty()
    .withMessage('Site ID is required')
    .isUUID()
    .withMessage('Site ID must be a valid UUID'),
  body('subscription')
    .notEmpty()
    .withMessage('Subscription object is required'),
  body('subscription.endpoint')
    .notEmpty()
    .withMessage('Subscription endpoint is required')
    .isURL()
    .withMessage('Subscription endpoint must be a valid URL'),
  body('subscription.keys.p256dh')
    .notEmpty()
    .withMessage('p256dh key is required'),
  body('subscription.keys.auth')
    .notEmpty()
    .withMessage('auth key is required'),
  handleValidationErrors,
];

export const validateUnsubscribe = [
  body('endpoint')
    .notEmpty()
    .withMessage('Subscription endpoint is required')
    .isURL()
    .withMessage('Subscription endpoint must be a valid URL'),
  handleValidationErrors,
];

// ============================================================================
// Segment Validators
// ============================================================================

export const validateCreateSegment = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Segment name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Segment name must be between 2 and 100 characters'),
  body('rules')
    .notEmpty()
    .withMessage('Segment rules are required')
    .isObject()
    .withMessage('Rules must be a valid object'),
  handleValidationErrors,
];

// ============================================================================
// RSS Feed Validators
// ============================================================================

export const validateCreateRssFeed = [
  body('url')
    .notEmpty()
    .withMessage('RSS feed URL is required')
    .isURL()
    .withMessage('Must be a valid URL'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Feed name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Feed name must be between 2 and 100 characters'),
  body('iconUrl')
    .optional()
    .isURL()
    .withMessage('Icon URL must be a valid URL'),
  handleValidationErrors,
];
