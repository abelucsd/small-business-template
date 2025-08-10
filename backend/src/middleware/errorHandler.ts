import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';


const errorLogger = logger.child({ service: 'error-handler' });

export interface AppError extends Error {
  status?: number;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorLogger.error(`[${req.method} ${req.url}] ${err.message}\n${err.stack}`);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};