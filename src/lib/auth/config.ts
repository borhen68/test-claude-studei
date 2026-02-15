export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  SESSION_EXPIRY_DAYS: 30,
  EMAIL_VERIFICATION_EXPIRY_HOURS: 24,
  PASSWORD_RESET_EXPIRY_HOURS: 1,
  SALT_ROUNDS: 10,
};

export const COOKIE_NAME = 'frametale_session';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  path: '/',
};
