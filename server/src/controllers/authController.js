import pool from '../db.js';
import { createToken } from '../middleware/auth.js';
import { hashPassword, verifyPassword } from '../utils/passwords.js';
import { httpError } from '../utils/httpError.js';

let schemaEnsured = false;

async function ensureUserSchema() {
  if (schemaEnsured) return;
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT 'Oulu & Tampere';
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'staff', 'admin'));
  `);
  schemaEnsured = true;
}

export async function login(req, res) {
  await ensureUserSchema();
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!email || email.length > 254 || !password || password.length > 256) {
    throw httpError(400, 'Enter a valid email address and password.');
  }

  const { rows } = await pool.query(
    'SELECT id, email, name, location, password_hash, role FROM users WHERE lower(email) = $1',
    [email]
  );
  const user = rows[0];
  if (!user || !['staff', 'admin'].includes(user.role)
    || !(await verifyPassword(password, user.password_hash))) {
    throw httpError(401, 'Email or password is incorrect.');
  }

  res.json({
    token: createToken(user),
    staff: {
      id: user.id,
      email: user.email,
      name: user.name || (user.role === 'admin' ? 'Main Admin Owner' : 'Theater Staff'),
      location: user.location || 'Oulu & Tampere',
      role: user.role
    }
  });
}

export async function customerAuth(req, res) {
  await ensureUserSchema();
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const name = String(body.name || '').trim() || 'FlimHall Member';
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || password.length < 6 || password.length > 256 || name.length > 120) {
    throw httpError(400, 'Enter a valid name, email address, and password of at least 6 characters.');
  }

  const { rows: existingRows } = await pool.query(
    'SELECT id, email, name, password_hash, role, created_at FROM users WHERE lower(email) = $1',
    [email]
  );
  const existing = existingRows[0];

  if (existing) {
    const valid = await verifyPassword(password, existing.password_hash);
    if (!valid) {
      throw httpError(401, 'Email or password is incorrect for this account.');
    }
    const updatedName = name && !existing.name ? name : (existing.name || name);
    if (updatedName !== existing.name) {
      await pool.query('UPDATE users SET name = $1 WHERE id = $2', [updatedName, existing.id]);
    }
    return res.json({
      isNewAccount: false,
      account: {
        id: existing.id,
        name: updatedName,
        email: existing.email,
        role: existing.role,
        created_at: existing.created_at
      }
    });
  }

  const passwordHash = await hashPassword(password);
  const { rows: createdRows } = await pool.query(
    `INSERT INTO users (email, password_hash, role, name)
     VALUES ($1, $2, 'customer', $3)
     RETURNING id, email, name, role, created_at`,
    [email, passwordHash, name]
  );

  return res.status(201).json({
    isNewAccount: true,
    account: createdRows[0]
  });
}

export async function registerStaff(req, res) {
  await ensureUserSchema();
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const ownerEmail = String(body.ownerEmail || '').trim().toLowerCase();
  const ownerPassword = String(body.ownerPassword || '');
  const staffName = String(body.name || '').trim() || 'FlimHall Staff';
  const staffEmail = String(body.email || '').trim().toLowerCase();
  const staffPassword = String(body.password || '');
  const location = String(body.location || 'Oulu & Tampere').trim();

  if (!staffEmail || staffEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffEmail)
    || staffPassword.length < 6 || staffPassword.length > 256) {
    throw httpError(400, 'Enter a valid staff email address and a password of at least 6 characters.');
  }

  // Verify owner authorization (either via existing admin account in DB or default owner credentials)
  const { rows: adminRows } = await pool.query(
    `SELECT id, email, password_hash FROM users WHERE role = 'admin' AND lower(email) = $1`,
    [ownerEmail || 'admin@flimhall.com']
  );
  const adminUser = adminRows[0];
  const validDefaultOwner = ownerEmail === 'admin@flimhall.com'
    && (ownerPassword === 'FlimHall2026!' || ownerPassword === 'admin123' || ownerPassword === process.env.ADMIN_PASSWORD);
  const validDbAdmin = adminUser && (await verifyPassword(ownerPassword, adminUser.password_hash));

  if (!validDefaultOwner && !validDbAdmin) {
    throw httpError(403, 'Only the Main Admin Owner can authorize creating a new staff account.');
  }

  const passwordHash = await hashPassword(staffPassword);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, role, name, location)
     VALUES ($1, $2, 'staff', $3, $4)
     RETURNING id, email, name, role, location, created_at`,
    [staffEmail, passwordHash, staffName, location]
  );

  res.status(201).json(rows[0]);
}
