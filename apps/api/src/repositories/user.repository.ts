import { query } from '../database';
import bcrypt from 'bcrypt';

export interface DBUserResult {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  roles: string[];
  permissions: string[];
}

export interface UserListResult {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: Date;
  roles: string[];
}

export interface CreateUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export interface PaginatedUsersResult {
  data: UserListResult[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class UserRepository {
  async findByEmail(email: string): Promise<DBUserResult | null> {
    const sql = `
      SELECT 
        u.id, u.email, u.password_hash, u.first_name, u.last_name, u.is_active, u.created_at, u.updated_at,
        r.code as role_code,
        p.code as permission_code
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
      LEFT JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.deleted_at IS NULL
      LEFT JOIN permissions p ON rp.permission_id = p.id AND p.deleted_at IS NULL
      WHERE u.email = $1 AND u.deleted_at IS NULL
    `;
    const result = await query(sql, [email]);
    return this.mapRowsToUser(result.rows);
  }

  async findById(id: string): Promise<DBUserResult | null> {
    const sql = `
      SELECT 
        u.id, u.email, u.password_hash, u.first_name, u.last_name, u.is_active, u.created_at, u.updated_at,
        r.code as role_code,
        p.code as permission_code
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
      LEFT JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.deleted_at IS NULL
      LEFT JOIN permissions p ON rp.permission_id = p.id AND p.deleted_at IS NULL
      WHERE u.id = $1 AND u.deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    return this.mapRowsToUser(result.rows);
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    is_active?: boolean;
  }): Promise<PaginatedUsersResult> {
    const { page, limit, search, is_active } = options;
    const offset = (page - 1) * limit;
    const params: unknown[] = [];
    const conditions: string[] = ['u.deleted_at IS NULL'];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(u.email ILIKE $${params.length} OR u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length})`,
      );
    }
    if (is_active !== undefined) {
      params.push(is_active);
      conditions.push(`u.is_active = $${params.length}`);
    }

    const where = conditions.join(' AND ');

    // Count total
    const countResult = await query(`SELECT COUNT(*) FROM users u WHERE ${where}`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // Fetch paginated users with roles
    params.push(limit, offset);
    const sql = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.is_active, u.created_at,
        COALESCE(array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL), '{}') as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
      LEFT JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
      WHERE ${where}
      GROUP BY u.id, u.email, u.first_name, u.last_name, u.is_active, u.created_at
      ORDER BY u.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const result = await query(sql, params);

    return {
      data: result.rows,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async create(input: CreateUserInput): Promise<DBUserResult | null> {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(input.password, salt);

    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const result = await query(sql, [
      input.email,
      password_hash,
      input.first_name,
      input.last_name,
      input.is_active ?? true,
    ]);
    if (result.rows.length === 0) return null;
    return this.findById(result.rows[0].id);
  }

  async update(id: string, input: UpdateUserInput): Promise<DBUserResult | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (input.email !== undefined) {
      params.push(input.email);
      fields.push(`email = $${params.length}`);
    }
    if (input.first_name !== undefined) {
      params.push(input.first_name);
      fields.push(`first_name = $${params.length}`);
    }
    if (input.last_name !== undefined) {
      params.push(input.last_name);
      fields.push(`last_name = $${params.length}`);
    }
    if (input.is_active !== undefined) {
      params.push(input.is_active);
      fields.push(`is_active = $${params.length}`);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    params.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${params.length} AND deleted_at IS NULL`;
    await query(sql, params);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const sql = `UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL`;
    const result = await query(sql, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async resetPassword(id: string, newPassword: string): Promise<boolean> {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);
    const sql = `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL`;
    const result = await query(sql, [password_hash, id]);
    return (result.rowCount ?? 0) > 0;
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    const sql = `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, role_id) DO NOTHING
    `;
    await query(sql, [userId, roleId]);
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    const sql = `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`;
    await query(sql, [userId, roleId]);
  }

  private mapRowsToUser(rows: any[]): DBUserResult | null {
    if (rows.length === 0) return null;

    const rolesSet = new Set<string>();
    const permissionsSet = new Set<string>();

    rows.forEach((row) => {
      if (row.role_code) rolesSet.add(row.role_code);
      if (row.permission_code) permissionsSet.add(row.permission_code);
    });

    const firstRow = rows[0];
    return {
      id: firstRow.id,
      email: firstRow.email,
      password_hash: firstRow.password_hash,
      first_name: firstRow.first_name,
      last_name: firstRow.last_name,
      is_active: firstRow.is_active,
      created_at: firstRow.created_at,
      updated_at: firstRow.updated_at,
      roles: Array.from(rolesSet),
      permissions: Array.from(permissionsSet),
    };
  }
}

export const userRepository = new UserRepository();
export default userRepository;
