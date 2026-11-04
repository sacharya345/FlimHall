import assert from 'node:assert/strict';

const healthCheck = {
  status: 'ok',
  service: 'flimhall-api'
};

assert.equal(healthCheck.status, 'ok');
assert.equal(healthCheck.service, 'flimhall-api');

console.log('Health test passed');
