export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
    ? err.status
    : err.code === '23505' ? 409 : 500;
  if (status >= 500) console.error(err);
  else console.warn(`${req.method} ${req.path} returned ${status}: ${err.message}`);
  return res.status(status).json({
    message: status === 500 ? 'Internal server error'
      : err.code === '23505' ? 'A record with these details already exists.'
        : err.message
  });
}
