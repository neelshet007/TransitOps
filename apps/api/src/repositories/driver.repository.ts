import { query } from '../database';
import { Driver, DriverDocument } from '@transitops/types';

export interface PaginatedDriversResult {
  data: Driver[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class DriverRepository {
  async findById(id: string): Promise<Driver | null> {
    const sql = `
      SELECT *
      FROM drivers
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findByEmployeeId(employeeId: string): Promise<Driver | null> {
    const sql = `
      SELECT *
      FROM drivers
      WHERE employee_id = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [employeeId]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<Driver | null> {
    const sql = `
      SELECT *
      FROM drivers
      WHERE email = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findByPhone(phone: string): Promise<Driver | null> {
    const sql = `
      SELECT *
      FROM drivers
      WHERE phone = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [phone]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
    const sql = `
      SELECT *
      FROM drivers
      WHERE license_number = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [licenseNumber]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    availability?: string;
  }): Promise<PaginatedDriversResult> {
    const { page, limit, search, status, availability } = options;
    const offset = (page - 1) * limit;
    const params: unknown[] = [];
    const conditions: string[] = ['deleted_at IS NULL'];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR employee_id ILIKE $${params.length} OR license_number ILIKE $${params.length} OR phone ILIKE $${params.length})`
      );
    }

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (availability && availability !== 'all') {
      params.push(availability);
      conditions.push(`availability = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get count
    const countSql = `SELECT COUNT(*) FROM drivers ${whereClause}`;
    const countResult = await query(countSql, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // Get paginated data
    const selectParams = [...params];
    selectParams.push(limit);
    const limitPlaceholder = `$${selectParams.length}`;
    selectParams.push(offset);
    const offsetPlaceholder = `$${selectParams.length}`;

    const dataSql = `
      SELECT *
      FROM drivers
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;
    const dataResult = await query(dataSql, selectParams);
    const total_pages = Math.ceil(total / limit);

    return {
      data: dataResult.rows,
      total,
      page,
      limit,
      total_pages,
    };
  }

  async create(data: Partial<Driver>): Promise<Driver> {
    const fields = [
      'employee_id', 'first_name', 'last_name', 'phone', 'email',
      'date_of_birth', 'gender', 'blood_group', 'address', 'city', 'state', 'pincode',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
      'license_number', 'license_class', 'license_issue_date', 'license_expiry',
      'license_issuing_authority', 'medical_certificate_number', 'medical_certificate_expiry',
      'avatar_url', 'date_of_joining', 'experience_years', 'availability', 'status', 'notes'
    ];

    const insertFields: string[] = [];
    const values: unknown[] = [];
    const placeholders: string[] = [];

    fields.forEach((field) => {
      if (data[field as keyof Driver] !== undefined) {
        insertFields.push(field);
        values.push(data[field as keyof Driver]);
        placeholders.push(`$${values.length}`);
      }
    });

    const sql = `
      INSERT INTO drivers (${insertFields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async update(id: string, data: Partial<Driver>): Promise<Driver> {
    const fields = [
      'employee_id', 'first_name', 'last_name', 'phone', 'email',
      'date_of_birth', 'gender', 'blood_group', 'address', 'city', 'state', 'pincode',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
      'license_number', 'license_class', 'license_issue_date', 'license_expiry',
      'license_issuing_authority', 'license_verified', 'medical_certificate_number',
      'medical_certificate_expiry', 'medical_certificate_verified', 'avatar_url',
      'date_of_joining', 'experience_years', 'availability', 'status', 'notes',
      'total_trips', 'completed_trips', 'cancelled_trips', 'average_rating',
      'on_time_percentage', 'safety_score', 'total_distance', 'total_driving_hours',
      'violations', 'accidents'
    ];

    const updates: string[] = [];
    const values: unknown[] = [id];

    fields.forEach((field) => {
      if (data[field as keyof Driver] !== undefined) {
        values.push(data[field as keyof Driver]);
        updates.push(`${field} = $${values.length}`);
      }
    });

    const sql = `
      UPDATE drivers
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async softDelete(id: string): Promise<void> {
    const sql = `
      UPDATE drivers
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await query(sql, [id]);
  }

  async restore(id: string): Promise<Driver> {
    const sql = `
      UPDATE drivers
      SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  async updateStatus(id: string, status: string): Promise<Driver> {
    const sql = `
      UPDATE drivers
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await query(sql, [id, status]);
    return result.rows[0];
  }

  async updateAvailability(id: string, availability: string): Promise<Driver> {
    const sql = `
      UPDATE drivers
      SET availability = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await query(sql, [id, availability]);
    return result.rows[0];
  }

  async getDashboardStats(): Promise<any> {
    const sql = `
      SELECT
        COUNT(*) as total_drivers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_drivers,
        COUNT(CASE WHEN availability = 'on_duty' THEN 1 END) as on_duty,
        COUNT(CASE WHEN availability = 'resting' THEN 1 END) as off_duty,
        COUNT(CASE WHEN availability = 'leave' THEN 1 END) as leave,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended,
        COUNT(CASE WHEN license_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as expiring_licenses,
        COUNT(CASE WHEN medical_certificate_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as expiring_medical
      FROM drivers
      WHERE deleted_at IS NULL
    `;
    const result = await query(sql);
    return result.rows[0];
  }

  // --- Document Methods ---

  async findDocumentsByDriverId(driverId: string): Promise<DriverDocument[]> {
    const sql = `
      SELECT *
      FROM driver_documents
      WHERE driver_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await query(sql, [driverId]);
    return result.rows;
  }

  async findDocumentById(docId: string): Promise<DriverDocument | null> {
    const sql = `
      SELECT *
      FROM driver_documents
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [docId]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async createDocument(data: Partial<DriverDocument>): Promise<DriverDocument> {
    const fields = [
      'driver_id', 'document_type', 'document_number', 'issue_date', 'expiry_date',
      'issuing_authority', 'file_url', 'status', 'verified', 'verified_by', 'verified_at', 'notes'
    ];

    const insertFields: string[] = [];
    const values: unknown[] = [];
    const placeholders: string[] = [];

    fields.forEach((field) => {
      if (data[field as keyof DriverDocument] !== undefined) {
        insertFields.push(field);
        values.push(data[field as keyof DriverDocument]);
        placeholders.push(`$${values.length}`);
      }
    });

    const sql = `
      INSERT INTO driver_documents (${insertFields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async deleteDocument(docId: string): Promise<void> {
    const sql = `
      UPDATE driver_documents
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await query(sql, [docId]);
  }
}

export const driverRepository = new DriverRepository();
export default driverRepository;
