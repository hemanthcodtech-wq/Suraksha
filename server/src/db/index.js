import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ FATAL: DATABASE_URL is not set in server/.env');
  console.error('Please configure your Neon DB URL: postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('⚡ Connected to Neon PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Neon PostgreSQL Pool Error:', err);
});

/**
 * Execute dynamic parameterized query directly against Neon PostgreSQL
 */
export const query = (text, params) => {
  return pool.query(text, params);
};

export default {
  query,
  pool
};
