import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return secret;
}

function sign(value) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + TOKEN_LIFETIME_SECONDS
  })).toString('base64url');
  const body = `v1.${payload}`;
  return `${body}.${sign(body)}`;
}

export function requireStaff(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return res.status(401).json({ message: 'Staff login is required.' });

  try {
    const [version, payload, signature, extra] = token.split('.');
    const body = `${version}.${payload}`;
    const expected = Buffer.from(sign(body));
    const actual = Buffer.from(signature || '');
    if (version !== 'v1' || extra || expected.length !== actual.length
      || !timingSafeEqual(expected, actual)) {
      return res.status(401).json({ message: 'Your staff session is invalid.' });
    }

    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!claims.sub || !['staff', 'admin'].includes(claims.role) || claims.exp <= Date.now() / 1000) {
      return res.status(401).json({ message: 'Your staff session has expired.' });
    }

    req.staff = claims;
    return next();
  } catch (error) {
    if (error.message.includes('JWT_SECRET')) return next(error);
    return res.status(401).json({ message: 'Your staff session is invalid.' });
  }
}
