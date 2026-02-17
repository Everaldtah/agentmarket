import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError, ErrorCode } from '../types';

/**
 * Middleware to validate request body against a Zod schema
 */
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new AppError(
          ErrorCode.VALIDATION_ERROR,
          'Validation failed',
          400,
          error.errors
        );
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Middleware to validate query parameters against a Zod schema
 */
export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new AppError(
          ErrorCode.VALIDATION_ERROR,
          'Query validation failed',
          400,
          error.errors
        );
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Middleware to validate route parameters against a Zod schema
 */
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new AppError(
          ErrorCode.VALIDATION_ERROR,
          'Parameter validation failed',
          400,
          error.errors
        );
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};
