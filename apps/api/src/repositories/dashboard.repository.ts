import { query } from '../database';
import { activityRepository } from './activity.repository';

export class DashboardRepository {
  async getStats(): Promise<any> {
    const statsSql = `
      SELECT
        (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) as total_users,
        (SELECT COUNT(*) FROM roles WHERE deleted_at IS NULL) as total_roles,
        (SELECT COUNT(*) FROM drivers WHERE deleted_at IS NULL) as total_drivers,
        (SELECT COUNT(*) FROM drivers WHERE status = 'active' AND deleted_at IS NULL) as active_drivers,
        (SELECT COUNT(*) FROM drivers WHERE status = 'inactive' AND deleted_at IS NULL) as inactive_drivers,
        (SELECT COUNT(*) FROM drivers WHERE availability = 'available' AND deleted_at IS NULL) as available_drivers,
        (SELECT COUNT(*) FROM drivers WHERE availability = 'driving' AND deleted_at IS NULL) as drivers_on_trip,
        (SELECT COUNT(*) FROM drivers WHERE availability = 'leave' AND deleted_at IS NULL) as drivers_on_leave,
        (SELECT COUNT(*) FROM drivers WHERE license_expiry <= CURRENT_DATE + INTERVAL '30 days' AND deleted_at IS NULL) as expiring_licenses,
        (SELECT COUNT(*) FROM vehicles WHERE deleted_at IS NULL) as total_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'active' AND deleted_at IS NULL) as active_vehicles,
        (SELECT COUNT(*) FROM trips WHERE deleted_at IS NULL) as total_trips,
        (SELECT COUNT(*) FROM trips WHERE status = 'in_progress' AND deleted_at IS NULL) as active_trips,
        (SELECT COUNT(*) FROM trips WHERE DATE(created_at) = CURRENT_DATE AND deleted_at IS NULL) as trips_today,
        (SELECT COUNT(*) FROM trips WHERE status = 'completed' AND deleted_at IS NULL) as completed_trips,
        (SELECT COUNT(*) FROM trips WHERE status = 'delayed' AND deleted_at IS NULL) as delayed_trips,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'maintenance' AND deleted_at IS NULL) as vehicles_under_maintenance,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE expense_date >= DATE_TRUNC('month', CURRENT_DATE) AND deleted_at IS NULL) as monthly_expenses,
        (SELECT COALESCE(SUM(total_cost), 0) FROM fuel_logs WHERE fuel_date >= DATE_TRUNC('month', CURRENT_DATE) AND deleted_at IS NULL) as monthly_fuel_cost,
        (SELECT COUNT(*) FROM notifications WHERE is_read = false AND deleted_at IS NULL) as pending_notifications,
        (SELECT COUNT(*) FROM maintenance WHERE status = 'scheduled' AND deleted_at IS NULL) as upcoming_maintenance
      FROM (SELECT 1) as dummy;
    `;
    const statsResult = await query(statsSql);
    const stats = statsResult.rows[0];

    // parse numeric values
    for (const key in stats) {
      stats[key] = parseInt(stats[key], 10);
    }

    // Fetch recent users
    const recentUsersSql = `
      SELECT id, first_name, last_name, email, created_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 5
    `;
    const recentUsersResult = await query(recentUsersSql);

    // Fetch latest drivers
    const latestDriversSql = `
      SELECT id, first_name, last_name, employee_id, created_at, availability, status
      FROM drivers
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 5
    `;
    const latestDriversResult = await query(latestDriversSql);

    // Fetch recent activities
    const recentActivities = await activityRepository.getRecent(10);

    return {
      ...stats,
      recent_users: recentUsersResult.rows,
      latest_drivers: latestDriversResult.rows,
      recent_activities: recentActivities,
    };
  }
}

export const dashboardRepository = new DashboardRepository();
export default dashboardRepository;
