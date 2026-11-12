import pool from '../db.js';
import { createToken } from '../middleware/auth.js';
import { verifyPassword } from '../utils/passwords.js';
import { httpError } from '../utils/httpError.js';

export async function login(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!email || email.length > 254 || !password || password.length > 256) {
    throw httpError(400, 'Enter a valid email address and password.');
  }

  const { rows } = await pool.query(
    'SELECT id, email, password_hash, role FROM users WHERE lower(email) = $1',
    [email]
  );
  const user = rows[0];
  if (!user || !['staff', 'admin'].includes(user.role)
    || !(await verifyPassword(password, user.password_hash))) {
    throw httpError(401, 'Email or password is incorrect.');
  }

  res.json({
    token: createToken(user),
    staff: { id: user.id, email: user.email, role: user.role }
  });
}
