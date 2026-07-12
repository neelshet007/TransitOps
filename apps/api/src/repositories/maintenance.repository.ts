import { BaseRepository } from './base.repository';
import { Maintenance } from '@transitops/types';
import { query } from '../database';

export class MaintenanceRepository extends BaseRepository<Maintenance> {
  protected tableName = 'maintenance';
  protected columns = [
    'id', 'vehicle_id', 'maintenance_type_id', 'scheduled_date', 'completed_date',
    'status', 'cost', 'notes', 'category', 'next_service_date', 'odometer',
    'maintenance_interval', 'technician_name', 'vendor_name', 'labour_cost', 'parts_cost',
    'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by'
  ];

  async logHistory(
    maintenanceId: string,
    oldStatus: string,
    newStatus: string,
    notes: string | null,
    changedBy?: string
  ): Promise<void> {
    const sql = `
      INSERT INTO maintenance_history (maintenance_id, old_status, new_status, notes, changed_by)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await query(sql, [maintenanceId, oldStatus, newStatus, notes || null, changedBy || null]);
  }

  async getCalendarEvents(): Promise<any[]> {
    const sql = `
      SELECT 
        m.id, 
        m.scheduled_date as start,
        m.completed_date as end,
        m.status,
        m.category,
        v.plate_number,
        mt.name as type_name
      FROM maintenance m
      JOIN vehicles v ON m.vehicle_id = v.id
      JOIN maintenance_types mt ON m.maintenance_type_id = mt.id
      WHERE m.deleted_at IS NULL
    `;
    const result = await query(sql);
    return result.rows;
  }

  async getDashboardStats(): Promise<any> {
    const sql = `
      SELECT
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_count,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
        COUNT(CASE WHEN scheduled_date < CURRENT_DATE AND status IN ('scheduled', 'in_progress') THEN 1 END) as overdue_count,
        COALESCE(SUM(cost), 0) as total_cost,
        COALESCE(SUM(labour_cost), 0) as total_labour_cost,
        COALESCE(SUM(parts_cost), 0) as total_parts_cost
      FROM maintenance
      WHERE deleted_at IS NULL;
    `;
    const result = await query(sql);
    const s = result.rows[0];
    return {
      total_records: parseInt(s.total_records, 10),
      scheduled: parseInt(s.scheduled_count, 10),
      in_progress: parseInt(s.in_progress_count, 10),
      completed: parseInt(s.completed_count, 10),
      cancelled: parseInt(s.cancelled_count, 10),
      overdue: parseInt(s.overdue_count, 10),
      total_cost: parseFloat(s.total_cost),
      labour_cost: parseFloat(s.total_labour_cost),
      parts_cost: parseFloat(s.total_parts_cost)
    };
  }
}

export const maintenanceRepository = new MaintenanceRepository();
export default maintenanceRepository;
