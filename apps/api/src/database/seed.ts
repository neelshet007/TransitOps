import fs from 'fs';
import path from 'path';
import { pool } from './index';
import { logger } from '../utils/logger';

async function seed() {
  logger.info('🌱 Starting database seeding...');

  const rootDir = path.join(__dirname, '../../../../');
  const seedPath = path.join(rootDir, 'database/seeds/seed.sql');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    logger.info('Applying seeds...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);

    await client.query('COMMIT');
    logger.info('✨ Seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
