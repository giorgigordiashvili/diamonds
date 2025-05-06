import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId, ReturnDocument } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

interface AuthResult {
  userId: string;
  email: string;
  role: string;
  id: string;
}

// Process cash payment confirmation
export async function POST(request: NextRequest) {
  try {
    // Authentication is required for handling payments
    const authResult = await authenticate(request, false);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const userId = (authResult as AuthResult).id;
    const data = await request.json();

    // Validate required fields
    if (!data.orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Additional payment details
    const paymentDetails = {
      paymentMethod: 'cash',
      paymentReference: data.paymentReference || `CASH-${Date.now()}`,
      paymentDate: new Date(),
      paymentAmount: data.amount,
      paymentStatus: 'confirmed',
      notes: data.notes || '',
    };

    const { db } = await connectToDatabase();

    // Check if order exists and belongs to the user
    const orderId = data.orderId;

    // Ensure orderId is a valid ObjectId
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    // Build query - if admin, can access any order. If regular user, only their own orders.
    const query: { _id: ObjectId; userId?: string } = { _id: new ObjectId(orderId) };

    // If not admin, restrict to user's own orders
    if (authResult.role !== 'admin') {
      query.userId = userId;
    }

    const order = await db.collection('orders').findOne(query);

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    // Update the order with payment information
    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentInfo: paymentDetails,
          status: 'Processing', // Update order status to indicate payment received
          updatedAt: new Date(),
        },
      },
      { returnDocument: ReturnDocument.AFTER }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update order payment information' },
        { status: 500 }
      );
    }

    // Create payment record
    const paymentRecord = {
      orderId: orderId,
      userId: userId,
      ...paymentDetails,
      createdAt: new Date(),
    };

    await db.collection('payments').insertOne(paymentRecord);

    // Transform _id to string id
    const { _id, ...rest } = result;
    const updatedOrder = {
      id: _id.toString(),
      ...rest,
    };

    return NextResponse.json({
      message: 'Cash payment confirmed successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error processing cash payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to process cash payment', details: errorMessage },
      { status: 500 }
    );
  }
}
