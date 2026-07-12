import { Request, Response, NextFunction } from 'express';
import { dashboardRepository } from '../repositories/dashboard.repository';
import { activityRepository } from '../repositories/activity.repository';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class DashboardController {
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await dashboardRepository.getStats();
      res.status(HTTP_STATUS.OK).json(successResponse('Dashboard statistics retrieved successfully.', stats));
    } catch (error) {
      next(error);
    }
  };

  logActivity = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { action, details } = req.body;
      await activityRepository.log({
        user_id: userId,
        action: action || 'MANUAL_ACTION',
        details: details || 'Manual action recorded',
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
      res.status(HTTP_STATUS.CREATED).json(successResponse('Activity logged successfully.'));
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();
export default dashboardController;
