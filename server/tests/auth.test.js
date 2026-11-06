import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createToken, requireStaff } from '../src/middleware/auth.js';
import { hashPassword, verifyPassword } from '../src/utils/passwords.js';

const originalSecret = process.env.JWT_SECRET;

before(() => {
  process.env.JWT_SECRET = 'test-secret-for-flimhall-auth-unit-tests';
});

after(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

function runMiddleware(token) {
  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
  let passed = false;
  requireStaff(
    { get: () => (token ? `Bearer ${token}` : undefined) },
    response,
    () => { passed = true; }
  );
  return { response, passed };
}

test('staff middleware accepts a signed staff token', () => {
  const token = createToken({ id: 8, email: 'staff@example.com', role: 'admin' });
  const { passed } = runMiddleware(token);
  assert.equal(passed, true);
});

test('staff middleware rejects missing and invalid tokens', () => {
  for (const token of ['', 'not.a.valid.token']) {
    const { response, passed } = runMiddleware(token);
    assert.equal(passed, false);
    assert.equal(response.statusCode, 401);
  }
});

test('password hashes verify only the original password', async () => {
  const password = 'correct horse battery staple';
  const hash = await hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong password', hash), false);
});
