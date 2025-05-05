import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Order } from '@/types/order';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET a single order by ID - accessible to admin or the order owner
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate user (any role)
    const authResult = await authenticate(request, false);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    // Build query - if admin, can access any order. If regular user, only their own orders.
    const query: { _id: ObjectId; userId?: string } = { _id: new ObjectId(id) };

    // If not admin, restrict to user's own orders
    if (authResult.role !== 'admin') {
      query.userId = authResult.userId;
    }

    const order = await db.collection('orders').findOne(query);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Transform _id to string id
    const { _id, ...rest } = order;
    const transformedOrder = {
      id: _id.toString(),
      ...rest,
    };

    return NextResponse.json(transformedOrder);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Failed to fetch order with ID: ${id}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch order', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT/UPDATE an order - admin only
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate as admin
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { id } = await params;
    const updateData = (await request.json()) as Partial<Order>;
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    // Don't allow updating the _id field
    if ('_id' in updateData) {
      delete updateData._id;
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    // If updating items, validate diamond IDs
    if (updateData.items && updateData.items.length > 0) {
      const diamondIds = updateData.items.map((item) => item.diamondId);

      try {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid diamond ID format in items array' },
          { status: 400 }
        );
      }
    }

    const result = await db
      .collection('orders')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Transform _id to string id
    const { _id, ...rest } = result;
    const updatedOrder = {
      id: _id.toString(),
      ...rest,
    };

    return NextResponse.json(updatedOrder);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Failed to update order with ID: ${id}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update order', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE an order - admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate as admin
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    const result = await db.collection('orders').findOneAndDelete({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Failed to delete order with ID: ${id}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete order', details: errorMessage },
      { status: 500 }
    );
  }
}
