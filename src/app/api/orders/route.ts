import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Order } from '@/types/order';
import { ObjectId, Sort } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET all orders with optional filtering (admin only)
export async function GET(request: NextRequest) {
  try {
    // Authenticate as admin
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();

    // Build filter from query params
    const filter: Record<
      string,
      string | { $regex: string; $options: string } | { $gte?: Date; $lte?: Date }
    > = {};

    // Apply filters if they exist in query params
    if (searchParams.has('status')) {
      const status = searchParams.get('status');
      if (status !== null) filter.status = status;
    }
    if (searchParams.has('email')) {
      const email = searchParams.get('email');
      if (email !== null) filter.email = email;
    }
    if (searchParams.has('customerName')) {
      // Case-insensitive search on customer name
      const customerName = searchParams.get('customerName') || '';
      filter.customerName = { $regex: customerName, $options: 'i' };
    }

    // Date range filter
    if (searchParams.has('fromDate')) {
      filter.createdAt = { $gte: new Date(searchParams.get('fromDate') as string) };
    }
    if (searchParams.has('toDate')) {
      filter.createdAt = filter.createdAt || {};
      filter.createdAt = {
        ...(filter.createdAt as object),
        $lte: new Date(searchParams.get('toDate') as string),
      };
    }

    // Handle pagination
    const page = searchParams.has('page') ? parseInt(searchParams.get('page') as string) : 1;
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit') as string) : 20;
    const skip = (page - 1) * limit;

    // Handle sorting
    const sortField = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const sort: Sort = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Get total count (for pagination)
    const total = await db.collection('orders').countDocuments(filter);

    // Get orders
    const orders = await db
      .collection('orders')
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Transform _id to string id for each order
    const transformedOrders = orders.map((order) => {
      // Create a string ID from ObjectId and remove the _id
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
    console.error('Failed to fetch orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST a new order (requires user authentication)
export async function POST(request: NextRequest) {
  try {
    // Authenticate user (any role)
    const authResult = await authenticate(request, false);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const orderData = (await request.json()) as Order;
    const { db } = await connectToDatabase();

    // Associate the order with the authenticated user
    orderData.userId = authResult.userId;

    // Validate required fields
    const requiredFields = ['customerName', 'email', 'phone', 'items', 'totalAmount'];
    const missingFields = requiredFields.filter((field) => !(field in orderData));

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Make sure items array is not empty
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Set default status if not provided
    if (!orderData.status) {
      orderData.status = 'Pending';
    }

    // Validate all diamond IDs in the order
    const diamondIds = orderData.items.map((item) => item.diamondId);
    const validDiamonds = await db
      .collection('diamonds')
      .find({
        _id: { $in: diamondIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    // Check if all diamonds exist
    if (validDiamonds.length !== diamondIds.length) {
      return NextResponse.json(
        { error: 'One or more diamond IDs in the order are invalid' },
        { status: 400 }
      );
    }

    // Add timestamps
    const timestamp = new Date();
    const newOrder = {
      ...orderData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const result = await db.collection('orders').insertOne(newOrder);

    // Return the created order with the id
    const createdOrder = {
      id: result.insertedId.toString(),
      ...newOrder,
    };

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create order', details: errorMessage },
      { status: 500 }
    );
  }
}
