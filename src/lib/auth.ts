import { User, UserResponse } from '@/types/user';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

// JWT secret key - Should be moved to environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload = {
    id: user._id?.toString() || user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract JWT token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Transform a User document to a UserResponse object
 * Removes sensitive fields like password
 */
export function transformUserToResponse(user: User): UserResponse {
  // Handle both MongoDB ObjectId and string ID
  const id = user._id instanceof ObjectId ? user._id.toString() : user.id || '';

  return {
    id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
