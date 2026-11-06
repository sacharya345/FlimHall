export function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function parseId(value, label = 'ID') {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw httpError(400, `${label} must be a positive integer.`);
  }
  return id;
}
