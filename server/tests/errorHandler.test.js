import assert from 'node:assert/strict';
import { test } from 'node:test';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { httpError } from '../src/utils/httpError.js';

function createMockResponse(headersSent = false) {
  return {
    headersSent,
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('errorHandler forwards to next when headers are already sent', () => {
  const res = createMockResponse(true);
  let forwarded = null;
  const err = new Error('Stream interrupted');
  errorHandler(err, { method: 'GET', path: '/api/movies' }, res, (e) => {
    forwarded = e;
  });
  assert.equal(forwarded, err);
});

test('errorHandler returns custom status and message for httpError', () => {
  const res = createMockResponse();
  const err = httpError(404, 'Movie not found.');
  errorHandler(err, { method: 'GET', path: '/api/movies/999' }, res, () => {});
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: 'Movie not found.' });
});

test('errorHandler maps PostgreSQL unique violation 23505 to 409 Conflict', () => {
  const res = createMockResponse();
  const err = Object.assign(new Error('duplicate key value'), { code: '23505' });
  errorHandler(err, { method: 'POST', path: '/api/admin/movies' }, res, () => {});
  assert.equal(res.statusCode, 409);
  assert.deepEqual(res.body, { message: 'A record with these details already exists.' });
});

test('errorHandler hides internal details on unexpected 500 errors', () => {
  const res = createMockResponse();
  const err = new Error('sensitive database stack trace');
  errorHandler(err, { method: 'POST', path: '/api/bookings' }, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { message: 'Internal server error' });
});
