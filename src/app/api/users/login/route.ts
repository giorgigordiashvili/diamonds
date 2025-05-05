import { generateToken, transformUserToResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/types/user';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user by email
    const user = (await db.collection('users').findOne({ email })) as User | null;

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Transform user for response
    const userResponse = transformUserToResponse(user);

    // Return user data with token
    return NextResponse.json({
      ...userResponse,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
