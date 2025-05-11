import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { OrderStatus } from '@/types/order';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Update order status - admin only
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate as admin
    const authResult = await authenticate(request, true); // true means admin-only
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const { id } = await params;
    const data = await request.json();
    const { db } = await connectToDatabase();

    // Validate the order ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    // Validate status field
    if (!data.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Validate status value
    const validStatuses: OrderStatus[] = [
      OrderStatus.Pending,
      OrderStatus.Processing,
      OrderStatus.Shipped,
      OrderStatus.Delivered,
      OrderStatus.Refunded,
    ];
    if (!validStatuses.includes(data.status as OrderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status value. Status must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Get current order
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create status history entry
    const statusUpdate = {
      status: data.status,
      timestamp: new Date(),
      updatedBy: authResult.userId,
      notes: data.notes || '',
    };

    // Prepare update data
    const updateData: any = {
      status: data.status,
      updatedAt: new Date(),
    };

    // Optional tracking info
    if (data.trackingNumber) {
      updateData.trackingNumber = data.trackingNumber;
    }
    if (data.shippingCarrier) {
      updateData.shippingCarrier = data.shippingCarrier;
    }
    if (data.notes) {
      updateData.statusNotes = data.notes;
    }

    // Handle status history array
    const statusHistory = order.statusHistory || [];
    statusHistory.push(statusUpdate);
    updateData.statusHistory = statusHistory;

    // Update the order
    await db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    // Get the updated order
    const updatedOrder = await db.collection('orders').findOne({ _id: new ObjectId(id) });

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Failed to retrieve updated order' }, { status: 500 });
    }

    // Transform _id to string id
    const { _id, ...rest } = updatedOrder;
    const transformedOrder = {
      id: _id.toString(),
      ...rest,
    };

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: transformedOrder,
    });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Failed to update status for order ID: ${id}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update order status', details: errorMessage },
      { status: 500 }
    );
  }
}
