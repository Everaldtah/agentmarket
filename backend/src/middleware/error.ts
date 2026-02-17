import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../types';
import { sendError } from '../utils';

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendError(res, error);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new AppError(
    ErrorCode.NOT_FOUND,
    `Route ${req.method} ${req.path} not found`,
    404
  );
  next(error);
}

/**
 * Async handler wrapper to catch errors in async routes
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default errorHandler;
