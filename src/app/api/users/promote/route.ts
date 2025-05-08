import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/types/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Only admins can promote users
    const authResult = await authenticate(req, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find the user by ID
    const user = (await db.collection('users').findOne({
      _id: new ObjectId(userId),
    })) as User | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin') {
      return NextResponse.json({ message: 'User is already an admin' }, { status: 200 });
    }

    // Update user role to admin
    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: { role: 'admin', updatedAt: new Date() } });

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User promoted to admin successfully' }, { status: 200 });
  } catch (error) {
    console.error('Promote user error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to promote user', details: errorMessage },
      { status: 500 }
    );
  }
}
