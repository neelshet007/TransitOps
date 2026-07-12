import { query } from '../database';

export interface DBPermissionResult {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export class PermissionRepository {
  async findAll(): Promise<DBPermissionResult[]> {
    const result = await query(
      `SELECT id, name, code, description FROM permissions WHERE deleted_at IS NULL ORDER BY code ASC`,
    );
    return result.rows;
  }

  async findById(id: string): Promise<DBPermissionResult | null> {
    const result = await query(
      `SELECT id, name, code, description FROM permissions WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async findByCodes(codes: string[]): Promise<DBPermissionResult[]> {
    if (codes.length === 0) return [];
    const placeholders = codes.map((_, i) => `$${i + 1}`).join(', ');
    const result = await query(
      `SELECT id, name, code, description FROM permissions WHERE code IN (${placeholders}) AND deleted_at IS NULL`,
      codes,
    );
    return result.rows;
  }
}

export const permissionRepository = new PermissionRepository();
export default permissionRepository;
