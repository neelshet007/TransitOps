import pg from 'pg';
import { config } from '../config';
import { logger } from '../utils/logger';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20, // Max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('🐘 Database connection pool initialized successfully');
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Executed query: ${text} - Duration: ${duration}ms - Rows: ${res.rowCount}`);
    return res;
  } catch (error: any) {
    logger.error(`Database query failed: ${text}. Error: ${error.message}`);
    throw error;
  }
};

export default {
  pool,
  query,
};
