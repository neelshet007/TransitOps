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
    
    logger.info('Applying base seed data (roles, permissions, admin)...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../../../../database/seeds/seed.sql'), 'utf8');
    await client.query(seedSql);

    logger.info('Applying drivers seed data...');
    const driversSeedSql = fs.readFileSync(path.join(__dirname, '../../../../database/seeds/drivers.seed.sql'), 'utf8');
    await client.query(driversSeedSql);

    logger.info('Applying demo seed data (vehicles, trips, fuel, maintenance, expenses)...');
    const demoSeedSql = fs.readFileSync(path.join(__dirname, '../../../../database/seeds/demo.seed.sql'), 'utf8');
    await client.query(demoSeedSql);

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
