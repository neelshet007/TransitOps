import { BaseRepository } from './base.repository';
import { FuelLog } from '@transitops/types';
import { query } from '../database';

export class FuelRepository extends BaseRepository<FuelLog> {
  protected tableName = 'fuel_logs';
  protected columns = [
    'id', 'vehicle_id', 'driver_id', 'trip_id', 'fuel_station_id',
    'fuel_type', 'quantity', 'price_per_liter', 'total_cost',
    'odometer', 'mileage', 'payment_method', 'notes', 'fuel_date',
    'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by'
  ];

  async getDashboardStats(): Promise<any> {
    const sql = `
      SELECT 
        COALESCE(SUM(total_cost), 0) as total_fuel_cost,
        COALESCE(SUM(quantity), 0) as total_liters,
        COUNT(id) as total_logs
      FROM fuel_logs
      WHERE deleted_at IS NULL;
    `;
    const result = await query(sql);
    return {
      total_fuel_cost: parseFloat(result.rows[0].total_fuel_cost),
      total_liters: parseFloat(result.rows[0].total_liters),
      total_logs: parseInt(result.rows[0].total_logs, 10),
    };
  }

  async getAnalytics(): Promise<any> {
    const trendSql = `
      SELECT 
        DATE_TRUNC('month', fuel_date) as month,
        COALESCE(SUM(total_cost), 0) as amount,
        COALESCE(SUM(quantity), 0) as quantity
      FROM fuel_logs
      WHERE deleted_at IS NULL
      GROUP BY month
      ORDER BY month ASC
      LIMIT 6;
    `;
    const result = await query(trendSql);
    return {
      trends: result.rows,
    };
  }
}

export const fuelRepository = new FuelRepository();
export default fuelRepository;
