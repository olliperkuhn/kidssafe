import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    statusCode === 500 && isProduction ? 'Interner Serverfehler' : err.message || 'Interner Serverfehler';

  logger.error(`[Error] ${statusCode} - ${err.message || 'Interner Serverfehler'}`, err.details ?? '');

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(!isProduction ? { stack: err.stack, details: err.details } : {}),
    },
  });
}
