import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from './config';

export interface JWTPayload {
  userId: string;
  email: string;
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
    expiresIn: `${AUTH_CONFIG.SESSION_EXPIRY_DAYS}d`,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
