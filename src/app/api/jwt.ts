// @ts-ignore
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Use env in production

export interface IJwtPayload {
  id: string;
  user_id: string;
  email: string;
  user_client_id: string;
  timestamp: number;
  sig: string;
  iat: number;
}

/**
 * Generates a signed JWT from a JSON payload.
 * @param payload JSON object to encode in token
 * @returns signed JWT string
 */
export function signInJWT(payload: object): string {
  return jwt.sign(payload, JWT_SECRET);
}

/**
 * Verifies and decodes a JWT token.
 * @param token JWT string
 * @returns Decoded JSON payload
 */
export function getUser(token: string): IJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as IJwtPayload;
  } catch (err) {
    console.error('Invalid or expired token:', err);
    return null;
  }
}
