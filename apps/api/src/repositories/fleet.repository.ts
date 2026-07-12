import { query } from '../database';

export interface FleetStats {
  total_vehicles: number;
  available: number;
  on_trip: number;
  under_maintenance: number;
  reserved: number;
  out_of_service: number;
  expired_documents: number;
  fuel_low: number;
}

export class FleetRepository {
  async getOperationalStats(): Promise<FleetStats> {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM vehicles WHERE deleted_at IS NULL) as total_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'available' AND deleted_at IS NULL) as available,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'on_trip' AND deleted_at IS NULL) as on_trip,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'maintenance' AND deleted_at IS NULL) as under_maintenance,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'reserved' AND deleted_at IS NULL) as reserved,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'out_of_service' AND deleted_at IS NULL) as out_of_service,
        (
          SELECT COUNT(*) 
          FROM vehicles 
          WHERE (fitness_expiry <= CURRENT_DATE OR insurance_expiry <= CURRENT_DATE OR puc_expiry <= CURRENT_DATE)
          AND deleted_at IS NULL
        ) as expired_documents,
        (SELECT COUNT(*) FROM vehicles WHERE fuel_level < 20 AND deleted_at IS NULL) as fuel_low
      FROM (SELECT 1) as dummy;
    `;
    
    const result = await query(sql);
    const row = result.rows[0];
    return {
      total_vehicles: parseInt(row.total_vehicles, 10),
      available: parseInt(row.available, 10),
      on_trip: parseInt(row.on_trip, 10),
      under_maintenance: parseInt(row.under_maintenance, 10),
      reserved: parseInt(row.reserved, 10),
      out_of_service: parseInt(row.out_of_service, 10),
      expired_documents: parseInt(row.expired_documents, 10),
      fuel_low: parseInt(row.fuel_low, 10),
    };
  }

  async getFleetOverview(): Promise<any[]> {
    const sql = `
      SELECT 
        id, 
        plate_number, 
        make, 
        model, 
        year, 
        vin, 
        status, 
        fitness_expiry, 
        insurance_expiry, 
        puc_expiry, 
        fuel_level, 
        odometer,
        CASE 
          WHEN fitness_expiry <= CURRENT_DATE OR insurance_expiry <= CURRENT_DATE OR puc_expiry <= CURRENT_DATE THEN true
          ELSE false
        END as has_expired_docs,
        CASE
          WHEN fuel_level < 20 THEN true
          ELSE false
        END as is_fuel_low
      FROM vehicles
      WHERE deleted_at IS NULL
      ORDER BY plate_number ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  async getAvailableVehicles(): Promise<any[]> {
    // Only return vehicles that are status = 'available' and don't have expired documents
    const sql = `
      SELECT id, plate_number, make, model, fuel_level, odometer
      FROM vehicles
      WHERE status = 'available'
      AND fitness_expiry > CURRENT_DATE
      AND insurance_expiry > CURRENT_DATE
      AND puc_expiry > CURRENT_DATE
      AND deleted_at IS NULL
      ORDER BY plate_number ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  async logStatusChange(
    vehicleId: string,
    oldStatus: string,
    newStatus: string,
    reason: string | null,
    changedBy?: string
  ): Promise<void> {
    const sql = `
      INSERT INTO vehicle_status_history (vehicle_id, old_status, new_status, reason, changed_by)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await query(sql, [vehicleId, oldStatus, newStatus, reason, changedBy || null]);
  }

  async logFleetAvailability(stats: FleetStats): Promise<void> {
    const sql = `
      INSERT INTO fleet_availability_logs (total_vehicles, available_count, on_trip_count, maintenance_count)
      VALUES ($1, $2, $3, $4)
    `;
    await query(sql, [stats.total_vehicles, stats.available, stats.on_trip, stats.under_maintenance]);
  }
}

export const fleetRepository = new FleetRepository();
export default fleetRepository;
