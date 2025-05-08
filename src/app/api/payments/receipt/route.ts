import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Authentication required
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    // Parse query parameters
    const url = new URL(request.url);
    const paymentId = url.searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get the payment
    let payment;
    try {
      payment = await db.collection('payments').findOne({ _id: new ObjectId(paymentId) });
    } catch (error) {
      console.error('Error fetching payment:', error);
      return NextResponse.json({ error: 'Invalid payment ID format' }, { status: 400 });
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check authorization - only admin or payment owner can access receipt
    if (authResult.role !== 'admin' && payment.userId !== authResult.id) {
      return NextResponse.json({ error: 'Unauthorized to access this receipt' }, { status: 403 });
    }

    // Get related order details
    const order = await db.collection('orders').findOne({ _id: new ObjectId(payment.orderId) });
    if (!order) {
      return NextResponse.json({ error: 'Related order not found' }, { status: 404 });
    }

    // Get user details
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(payment.userId) },
      { projection: { password: 0 } } // Exclude password
    );

    // Generate receipt data
    const receipt = {
      receiptNumber: `REC-${payment._id.toString().substring(0, 8).toUpperCase()}`,
      date: payment.completedAt || payment.updatedAt || payment.createdAt,
      paymentId: payment._id,
      orderId: payment.orderId,
      customer: {
        name: user ? `${user.firstName} ${user.lastName}` : 'Guest Customer',
        email: user ? user.email : payment.paymentDetails?.email || 'N/A',
        address: order.shippingAddress || payment.paymentDetails?.billingAddress || 'N/A',
      },
      items: order.items.map(
        (item: {
          diamond?: { name: string };
          diamondId: string;
          quantity: number;
          price: number;
        }) => ({
          name: item.diamond?.name || `Diamond ${item.diamondId}`,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })
      ),
      subtotal: order.items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      ),
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      total: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDetails: {
        status: payment.status,
        currency: payment.currency,
        cardLast4: payment.paymentDetails?.cardLast4 || 'N/A',
        cardBrand: payment.paymentDetails?.cardBrand || 'N/A',
        transactionId: payment.transactionId || 'N/A',
      },
      businessInfo: {
        name: 'Telos Diamonds',
        email: 'info@telosdiamonds.com',
        phone: '+1 (555) 123-4567',
        website: 'https://telosdiamonds.com',
        address: '123 Diamond Street, Gem City, GC 12345',
      },
    };

    return NextResponse.json(receipt);
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 });
  }
}
