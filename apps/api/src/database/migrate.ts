import fs from 'fs';
import path from 'path';
import { pool } from './index';
import { logger } from '../utils/logger';

async function migrate() {
  logger.info('🚀 Starting raw SQL migrations...');

  const rootDir = path.join(__dirname, '../../../../');
  const schemaPath = path.join(rootDir, 'database/schema.sql');
  const indexPath = path.join(rootDir, 'database/indexes/indexes.sql');
  const functionsPath = path.join(rootDir, 'database/functions/functions.sql');
  const viewsPath = path.join(rootDir, 'database/views/views.sql');
  const migrationsDir = path.join(rootDir, 'database/migrations');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    logger.info('Applying base schema tables...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);

    logger.info('Applying indexes...');
    const indexSql = fs.readFileSync(indexPath, 'utf8');
    await client.query(indexSql);

    logger.info('Applying database helper functions...');
    const functionsSql = fs.readFileSync(functionsPath, 'utf8');
    await client.query(functionsSql);

    logger.info('Applying database view metrics...');
    const viewsSql = fs.readFileSync(viewsPath, 'utf8');
    await client.query(viewsSql);

    // Run incremental migration files in alphabetical order
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      for (const file of migrationFiles) {
        logger.info(`Applying migration: ${file}`);
        const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(migrationSql);
      }
    }

    await client.query('COMMIT');
    logger.info('✨ Raw SQL migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
