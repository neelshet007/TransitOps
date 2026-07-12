import { BaseService } from './base.service';
import { Notification } from '@transitops/types';
import { notificationRepository } from '../repositories/notification.repository';
import { activityRepository } from '../repositories/activity.repository';
import { withTransaction } from '../database/transaction';
import { query } from '../database';
import { NotFoundError } from '../helpers/errors';

export class NotificationService extends BaseService<Notification> {
  protected repository = notificationRepository;
  protected entityName = 'Notification';

  async sendToUser(
    userId: string,
    title: string,
    message: string,
    type: 'Success' | 'Information' | 'Warning' | 'Critical' = 'Information',
    referenceData?: { action_url?: string; reference_id?: string; reference_type?: string; }
  ): Promise<Notification | null> {
    
    // Check preferences (mock simple check for now, typically would read notification_preferences table)
    const prefsRes = await query(`SELECT alert_types FROM notification_preferences WHERE user_id = $1 LIMIT 1`, [userId]);
    if (prefsRes.rows.length > 0) {
      const allowedTypes = prefsRes.rows[0].alert_types;
      if (allowedTypes && allowedTypes[type] === false) {
        return null; // User disabled this type
      }
    }

    return withTransaction(async (client) => {
      const notification = await notificationRepository.create({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
        action_url: referenceData?.action_url || null,
        reference_id: referenceData?.reference_id || null,
        reference_type: referenceData?.reference_type || null
      });

      await activityRepository.log({
        user_id: userId,
        action: 'NOTIFICATION_GENERATED',
        details: `Generated ${type} notification: ${title}`
      });

      return notification;
    });
  }

  async broadcastToRole(
    roleName: string,
    title: string,
    message: string,
    type: 'Success' | 'Information' | 'Warning' | 'Critical' = 'Information'
  ): Promise<void> {
    const usersRes = await query(`
      SELECT u.id FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.code = $1 AND u.deleted_at IS NULL
    `, [roleName]);

    for (const user of usersRes.rows) {
      await this.sendToUser(user.id, title, message, type);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await notificationRepository.markAllAsRead(userId);
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const updated = await notificationRepository.markAsRead(id, userId);
    if (!updated) {
      throw new NotFoundError(`Notification ${id} not found or you don't have access.`);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
