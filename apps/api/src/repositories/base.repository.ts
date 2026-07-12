import { query } from '../database';

export interface FindOptions {
  filters?: Record<string, any>;
  search?: {
    query: string;
    fields: string[];
  };
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract columns: string[];

  /**
   * Finds records using filters, sorting, search, and pagination.
   */
  async find(options: FindOptions = {}): Promise<{ rows: T[]; count: number }> {
    const values: any[] = [];
    const conditions: string[] = ['deleted_at IS NULL'];

    // 1. Handle Filters
    if (options.filters) {
      for (const [key, val] of Object.entries(options.filters)) {
        if (val !== undefined && val !== null && val !== '') {
          values.push(val);
          conditions.push(`"${key}" = $${values.length}`);
        }
      }
    }

    // 2. Handle Search
    if (options.search && options.search.query && options.search.fields.length > 0) {
      const searchConditions: string[] = [];
      for (const field of options.search.fields) {
        values.push(`%${options.search.query}%`);
        searchConditions.push(`"${field}"::text ILIKE $${values.length}`);
      }
      conditions.push(`(${searchConditions.join(' OR ')})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 3. Count Total Records
    const countSql = `SELECT COUNT(*) as total FROM "${this.tableName}" ${whereClause}`;
    const countResult = await query(countSql, values);
    const totalRecords = parseInt(countResult.rows[0]?.total || '0', 10);

    // 4. Sort
    let orderClause = '';
    if (options.sort && options.sort.field) {
      const direction = options.sort.order === 'DESC' ? 'DESC' : 'ASC';
      orderClause = `ORDER BY "${options.sort.field}" ${direction}`;
    } else {
      orderClause = 'ORDER BY created_at DESC';
    }

    // 5. Pagination
    let limitOffsetClause = '';
    if (options.pagination) {
      const limit = Math.max(1, options.pagination.limit || 10);
      const page = Math.max(1, options.pagination.page || 1);
      const offset = (page - 1) * limit;
      
      values.push(limit);
      const limitParam = `$${values.length}`;
      
      values.push(offset);
      const offsetParam = `$${values.length}`;
      
      limitOffsetClause = `LIMIT ${limitParam} OFFSET ${offsetParam}`;
    }

    const selectColumns = this.columns.map(c => `"${c}"`).join(', ');
    const fetchSql = `
      SELECT ${selectColumns}
      FROM "${this.tableName}"
      ${whereClause}
      ${orderClause}
      ${limitOffsetClause}
    `;

    const fetchResult = await query(fetchSql, values);
    return {
      rows: fetchResult.rows,
      count: totalRecords
    };
  }

  async findById(id: string): Promise<T | null> {
    const selectColumns = this.columns.map(c => `"${c}"`).join(', ');
    const sql = `SELECT ${selectColumns} FROM "${this.tableName}" WHERE id = $1 AND deleted_at IS NULL`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const insertFields: string[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];

    // Filter out undefined and null values that have defaults
    for (const key of this.columns) {
      const val = (data as any)[key];
      if (val !== undefined) {
        insertFields.push(`"${key}"`);
        values.push(val);
        placeholders.push(`$${values.length}`);
      }
    }

    const sql = `
      INSERT INTO "${this.tableName}" (${insertFields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING ${this.columns.map(c => `"${c}"`).join(', ')}
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updateSets: string[] = [];
    const values: any[] = [id];

    for (const key of this.columns) {
      if (key === 'id' || key === 'created_at') continue;
      const val = (data as any)[key];
      if (val !== undefined) {
        values.push(val);
        updateSets.push(`"${key}" = $${values.length}`);
      }
    }

    if (updateSets.length === 0) {
      return this.findById(id);
    }

    const sql = `
      UPDATE "${this.tableName}"
      SET ${updateSets.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING ${this.columns.map(c => `"${c}"`).join(', ')}
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const sql = `
      UPDATE "${this.tableName}"
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
