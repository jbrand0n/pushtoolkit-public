import { verifyToken, extractToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';
import prisma from '../config/database.js';

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user has access to a specific site
 */
export const checkSiteAccess = async (req, res, next) => {
  try {
    const { siteId } = req.params;
    const userId = req.user.id;

    // Check if user owns the site or is a member
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        OR: [
          { ownerId: userId },
          {
            siteUsers: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        siteUsers: {
          where: { userId },
        },
      },
    });

    if (!site) {
      throw new AppError('Access denied to this site', 403);
    }

    // Attach site and user role to request
    req.site = site;
    req.siteRole = site.ownerId === userId ? 'OWNER' : site.siteUsers[0]?.role;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Require admin or owner role for site
 */
export const requireSiteAdmin = (req, res, next) => {
  if (req.siteRole !== 'OWNER' && req.siteRole !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
