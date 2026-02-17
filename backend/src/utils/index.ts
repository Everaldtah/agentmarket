import { Response } from 'express';
import { ApiResponse, ErrorCode, AppError } from '../types';

/**
 * Send a standardized API response
 */
export function sendResponse<T>(
  res: Response,
  statusCode: number,
  data?: T,
  meta?: Record<string, unknown>
): void {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    data,
    meta,
  };
  
  res.status(statusCode).json(response);
}

/**
 * Send an error response
 */
export function sendError(
  res: Response,
  error: AppError | Error
): void {
  let statusCode = 500;
  let errorCode = ErrorCode.INTERNAL_ERROR;
  let message = 'An unexpected error occurred';
  let details: unknown = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorCode = error.code;
    message = error.message;
    details = error.details;
  } else {
    message = error.message;
  }

  const response: ApiResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      details,
    },
  };

  res.status(statusCode).json(response);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  const { v4: uuidv4 } = require('uuid');
  return uuidv4();
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number
): { page: number; limit: number; total: number; totalPages: number } {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Sanitize user input by removing sensitive fields
 */
export function sanitizeUser(user: any): Partial<typeof user> {
  const { email, ...safeUser } = user;
  return safeUser;
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse and validate numeric query parameters
 */
export function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Delay utility for testing
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Logger utility
 */
export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  },
};
