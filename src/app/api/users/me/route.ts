import { transformUserToResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/types/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Get user by ID
    const user = (await db.collection('users').findOne({
      _id: new ObjectId(authResult.userId),
    })) as User | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform user for response
    const userResponse = transformUserToResponse(user);

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to retrieve user information' }, { status: 500 });
  }
}
