import { query } from "../database";

export interface DBVehicleResult {
  id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateVehicleDTO {
  plate_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status?: string;
}

export interface UpdateVehicleDTO {
  plate_number?: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  status?: string;
}

export class VehicleRepository {
  async findAll(): Promise<DBVehicleResult[]> {
    const sql = `
      SELECT *
      FROM vehicles
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await query(sql);
    return result.rows;
  }

  async findById(id: string): Promise<DBVehicleResult | null> {
    const sql = `
      SELECT *
      FROM vehicles
      WHERE id = $1
      AND deleted_at IS NULL
    `;

    const result = await query(sql, [id]);

    return result.rows.length ? result.rows[0] : null;
  }

  async findByPlateNumber(plateNumber: string): Promise<DBVehicleResult | null> {
    const sql = `
      SELECT *
      FROM vehicles
      WHERE plate_number = $1
      AND deleted_at IS NULL
    `;

    const result = await query(sql, [plateNumber]);

    return result.rows.length ? result.rows[0] : null;
  }

  async create(data: CreateVehicleDTO): Promise<DBVehicleResult> {
    const sql = `
      INSERT INTO vehicles
      (
        plate_number,
        make,
        model,
        year,
        vin,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `;

    const result = await query(sql, [
      data.plate_number,
      data.make,
      data.model,
      data.year,
      data.vin,
      data.status ?? "active",
    ]);

    return result.rows[0];
  }

  async update(id: string, data: UpdateVehicleDTO): Promise<DBVehicleResult | null> {
    const sql = `
      UPDATE vehicles
      SET
        plate_number = $1,
        make = $2,
        model = $3,
        year = $4,
        vin = $5,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;

    const result = await query(sql, [
      data.plate_number,
      data.make,
      data.model,
      data.year,
      data.vin,
      data.status,
      id,
    ]);

    return result.rows.length ? result.rows[0] : null;
  }

  async delete(id: string): Promise<void> {
    const sql = `
      UPDATE vehicles
      SET
        deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;

    await query(sql, [id]);
  }
}

export const vehicleRepository = new VehicleRepository();
export default vehicleRepository;