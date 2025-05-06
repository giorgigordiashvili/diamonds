import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function authenticate(
  req: NextRequest,
  requireAdmin = false
): Promise<
  | {
      id: any;
      userId: string;
      email: string;
      role: string;
    }
  | NextResponse
> {
  const authHeader = req.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader || undefined);

  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Check if admin role is required
  if (requireAdmin && payload.role !== 'admin') {
    return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 });
  }

  return {
    id: payload.id,
    userId: payload.id,
    email: payload.email,
    role: payload.role,
  };
}
