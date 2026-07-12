import { Request, Response, NextFunction } from 'express';
import { AppError } from '../helpers/errors';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../constants';
import { errorResponse } from '@transitops/utils';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`AppError: [${err.statusCode}] ${err.message} - Errors: ${JSON.stringify(err.errors)}`);
    res.status(err.statusCode).json(errorResponse(err.message, err.errors));
    return;
  }

  // Handle Prisma Database Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    logger.error('Database Error: %o', err);
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse('Database operation failed due to a constraint or conflict.')
    );
    return;
  }

  // Unhandled / Unexpected Errors
  logger.error('Unhandled System Error: %o', err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    errorResponse('An unexpected internal server error occurred.')
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn(`404 Not Found - Path: ${req.originalUrl}`);
  res.status(HTTP_STATUS.NOT_FOUND).json(
    errorResponse(`Resource not found at ${req.originalUrl}`)
  );
};
