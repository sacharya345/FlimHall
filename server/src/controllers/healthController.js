import { getHealthStatus } from '../services/healthService.js';

export function getHealth(req, res) {
  const status = getHealthStatus();

  res.json({
    status: 'ok',
    service: 'flimhall-api',
    ...status
  });
}
