import { query } from '../database';

export interface ActivityLogInput {
  user_id?: string | null;
  action: string;
  details?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
}

export class ActivityRepository {
  async log(data: ActivityLogInput): Promise<void> {
    const sql = `
      INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await query(sql, [
      data.user_id || null,
      data.action,
      data.details || null,
      data.ip_address || null,
      data.user_agent || null
    ]);
  }

  async getRecent(limit = 10): Promise<any[]> {
    const sql = `
      SELECT al.*, u.first_name, u.last_name, u.email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  }
}

export const activityRepository = new ActivityRepository();
export default activityRepository;
