import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload } from '@transitops/types';
import { config } from '../config';
import { AuthenticationError, ForbiddenError } from '../helpers/errors';
import { MESSAGES } from '../constants';

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError(MESSAGES.AUTH.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new AuthenticationError(MESSAGES.AUTH.TOKEN_EXPIRED));
    }
    return next(new AuthenticationError(MESSAGES.AUTH.UNAUTHORIZED));
  }
};

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError(MESSAGES.AUTH.UNAUTHORIZED));
    }

    const hasRole = req.user.roles.some((role: string) => allowedRoles.includes(role));

    if (!hasRole) {
      return next(new ForbiddenError(MESSAGES.AUTH.FORBIDDEN));
    }

    next();
  };
};

export const requirePermissions = (allowedPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError(MESSAGES.AUTH.UNAUTHORIZED));
    }

    const hasPermission = allowedPermissions.every((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasPermission) {
      return next(new ForbiddenError(MESSAGES.AUTH.FORBIDDEN));
    }

    next();
  };
};
