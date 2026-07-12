import { query } from '../database';

export interface ReportFilter {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
}

export class ReportRepository {
  async getFleetReport(filters: ReportFilter): Promise<any[]> {
    let sql = `
      SELECT 
        v.id, v.plate_number, v.make, v.model, v.year, v.vin, v.status,
        v.fitness_expiry, v.insurance_expiry, v.puc_expiry, v.fuel_level, v.odometer,
        COALESCE(COUNT(t.id), 0) as total_trips,
        COALESCE(SUM(t.distance), 0) as total_distance
      FROM vehicles v
      LEFT JOIN trips t ON t.vehicle_id = v.id AND t.deleted_at IS NULL
      WHERE v.deleted_at IS NULL
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.vehicleId) {
      sql += ` AND v.id = $${paramIndex++}`;
      params.push(filters.vehicleId);
    }
    if (filters.status) {
      sql += ` AND v.status = $${paramIndex++}`;
      params.push(filters.status);
    }
    if (filters.search) {
      sql += ` AND (v.plate_number ILIKE $${paramIndex} OR v.make ILIKE $${paramIndex} OR v.model ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    sql += `
      GROUP BY v.id
      ORDER BY total_distance DESC
    `;

    const result = await query(sql, params);
    return result.rows;
  }

  async getDriverReport(filters: ReportFilter): Promise<any[]> {
    let sql = `
      SELECT 
        d.id, d.license_number, d.license_expiry, d.status, d.availability,
        u.first_name, u.last_name, u.email,
        COALESCE(COUNT(t.id), 0) as total_trips,
        COALESCE(SUM(t.distance), 0) as total_distance
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN trips t ON t.driver_id = d.id AND t.deleted_at IS NULL
      WHERE d.deleted_at IS NULL
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.driverId) {
      sql += ` AND d.id = $${paramIndex++}`;
      params.push(filters.driverId);
    }
    if (filters.status) {
      sql += ` AND d.status = $${paramIndex++}`;
      params.push(filters.status);
    }
    if (filters.search) {
      sql += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR d.license_number ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    sql += `
      GROUP BY d.id, u.id
      ORDER BY total_trips DESC
    `;

    const result = await query(sql, params);
    return result.rows;
  }

  async getTripReport(filters: ReportFilter): Promise<any[]> {
    let sql = `
      SELECT 
        t.id, t.origin, t.destination, t.status, t.start_time, t.end_time,
        t.start_odometer, t.end_odometer, t.distance, t.estimated_time,
        t.actual_start, t.actual_end, t.cargo, t.customer, t.notes,
        v.plate_number, v.make, v.model,
        u.first_name as driver_first_name, u.last_name as driver_last_name
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN drivers d ON t.driver_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE t.deleted_at IS NULL
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.vehicleId) {
      sql += ` AND t.vehicle_id = $${paramIndex++}`;
      params.push(filters.vehicleId);
    }
    if (filters.driverId) {
      sql += ` AND t.driver_id = $${paramIndex++}`;
      params.push(filters.driverId);
    }
    if (filters.status) {
      sql += ` AND t.status = $${paramIndex++}`;
      params.push(filters.status);
    }
    if (filters.startDate) {
      sql += ` AND t.start_time >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      sql += ` AND t.start_time <= $${paramIndex++}`;
      params.push(filters.endDate);
    }
    if (filters.search) {
      sql += ` AND (t.origin ILIKE $${paramIndex} OR t.destination ILIKE $${paramIndex} OR t.customer ILIKE $${paramIndex} OR t.cargo ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY t.start_time DESC`;

    const result = await query(sql, params);
    return result.rows;
  }

  async getFuelReport(filters: ReportFilter): Promise<any[]> {
    let sql = `
      SELECT 
        fl.id, fl.refuel_date, fl.gallons, fl.cost, fl.odometer,
        v.plate_number, v.make, v.model,
        u.first_name as driver_first_name, u.last_name as driver_last_name
      FROM fuel_logs fl
      JOIN vehicles v ON fl.vehicle_id = v.id
      JOIN drivers d ON fl.driver_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE fl.deleted_at IS NULL
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.vehicleId) {
      sql += ` AND fl.vehicle_id = $${paramIndex++}`;
      params.push(filters.vehicleId);
    }
    if (filters.driverId) {
      sql += ` AND fl.driver_id = $${paramIndex++}`;
      params.push(filters.driverId);
    }
    if (filters.startDate) {
      sql += ` AND fl.refuel_date >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      sql += ` AND fl.refuel_date <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    sql += ` ORDER BY fl.refuel_date DESC`;

    const result = await query(sql, params);
    return result.rows;
  }

  async getMaintenanceReport(filters: ReportFilter): Promise<any[]> {
    let sql = `
      SELECT 
        m.id, m.scheduled_date, m.completed_date, m.status, m.cost, m.notes,
        mt.name as type_name,
        v.plate_number, v.make, v.model
      FROM maintenance m
      JOIN maintenance_types mt ON m.maintenance_type_id = mt.id
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.deleted_at IS NULL
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.vehicleId) {
      sql += ` AND m.vehicle_id = $${paramIndex++}`;
      params.push(filters.vehicleId);
    }
    if (filters.status) {
      sql += ` AND m.status = $${paramIndex++}`;
      params.push(filters.status);
    }
    if (filters.startDate) {
      sql += ` AND m.scheduled_date >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      sql += ` AND m.scheduled_date <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    sql += ` ORDER BY m.scheduled_date DESC`;

    const result = await query(sql, params);
    return result.rows;
  }

  async getExpenseReport(filters: ReportFilter): Promise<any[]> {
    let sql = `
      SELECT 
        e.id, e.amount, e.expense_date, e.notes,
        ec.name as category_name,
        v.plate_number, v.make, v.model,
        t.origin, t.destination
      FROM expenses e
      JOIN expense_categories ec ON e.expense_category_id = ec.id
      LEFT JOIN vehicles v ON e.vehicle_id = v.id
      LEFT JOIN trips t ON e.trip_id = t.id
      WHERE e.deleted_at IS NULL
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.vehicleId) {
      sql += ` AND e.vehicle_id = $${paramIndex++}`;
      params.push(filters.vehicleId);
    }
    if (filters.startDate) {
      sql += ` AND e.expense_date >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      sql += ` AND e.expense_date <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    sql += ` ORDER BY e.expense_date DESC`;

    const result = await query(sql, params);
    return result.rows;
  }

  async getDashboardAnalytics(): Promise<any> {
    const statsSql = `
      SELECT
        -- Fleet Availability Metrics
        (SELECT COUNT(*) FROM vehicles WHERE deleted_at IS NULL) as total_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'available' AND deleted_at IS NULL) as available_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'on_trip' AND deleted_at IS NULL) as active_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'maintenance' AND deleted_at IS NULL) as maintenance_vehicles,

        -- Driver Availability Metrics
        (SELECT COUNT(*) FROM drivers WHERE deleted_at IS NULL) as total_drivers,
        (SELECT COUNT(*) FROM drivers WHERE availability = 'available' AND deleted_at IS NULL) as available_drivers,

        -- Trip metrics
        (SELECT COUNT(*) FROM trips WHERE status = 'completed' AND deleted_at IS NULL) as trips_completed,
        (SELECT COUNT(*) FROM trips WHERE status = 'delayed' AND deleted_at IS NULL) as trips_delayed,
        (SELECT COALESCE(SUM(distance), 0) FROM trips WHERE deleted_at IS NULL) as total_distance,
        (SELECT COALESCE(AVG(distance), 0) FROM trips WHERE deleted_at IS NULL) as avg_trip_distance,

        -- Financial operations aggregates
        (SELECT COALESCE(SUM(cost), 0) FROM maintenance WHERE deleted_at IS NULL) as total_maintenance_cost,
        (SELECT COALESCE(SUM(cost), 0) FROM fuel_logs WHERE deleted_at IS NULL) as total_fuel_cost,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE deleted_at IS NULL) as total_other_expenses,
        (SELECT COALESCE(SUM(gallons), 0) FROM fuel_logs WHERE deleted_at IS NULL) as total_fuel_gallons
      FROM (SELECT 1) as dummy;
    `;

    const statsRes = await query(statsSql);
    const s = statsRes.rows[0];

    // Convert SQL types
    const totalVehicles = parseInt(s.total_vehicles, 10) || 0;
    const activeVehicles = parseInt(s.active_vehicles, 10) || 0;
    const totalDistance = parseFloat(s.total_distance) || 0;
    const maintenanceCost = parseFloat(s.total_maintenance_cost) || 0;
    const fuelCost = parseFloat(s.total_fuel_cost) || 0;
    const otherExpenses = parseFloat(s.total_other_expenses) || 0;
    const totalExpenses = maintenanceCost + fuelCost + otherExpenses;
    const totalFuelGallons = parseFloat(s.total_fuel_gallons) || 0;

    // Top drivers query
    const topDriversRes = await query(`
      SELECT 
        d.id, u.first_name, u.last_name,
        COUNT(t.id) as trips_count
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      JOIN trips t ON t.driver_id = d.id
      WHERE t.status = 'completed' AND t.deleted_at IS NULL
      GROUP BY d.id, u.id
      ORDER BY trips_count DESC
      LIMIT 5
    `);

    // Top vehicles query
    const topVehiclesRes = await query(`
      SELECT 
        v.id, v.plate_number, v.make, v.model,
        COALESCE(SUM(t.distance), 0) as distance_sum
      FROM vehicles v
      JOIN trips t ON t.vehicle_id = v.id
      WHERE t.deleted_at IS NULL
      GROUP BY v.id
      ORDER BY distance_sum DESC
      LIMIT 5
    `);

    return {
      fleet_utilization: totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0,
      vehicle_availability: totalVehicles > 0 ? (parseInt(s.available_vehicles, 10) / totalVehicles) * 100 : 0,
      driver_availability: parseInt(s.total_drivers, 10) > 0 ? (parseInt(s.available_drivers, 10) / parseInt(s.total_drivers, 10)) * 100 : 0,
      trips_completed: parseInt(s.trips_completed, 10),
      trips_delayed: parseInt(s.trips_delayed, 10),
      maintenance_cost: maintenanceCost,
      fuel_cost: fuelCost,
      operational_expenses: totalExpenses,
      cost_per_km: totalDistance > 0 ? totalExpenses / totalDistance : 0,
      avg_trip_distance: parseFloat(s.avg_trip_distance) || 0,
      avg_fuel_consumption: totalDistance > 0 ? totalFuelGallons / totalDistance : 0,
      top_drivers: topDriversRes.rows,
      top_vehicles: topVehiclesRes.rows,
      vehicle_downtime_days: totalVehicles * 2, // Dummy indicator as placeholder for downtime calculations
      maintenance_frequency: totalVehicles > 0 ? (maintenanceCost / totalVehicles) : 0,
      revenue_placeholder: 0.00
    };
  }

  async getTrendsAnalytics(range: string): Promise<any[]> {
    // Generate trends dataset based on ranges: 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    let truncateUnit = 'month';
    if (range === 'daily') truncateUnit = 'day';
    if (range === 'weekly') truncateUnit = 'week';
    if (range === 'quarterly') truncateUnit = 'quarter';
    if (range === 'yearly') truncateUnit = 'year';

    const sql = `
      SELECT 
        DATE_TRUNC('${truncateUnit}', t.start_time) as period,
        COUNT(t.id) as trips_count,
        COALESCE(SUM(t.distance), 0) as total_distance,
        (
          SELECT COALESCE(SUM(cost), 0) 
          FROM maintenance 
          WHERE DATE_TRUNC('${truncateUnit}', scheduled_date) = DATE_TRUNC('${truncateUnit}', t.start_time)
          AND deleted_at IS NULL
        ) as maintenance_cost,
        (
          SELECT COALESCE(SUM(cost), 0) 
          FROM fuel_logs 
          WHERE DATE_TRUNC('${truncateUnit}', refuel_date) = DATE_TRUNC('${truncateUnit}', t.start_time)
          AND deleted_at IS NULL
        ) as fuel_cost
      FROM trips t
      WHERE t.deleted_at IS NULL AND t.status = 'completed'
      GROUP BY period
      ORDER BY period ASC
      LIMIT 12
    `;

    const result = await query(sql);
    return result.rows;
  }
}

export const reportRepository = new ReportRepository();
export default reportRepository;
