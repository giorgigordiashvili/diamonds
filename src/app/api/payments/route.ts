import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Payment } from '@/types/payment';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Get all payments (admin only) or payments for the current user
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { db } = await connectToDatabase();

    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status');
    const orderId = url.searchParams.get('orderId');

    // Build the query
    const query: any = {};

    // If not admin, limit to user's own payments
    if (authResult.role !== 'admin') {
      query.userId = authResult.id;
    } else if (url.searchParams.get('userId')) {
      // Admin can query by userId
      query.userId = url.searchParams.get('userId');
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by orderId if provided
    if (orderId) {
      query.orderId = orderId;
    }

    // Get total count (for pagination)
    const total = await db.collection('payments').countDocuments(query);

    // Get paginated payments
    const payments = await db
      .collection('payments')
      .find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(offset)
      .limit(limit)
      .toArray();

    // For admin users, populate order and user details
    if (authResult.role === 'admin') {
      const populatedPayments = await Promise.all(
        payments.map(async (payment) => {
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

          return payment;
        })
      );

      return NextResponse.json({
        payments: populatedPayments,
        total,
        limit,
        offset,
      });
    }

    return NextResponse.json({
      payments,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error retrieving payments:', error);
    return NextResponse.json({ error: 'Failed to retrieve payments' }, { status: 500 });
  }
}

// Create a new payment
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { db } = await connectToDatabase();

    const data = await request.json();

    // Validate required fields
    if (!data.orderId || !data.amount || !data.currency || !data.paymentMethod) {
      return NextResponse.json(
        {
          error: 'Missing required fields: orderId, amount, currency, paymentMethod',
        },
        { status: 400 }
      );
    }

    // Verify the order exists
    let order;
    try {
      order = await db.collection('orders').findOne({ _id: new ObjectId(data.orderId) });
    } catch (error) {
      console.error(`Error fetching order ${data.orderId}:`, error);
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // For non-admin users, verify they own the order
    if (authResult.role !== 'admin' && order.userId !== authResult.id) {
      return NextResponse.json(
        { error: 'Unauthorized to create payment for this order' },
        { status: 403 }
      );
    }

    // Create the payment record
    const now = new Date();

    const payment: Omit<Payment, '_id'> = {
      orderId: data.orderId,
      userId: order.userId || authResult.id,
      amount: data.amount,
      currency: data.currency,
      status: data.status || 'pending',
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails || {},
      transactionId: data.transactionId,
      createdAt: now,
      updatedAt: now,
      completedAt: data.status === 'completed' ? now : undefined,
    };

    const result = await db.collection('payments').insertOne(payment);

    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    // If payment status is completed, update order status
    if (payment.status === 'completed') {
      await db.collection('orders').updateOne(
        { _id: new ObjectId(data.orderId) },
        {
          $set: {
            status: 'processing',
            paymentStatus: 'paid',
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json(
      {
        message: 'Payment created successfully',
        paymentId: result.insertedId,
        payment: {
          ...payment,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
