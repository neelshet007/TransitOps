import { query } from '../database';

export interface DBRoleResult {
  id: string;
  name: string;
  code: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  permissions: string[];
}

export interface CreateRoleInput {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export class RoleRepository {
  async findAll(): Promise<DBRoleResult[]> {
    const sql = `
      SELECT
        r.id, r.name, r.code, r.description, r.created_at, r.updated_at,
        COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}') as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.deleted_at IS NULL
      LEFT JOIN permissions p ON rp.permission_id = p.id AND p.deleted_at IS NULL
      WHERE r.deleted_at IS NULL
      GROUP BY r.id, r.name, r.code, r.description, r.created_at, r.updated_at
      ORDER BY r.created_at ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  async findById(id: string): Promise<DBRoleResult | null> {
    const sql = `
      SELECT
        r.id, r.name, r.code, r.description, r.created_at, r.updated_at,
        COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}') as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.deleted_at IS NULL
      LEFT JOIN permissions p ON rp.permission_id = p.id AND p.deleted_at IS NULL
      WHERE r.id = $1 AND r.deleted_at IS NULL
      GROUP BY r.id, r.name, r.code, r.description, r.created_at, r.updated_at
    `;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findByCode(code: string): Promise<DBRoleResult | null> {
    const result = await query(`SELECT id FROM roles WHERE code = $1 AND deleted_at IS NULL`, [code]);
    if (result.rows.length === 0) return null;
    return this.findById(result.rows[0].id);
  }

  async create(input: CreateRoleInput): Promise<DBRoleResult | null> {
    const sql = `
      INSERT INTO roles (name, code, description)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const result = await query(sql, [input.name, input.code, input.description ?? null]);
    if (result.rows.length === 0) return null;
    return this.findById(result.rows[0].id);
  }

  async update(id: string, input: UpdateRoleInput): Promise<DBRoleResult | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (input.name !== undefined) {
      params.push(input.name);
      fields.push(`name = $${params.length}`);
    }
    if (input.description !== undefined) {
      params.push(input.description);
      fields.push(`description = $${params.length}`);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    params.push(id);
    await query(`UPDATE roles SET ${fields.join(', ')} WHERE id = $${params.length} AND deleted_at IS NULL`, params);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE roles SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    await query(
      `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT (role_id, permission_id) DO NOTHING`,
      [roleId, permissionId],
    );
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await query(`DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2`, [roleId, permissionId]);
  }

  async setPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // Replace all permissions for a role
    await query(`DELETE FROM role_permissions WHERE role_id = $1`, [roleId]);
    for (const permId of permissionIds) {
      await query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [roleId, permId],
      );
    }
  }
}

export const roleRepository = new RoleRepository();
export default roleRepository;
