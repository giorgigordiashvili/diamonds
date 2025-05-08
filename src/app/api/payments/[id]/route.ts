import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Get a specific payment by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paymentId } = await params;

    // Verify authentication
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { db } = await connectToDatabase();

    // Get the payment
    let payment;
    try {
      payment = await db.collection('payments').findOne({ _id: new ObjectId(paymentId) });
    } catch (error) {
      console.error(`Error fetching payment ${paymentId}:`, error);
      return NextResponse.json({ error: 'Invalid payment ID format' }, { status: 400 });
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check authorization - only admin or payment owner can view
    if (authResult.role !== 'admin' && payment.userId !== authResult.id) {
      return NextResponse.json({ error: 'Unauthorized to view this payment' }, { status: 403 });
    }

    // For admin, also include related order and user details
    if (authResult.role === 'admin') {
      // Populate order details
      if (payment.orderId) {
        try {
          const order = await db
            .collection('orders')
            .findOne({ _id: new ObjectId(payment.orderId) });
          if (order) {
            payment.order = order;
          }
        } catch (error) {
          console.error(`Error fetching order ${payment.orderId}:`, error);
        }
      }

      // Populate user details
      if (payment.userId) {
        try {
          const user = await db.collection('users').findOne(
            { _id: new ObjectId(payment.userId) },
            { projection: { password: 0 } } // Exclude password
          );
          if (user) {
            payment.user = user;
          }
        } catch (error) {
          console.error(`Error fetching user ${payment.userId}:`, error);
        }
      }
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error retrieving payment:', error);
    return NextResponse.json({ error: 'Failed to retrieve payment' }, { status: 500 });
  }
}

// Update a payment status (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const paymentId = (await params).id;

    // Verify admin authentication
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    // Only admins can update payment statuses
    if (authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await request.json();
    const { status } = data;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Find and update the payment
    const now = new Date();
    const updateData: any = {
      status,
      updatedAt: now,
    };

    // If marking as completed, set completedAt
    if (status === 'completed') {
      updateData.completedAt = now;
    }

    // Update the payment
    const result = await db
      .collection('payments')
      .findOneAndUpdate(
        { _id: new ObjectId(paymentId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result || !result.value) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const payment = result.value;

    // If payment status is completed, update order status
    if (status === 'completed') {
      await db.collection('orders').updateOne(
        { _id: new ObjectId(payment.orderId) },
        {
          $set: {
            status: 'processing',
            paymentStatus: 'paid',
            updatedAt: now,
          },
        }
      );
    } else if (status === 'failed' || status === 'refunded') {
      // Update order status to reflect payment issue
      await db.collection('orders').updateOne(
        { _id: new ObjectId(payment.orderId) },
        {
          $set: {
            paymentStatus: status === 'failed' ? 'failed' : 'refunded',
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json({
      message: 'Payment updated successfully',
      payment,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

// Delete a payment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paymentId = (await params).id;

    // Verify admin authentication
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    // Only admins can delete payments
    if (authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { db } = await connectToDatabase();

    // Find the payment first to get order information
    const payment = await db.collection('payments').findOne({ _id: new ObjectId(paymentId) });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Delete the payment
    await db.collection('payments').deleteOne({ _id: new ObjectId(paymentId) });

    // If this was the only payment for the order, update order status
    const otherPayments = await db
      .collection('payments')
      .find({
        orderId: payment.orderId,
        _id: { $ne: new ObjectId(paymentId) },
      })
      .toArray();

    if (otherPayments.length === 0) {
      // No other payments for this order, update order payment status
      await db.collection('orders').updateOne(
        { _id: new ObjectId(payment.orderId) },
        {
          $set: {
            paymentStatus: 'unpaid',
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
