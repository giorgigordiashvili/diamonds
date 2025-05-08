import { generateToken, transformUserToResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/types/user';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { email, password, firstName, lastName } = body;
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const now = new Date();
    const newUser: User = {
      _id: new ObjectId(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user', // Default role
      createdAt: now,
      updatedAt: now,
    };

    // Insert user into database
    await db.collection('users').insertOne(newUser);

    // Generate JWT token
    const token = generateToken(newUser);

    // Transform user for response
    const userResponse = transformUserToResponse(newUser);

    // Return user data with token
    return NextResponse.json(
      {
        ...userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
