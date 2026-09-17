import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, pool } from './index.js';

async function runMigrations() {
  if (!db) {
    console.error('Cannot run migrations: Database connection not initialized.');
    process.exit(1);
  }

  console.log('[RigForge Migrations] Applying pending schema migrations...');
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('[RigForge Migrations] Migrations applied successfully!');
  } catch (error) {
    console.error('[RigForge Migrations] Migration failed:', error);
    process.exit(1);
  } finally {
    if (pool) await pool.end();
  }
}

runMigrations();
