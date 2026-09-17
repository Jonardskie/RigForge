import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionUri = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/rigforge_db';

export let pool: mysql.Pool | null = null;
export let db: MySql2Database<typeof schema> | null = null;
export let isDbConnected = false;

async function initDb() {
  try {
    pool = mysql.createPool({
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 2000,
    });

    // Test connection with a quick ping
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    db = drizzle(pool, { schema, mode: 'default' });
    isDbConnected = true;
    console.log('[RigForge DB] MySQL connected via Drizzle ORM.');
  } catch (error) {
    isDbConnected = false;
    db = null;
    console.log('[RigForge DB] Note: Local MySQL server not detected on :3306. Operating in high-speed in-memory mode with full 21-component catalog.');
  }
}

initDb();

export { schema };
