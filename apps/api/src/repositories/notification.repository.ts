import { BaseRepository } from './base.repository';
import { Notification } from '@transitops/types';
import { query } from '../database';

export class NotificationRepository extends BaseRepository<Notification> {
  protected tableName = 'notifications';
  protected columns = [
    'id', 'user_id', 'title', 'message', 'type', 'is_read',
    'action_url', 'reference_id', 'reference_type',
    'created_at', 'updated_at', 'deleted_at'
  ];

  async markAllAsRead(userId: string): Promise<void> {
    const sql = `UPDATE notifications SET is_read = true, updated_at = NOW() WHERE user_id = $1 AND deleted_at IS NULL`;
    await query(sql, [userId]);
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const sql = `UPDATE notifications SET is_read = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`;
    const result = await query(sql, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}

export const notificationRepository = new NotificationRepository();
export default notificationRepository;
