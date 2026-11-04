export function getHealthStatus() {
  return {
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
}
