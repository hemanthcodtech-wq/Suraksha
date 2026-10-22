/**
 * Admin Seed Script — Property Suraksha
 * Run: node src/db/seedAdmin.js
 *
 * Seeds one super-admin into the `admins` table.
 * Safe to re-run (uses INSERT ... ON CONFLICT DO NOTHING).
 */

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { query, pool } from './index.js';

dotenv.config();

const ADMIN_NAME     = 'Suraksha Admin';
const ADMIN_EMAIL    = 'admin@propertysuraksha.in';
const ADMIN_PASSWORD = 'Suraksha@Admin2026';  // change after first login!
const ADMIN_ROLE     = 'Administrator';

const seed = async () => {
  console.log('\n🔐 Seeding admin user to Neon PostgreSQL...\n');

  try {
    // Ensure admins table exists
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Administrator',
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    const result = await query(
      `INSERT INTO admins (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             name          = EXCLUDED.name,
             role          = EXCLUDED.role
       RETURNING id, name, email, role, created_at;`,
      [ADMIN_NAME, ADMIN_EMAIL, passwordHash, ADMIN_ROLE]
    );

    const admin = result.rows[0];

    console.log('✅ Admin seeded successfully!\n');
    console.log('┌─────────────────────────────────────────────────┐');
    console.log('│            ADMIN LOGIN CREDENTIALS               │');
    console.log('├─────────────────────────────────────────────────┤');
    console.log(`│  Name     : ${admin.name.padEnd(36)}│`);
    console.log(`│  Email    : ${admin.email.padEnd(36)}│`);
    console.log(`│  Password : ${ADMIN_PASSWORD.padEnd(36)}│`);
    console.log(`│  Role     : ${admin.role.padEnd(36)}│`);
    console.log(`│  DB ID    : ${String(admin.id).padEnd(36)}│`);
    console.log('├─────────────────────────────────────────────────┤');
    console.log('│  ⚠️  Change the password after first login!       │');
    console.log('└─────────────────────────────────────────────────┘\n');

  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  } finally {
    await pool.end();
  }
};

seed();
