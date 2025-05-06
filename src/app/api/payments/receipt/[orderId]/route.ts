import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Generate payment receipt for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Authentication is required for generating receipts
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

    // Check if payment info exists
    if (!order.paymentInfo || order.paymentInfo.paymentStatus !== 'confirmed') {
      return NextResponse.json(
        { error: 'No confirmed payment found for this order' },
        { status: 400 }
      );
    }

    // Format date
    const paymentDate = order.paymentInfo.paymentDate
      ? new Date(order.paymentInfo.paymentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    // Generate receipt data
    const receipt = {
      receiptNumber: `RCPT-${Date.now()}`,
      orderNumber: order._id.toString(),
      customerName: order.customerName,
      customerEmail: order.email,
      customerAddress: order.shippingAddress,
      paymentMethod: order.paymentInfo.paymentMethod,
      paymentReference: order.paymentInfo.paymentReference,
      paymentDate: paymentDate,
      paymentStatus: 'Paid',
      amount: order.paymentInfo.paymentAmount || order.totalAmount,
      currency: 'USD',
      items: order.items.map((item: any) => ({
        description: item.diamond?.name || `Diamond (${item.diamondId})`,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.quantity * item.price,
      })),
      subtotal: order.totalAmount,
      total: order.totalAmount,
      note: 'Thank you for your purchase!',
      company: {
        name: 'Diamond Store',
        address: '123 Jewelry Lane, Gem City, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'support@diamondstore.example',
        website: 'www.diamondstore.example',
      },
    };

    // Save receipt in database
    await db.collection('receipts').insertOne({
      orderId: order._id,
      userId: order.userId,
      receipt,
      createdAt: new Date(),
    });

    return NextResponse.json(receipt);
  } catch (error: unknown) {
    const { orderId } = await params;
    console.error(`Failed to generate receipt for order ID: ${orderId}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate receipt', details: errorMessage },
      { status: 500 }
    );
  }
}
