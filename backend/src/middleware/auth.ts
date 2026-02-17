import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../types';
import store from '../store';

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * Simple authentication middleware
 * In production, this would validate JWT tokens or session cookies
 * For this demo, we use a simple header-based auth: X-User-Id
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // For demo purposes, get user ID from header
  // In production, validate JWT token here
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    const error = new AppError(
      ErrorCode.UNAUTHORIZED,
      'Authentication required',
      401
    );
    return next(error);
  }

  const user = store.getUserById(userId);
  if (!user) {
    const error = new AppError(
      ErrorCode.UNAUTHORIZED,
      'Invalid user',
      401
    );
    return next(error);
  }

  req.user = { id: user.id, role: user.role };
  next();
};

/**
 * Optional authentication - doesn't fail if no auth provided
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;

  if (userId) {
    const user = store.getUserById(userId);
    if (user) {
      req.user = { id: user.id, role: user.role };
    }
  }

  next();
};

/**
 * Authorization middleware - check if user has required role
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error = new AppError(
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        401
      );
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new AppError(
        ErrorCode.FORBIDDEN,
        'Insufficient permissions',
        403
      );
      return next(error);
    }

    next();
  };
};

/**
 * Check if user owns the resource (for agent updates/deletes)
 */
export const checkOwnership = (getResourceOwnerId: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error = new AppError(
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        401
      );
      return next(error);
    }

    const resourceOwnerId = getResourceOwnerId(req);
    
    // Admins can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.id !== resourceOwnerId) {
      const error = new AppError(
        ErrorCode.FORBIDDEN,
        'You do not have permission to access this resource',
        403
      );
      return next(error);
    }

    next();
  };
};
