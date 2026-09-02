require('dotenv').config();
const { initDb, pool } = require('./db');
const { ensureSeedAdmin } = require('./auth');

async function migrate() {
  try {
    console.log('Starting PostgreSQL migration...');
    await initDb();
    await ensureSeedAdmin();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
