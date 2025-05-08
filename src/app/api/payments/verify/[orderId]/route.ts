import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Verify payment status for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Authentication is required for verifying payments
    const authResult = await authenticate(request, false);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { orderId } = await params;
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    // Build query - if admin, can access any order. If regular user, only their own orders.
    const query: { _id: ObjectId; userId?: string } = { _id: new ObjectId(orderId) };

    // If not admin, restrict to user's own orders
    if (authResult.role !== 'admin') {
      query.userId = authResult.userId;
    }

    const order = await db.collection('orders').findOne(query);

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    // Get payment records for this order
    const payments = await db
      .collection('payments')
      .find({ orderId: orderId })
      .sort({ createdAt: -1 })
      .toArray();

    // Determine payment status
    let paymentStatus = 'pending';
    if (payments && payments.length > 0) {
      paymentStatus = payments[0].paymentStatus; // Get the most recent payment status
    } else if (order.paymentInfo) {
      paymentStatus = order.paymentInfo.paymentStatus;
    }

    return NextResponse.json({
      orderId: orderId,
      orderStatus: order.status,
      paymentStatus: paymentStatus,
      paymentMethod: order.paymentInfo?.paymentMethod || 'unknown',
      paymentDate: order.paymentInfo?.paymentDate,
      paymentAmount: order.paymentInfo?.paymentAmount,
      paymentReference: order.paymentInfo?.paymentReference,
    });
  } catch (error: unknown) {
    const { orderId } = await params;
    console.error(`Failed to verify payment for order ID: ${orderId}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to verify payment', details: errorMessage },
      { status: 500 }
    );
  }
}
