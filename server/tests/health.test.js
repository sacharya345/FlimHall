import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getHealth } from '../src/controllers/healthController.js';
import { getHealthStatus } from '../src/services/healthService.js';

test('getHealthStatus returns numeric uptime and ISO timestamp', () => {
  const status = getHealthStatus();
  assert.equal(typeof status.uptime, 'number');
  assert.equal(status.uptime >= 0, true);
  assert.equal(typeof status.timestamp, 'string');
  assert.equal(Number.isFinite(Date.parse(status.timestamp)), true);
});

test('getHealth controller responds with ok status and flimhall-api service name', () => {
  let payload = null;
  const res = {
    json(body) {
      payload = body;
      return this;
    }
  };

  getHealth({}, res);
  assert.ok(payload);
  assert.equal(payload.status, 'ok');
  assert.equal(payload.service, 'flimhall-api');
  assert.equal(typeof payload.uptime, 'number');
  assert.equal(typeof payload.timestamp, 'string');
});
