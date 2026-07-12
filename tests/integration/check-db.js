require('dotenv').config({ path: 'apps/api/.env' });
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const tables = ['vehicles', 'trips', 'notifications'];
  for (const table of tables) {
    const r = await p.query(
      'SELECT column_name FROM information_schema.columns WHERE table_name=$1 ORDER BY ordinal_position',
      [table]
    );
    console.log(`\n${table} columns:`, r.rows.map(x => x.column_name).join(', '));
  }
  
  // Try the problem query in isolation
  try {
    const r2 = await p.query("SELECT COUNT(*) FROM vehicles WHERE availability = 'maintenance' AND deleted_at IS NULL");
    console.log('\nvehicles availability check OK:', r2.rows[0]);
  } catch (e) {
    console.log('\nvehicles availability error:', e.message);
  }
  
  try {
    const r3 = await p.query("SELECT COALESCE(SUM(total_cost), 0) FROM fuel_logs WHERE fuel_date >= CURRENT_DATE");
    console.log('fuel_logs fuel_date check OK:', r3.rows[0]);
  } catch (e) {
    console.log('fuel_logs fuel_date error:', e.message);
  }

  await p.end();
}

main().catch(e => { console.error(e.message); p.end(); });
