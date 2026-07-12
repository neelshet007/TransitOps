import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS, MESSAGES } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';
import { userRepository } from '../repositories/user.repository';
import { NotFoundError } from '../helpers/errors';
import { activityRepository } from '../repositories/activity.repository';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export class AuthController {
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set refresh token in secure HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      await activityRepository.log({
        user_id: result.user.id,
        action: 'LOGIN',
        details: `User ${result.user.email} logged in successfully`,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });

      res.status(HTTP_STATUS.OK).json(
        successResponse(MESSAGES.AUTH.SUCCESS_LOGIN, {
          accessToken: result.accessToken,
          user: result.user,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshTokens(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(HTTP_STATUS.OK).json(
        successResponse(MESSAGES.AUTH.SUCCESS_REFRESH, {
          accessToken: result.accessToken,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      let userId: string | null = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, config.JWT_SECRET) as any;
          userId = decoded.userId;
        } catch {}
      }

      if (userId) {
        await activityRepository.log({
          user_id: userId,
          action: 'LOGOUT',
          details: 'User logged out successfully',
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        });
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AUTH.SUCCESS_LOGOUT));
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new NotFoundError('Current user context not found.'));
      }

      const user = await userRepository.findById(req.user.userId);
      if (!user) {
        return next(new NotFoundError('User not found in records.'));
      }

      res.status(HTTP_STATUS.OK).json(
        successResponse('Current user context loaded.', {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_active: user.is_active,
          roles: user.roles,
          permissions: user.permissions,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
export default authController;
