import { query } from '../database';

export interface DBUserResult {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles: string[];
  permissions: string[];
}

export class UserRepository {
  async findByEmail(email: string): Promise<DBUserResult | null> {
    const sql = `
      SELECT 
        u.id, u.email, u.password_hash, u.first_name, u.last_name, u.is_active,
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
        u.id, u.email, u.password_hash, u.first_name, u.last_name, u.is_active,
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
      roles: Array.from(rolesSet),
      permissions: Array.from(permissionsSet),
    };
  }
}

export const userRepository = new UserRepository();
export default userRepository;
