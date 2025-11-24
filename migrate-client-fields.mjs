import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@127.0.0.1:51214/postgres?sslmode=disable",
  max: 1
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔧 Migráció indítása...');

    await client.query('ALTER TABLE proposals ADD COLUMN IF NOT EXISTS client_contact_name TEXT');
    console.log('✅ client_contact_name mező hozzáadva');

    await client.query('ALTER TABLE proposals ADD COLUMN IF NOT EXISTS client_phone TEXT');
    console.log('✅ client_phone mező hozzáadva');

    console.log('🎉 Migráció sikeres!');
  } catch (error) {
    console.error('❌ Hiba:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
