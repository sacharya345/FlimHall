import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pool from '../db.js';
import { hashPassword } from '../utils/passwords.js';

async function runSql(relativePath) {
  const file = new URL(relativePath, import.meta.url);
  const sql = await readFile(fileURLToPath(file), 'utf8');
  await pool.query(sql);
}

try {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (Boolean(adminEmail) !== Boolean(adminPassword)) {
    throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD to create the initial staff account.');
  }
  if (adminEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail) || adminPassword.length < 12) {
      throw new Error('Use a valid ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.');
    }
  }

  await runSql('../../../database/migrations/001_init.sql');
  await runSql('../../../database/seeds/001_demo_data.sql');

  if (adminEmail) {
    const passwordHash = await hashPassword(adminPassword);
    await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (lower(email))
       DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
      [adminEmail, passwordHash]
    );
    console.log(`Staff account ready for ${adminEmail}`);
  } else {
    console.log('Set ADMIN_EMAIL and ADMIN_PASSWORD to create the initial staff account.');
  }

  console.log('Database schema and demo data are ready.');
} catch (error) {
  console.error('Database setup failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
