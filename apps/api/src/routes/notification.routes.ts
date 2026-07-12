import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Notifications endpoints require authentication
router.get('/', requireAuth, notificationController.getNotifications);
router.post('/', requireAuth, notificationController.createNotification);
router.patch('/read-all', requireAuth, notificationController.markAllAsRead);
router.patch('/:id/read', requireAuth, notificationController.markAsRead);
router.delete('/:id', requireAuth, notificationController.deleteNotification);

export default router;
