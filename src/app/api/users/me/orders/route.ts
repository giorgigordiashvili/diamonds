import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Sort } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Get current user's orders
export async function GET(request: NextRequest) {
  try {
    // Authentication is required to access order history
    const authResult = await authenticate(request, false);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const userId = authResult.userId;
    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();

    // Build filter
    const filter: Record<string, string | { $regex: string; $options: string }> = { userId };

    // Apply additional filters if needed
    if (searchParams.has('status')) {
      const status = searchParams.get('status');
      if (status !== null) filter.status = status;
    }

    // Handle pagination
    const page = searchParams.has('page') ? parseInt(searchParams.get('page') as string) : 1;
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const skip = (page - 1) * limit;

    // Handle sorting
    const sortField = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const sort: Sort = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Get total count for pagination
    const total = await db.collection('orders').countDocuments(filter);

    // Get user's orders
    const orders = await db
      .collection('orders')
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Transform order data for response
    const transformedOrders = orders.map((order) => {
      const { _id, ...rest } = order;
      return {
        id: _id.toString(),
        ...rest,
      };
    });

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error('Failed to fetch user orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch order history', details: errorMessage },
      { status: 500 }
    );
  }
}
