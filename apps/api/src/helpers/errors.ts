import { HTTP_STATUS, ERROR_CODES } from '../constants';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly errors: string[];

  constructor(statusCode: number, errorCode: string, message: string, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors: string[] = []) {
    super(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, message, errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict occurred') {
    super(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, message);
  }
}
