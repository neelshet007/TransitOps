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
  odometer?: number;
}

export interface UpdateVehicleDTO {
  plate_number?: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  status?: string;
  odometer?: number;
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
        status,
        odometer
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `;

    const result = await query(sql, [
      data.plate_number,
      data.make,
      data.model,
      data.year,
      data.vin,
      data.status ?? "active",
      data.odometer ?? 0,
    ]);

    return result.rows[0];
  }

  async update(id: string, data: UpdateVehicleDTO): Promise<DBVehicleResult | null> {
    const updateSets: string[] = [];
    const values: any[] = [id];

    // Dynamically build SET clause to only update provided fields
    if (data.plate_number !== undefined) { values.push(data.plate_number); updateSets.push(`plate_number = $${values.length}`); }
    if (data.make !== undefined) { values.push(data.make); updateSets.push(`make = $${values.length}`); }
    if (data.model !== undefined) { values.push(data.model); updateSets.push(`model = $${values.length}`); }
    if (data.year !== undefined) { values.push(data.year); updateSets.push(`year = $${values.length}`); }
    if (data.vin !== undefined) { values.push(data.vin); updateSets.push(`vin = $${values.length}`); }
    if (data.status !== undefined) { values.push(data.status); updateSets.push(`status = $${values.length}`); }
    if ((data as any).availability !== undefined) { values.push((data as any).availability); updateSets.push(`availability = $${values.length}`); }
    if ((data as any).mileage !== undefined) { values.push((data as any).mileage); updateSets.push(`mileage = $${values.length}`); }

    if (updateSets.length === 0) {
      return this.findById(id);
    }

    const sql = `
      UPDATE vehicles
      SET ${updateSets.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await query(sql, values);

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