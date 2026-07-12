import { BaseRepository } from './base.repository';
import { Trip } from '@transitops/types';
import { query } from '../database';

export class TripRepository extends BaseRepository<Trip> {
  protected tableName = 'trips';
  protected columns = [
    'id', 'vehicle_id', 'driver_id', 'start_time', 'end_time', 'status',
    'origin', 'destination', 'start_odometer', 'end_odometer',
    'distance', 'estimated_time', 'actual_start', 'actual_end', 'cargo', 'customer', 'notes',
    'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by'
  ];

  async logTripStatusChange(
    tripId: string,
    oldStatus: string,
    newStatus: string,
    reason: string | null,
    changedBy?: string
  ): Promise<void> {
    const sql = `
      INSERT INTO trip_status_history (trip_id, old_status, new_status, reason, changed_by)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await query(sql, [tripId, oldStatus, newStatus, reason, changedBy || null]);
  }

  async logTripAction(tripId: string, logType: string, message: string): Promise<void> {
    const sql = `
      INSERT INTO trip_logs (trip_id, log_type, message)
      VALUES ($1, $2, $3)
    `;
    await query(sql, [tripId, logType, message]);
  }

  async logTripAssignment(tripId: string, vehicleId: string, driverId: string): Promise<void> {
    const sql = `
      INSERT INTO trip_assignments (trip_id, vehicle_id, driver_id)
      VALUES ($1, $2, $3)
    `;
    await query(sql, [tripId, vehicleId, driverId]);
  }

  async findTripDetails(id: string): Promise<any | null> {
    const trip = await this.findById(id);
    if (!trip) return null;

    // Fetch assignments
    const assignmentsRes = await query(
      `SELECT id, vehicle_id, driver_id, assigned_at FROM trip_assignments WHERE trip_id = $1 ORDER BY assigned_at DESC`,
      [id]
    );

    // Fetch status history
    const historyRes = await query(
      `SELECT id, old_status, new_status, reason, created_at FROM trip_status_history WHERE trip_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    // Fetch logs
    const logsRes = await query(
      `SELECT id, log_type, message, created_at FROM trip_logs WHERE trip_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    return {
      ...trip,
      assignments: assignmentsRes.rows,
      status_history: historyRes.rows,
      logs: logsRes.rows
    };
  }
}

export const tripRepository = new TripRepository();
export default tripRepository;
