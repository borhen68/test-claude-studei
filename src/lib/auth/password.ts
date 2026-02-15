/**
 * Password Hashing and Token Generation Module
 * 
 * Provides secure password handling using bcrypt and cryptographically
 * secure token generation for email verification and password resets.
 * 
 * Security features:
 * - bcrypt hashing with configurable salt rounds
 * - Constant-time password verification
 * - Cryptographically secure random token generation
 */

import bcrypt from 'bcryptjs';
import { AUTH_CONFIG } from './config';

/**
 * Hash a plaintext password using bcrypt
 * 
 * Uses bcrypt's built-in salt generation with configurable rounds.
 * Higher rounds = more secure but slower. Default: 10 rounds.
 * 
 * @param password - Plaintext password from user input
 * @returns Promise resolving to bcrypt hash string (60 characters)
 * @throws Error if hashing fails
 * 
 * @example
 * const hash = await hashPassword('user_password_123');
 * // hash: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a stored bcrypt hash
 * 
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * @param password - Plaintext password from login attempt
 * @param hash - Stored bcrypt hash from database
 * @returns Promise resolving to true if password matches, false otherwise
 * 
 * @example
 * const isValid = await verifyPassword(inputPassword, user.passwordHash);
 * if (isValid) { // Allow login }
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a cryptographically secure random token
 * 
 * Uses Web Crypto API for secure randomness.
 * Suitable for email verification tokens, password reset tokens, etc.
 * 
 * @returns Hex-encoded random token (64 characters, 256 bits of entropy)
 * 
 * @example
 * const token = generateToken();
 * // token: "a3f5d8c2e1b4f6a8d3c5e7f9b2a4d6c8e1f3a5b7c9d2e4f6a8b3d5c7e9f1a3b5"
 * 
 * // Use for email verification:
 * await sendVerificationEmail(user.email, token);
 * await db.insert(emailVerifications).values({ token, userId, expiresAt });
 */
export function generateToken(): string {
  // Generate 32 random bytes (256 bits)
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  
  // Convert to hex string (64 characters)
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
