import { ConflictError, ValidationError, AppError } from './errors';
import { HTTP_STATUS, ERROR_CODES } from '../constants';

/**
 * Maps PostgreSQL specific errors to structured HTTP exceptions.
 */
export function handleDatabaseError(error: any): never {
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as { code: string; message: string; detail?: string; table?: string };

    switch (pgError.code) {
      case '23505': { // Unique violation
        const detail = pgError.detail || '';
        const match = detail.match(/\((.*?)\)=\((.*?)\)/);
        const fieldMsg = match ? `Field '${match[1]}' value '${match[2]}' is already in use.` : 'A duplicate entry exists.';
        throw new ConflictError(fieldMsg);
      }
      case '23503': { // Foreign key violation
        const detail = pgError.detail || '';
        throw new ValidationError(`Referenced entity validation failed: ${detail}`);
      }
      case '23502': { // Not null violation
        throw new ValidationError(`Required field missing error: ${pgError.message}`);
      }
      case '22P02': { // Invalid input syntax for type
        throw new ValidationError(`Invalid data syntax type entered: ${pgError.message}`);
      }
    }
  }

  // Fallback to internal error
  if (error instanceof AppError) {
    throw error;
  }
  throw new AppError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.INTERNAL_ERROR,
    error.message || 'An unexpected database error occurred.'
  );
}
