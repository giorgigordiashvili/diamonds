import { transformUserToResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Only admin can list all users
    const authResult = await authenticate(req, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Get all users
    const users = (await db.collection('users').find().toArray()) as User[];

    // Transform users for response
    const transformedUsers = users.map(transformUserToResponse);

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to retrieve users', details: errorMessage },
      { status: 500 }
    );
  }
}
