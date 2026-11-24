import assert from 'node:assert/strict';
import { test } from 'node:test';
import { httpError, parseId } from '../src/utils/httpError.js';

test('httpError creates an Error with the given status code and message', () => {
  const err = httpError(409, 'Seat already reserved.');
  assert.equal(err instanceof Error, true);
  assert.equal(err.status, 409);
  assert.equal(err.message, 'Seat already reserved.');
});

test('parseId returns a positive integer for valid numeric input', () => {
  assert.equal(parseId('1', 'Movie ID'), 1);
  assert.equal(parseId(42, 'Screening ID'), 42);
});

test('parseId throws a 400 error for zero, negative, non-integer, or non-numeric values', () => {
  for (const invalid of ['0', '-5', '3.14', 'abc', '', null, undefined]) {
    assert.throws(
      () => parseId(invalid, 'Booking ID'),
      (err) => err.status === 400 && err.message === 'Booking ID must be a positive integer.'
    );
  }
});
