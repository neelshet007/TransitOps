import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class NotificationController {
  getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Unauthorized' });
        return;
      }

      const filters: any = { user_id: userId };
      if (req.query.is_read !== undefined) {
        filters.is_read = req.query.is_read === 'true';
      }

      const result = await notificationService.getAll({
        filters,
        pagination: { page, limit }
      });

      res.status(HTTP_STATUS.OK).json(successResponse('Notifications retrieved successfully.', result?.rows, {
        page,
        limit,
        total_records: result?.count || 0,
        total_pages: Math.ceil((result?.count || 0) / limit)
      }));
    } catch (error) {
      next(error);
    }
  };

  createNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user_id, title, message, type, action_url, reference_id, reference_type } = req.body;
      const record = await notificationService.sendToUser(
        user_id || req.user?.userId,
        title,
        message,
        type || 'Information',
        { action_url, reference_id, reference_type }
      );
      res.status(HTTP_STATUS.CREATED).json(successResponse('Notification dispatched successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      await notificationService.markAsRead(req.params.id, userId as string);
      res.status(HTTP_STATUS.OK).json(successResponse('Notification marked as read.'));
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      await notificationService.markAllAsRead(userId as string);
      res.status(HTTP_STATUS.OK).json(successResponse('All notifications marked as read.'));
    } catch (error) {
      next(error);
    }
  };

  deleteNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      // In a real app we'd verify ownership before deleting
      await notificationService.delete(req.params.id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Notification deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();
export default notificationController;
