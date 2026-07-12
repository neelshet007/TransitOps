import { pool } from './index';
import { PoolClient } from 'pg';

export type TransactionCallback<T> = (client: PoolClient) => Promise<T>;

/**
 * Runs a set of queries inside a database transaction block.
 * Automatically handles BEGIN, COMMIT, and ROLLBACK.
 */
export async function withTransaction<T>(callback: TransactionCallback<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
