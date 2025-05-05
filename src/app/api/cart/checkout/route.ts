import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

interface AuthResult {
  userId: string;
  email: string;
  role: string;
  id: string;
}

// Process checkout from cart
export async function POST(request: NextRequest) {
  try {
    // For checkout, user should be authenticated
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const userId = (authResult as AuthResult).id;
    const data = await request.json();

    // Extract shipping and billing details from request
    const {
      shippingAddress,
      billingAddress = shippingAddress, // Default billing to shipping if not provided
      paymentMethod,
      notes,
    } = data;

    if (!shippingAddress) {
      return NextResponse.json(
        {
          error: 'Shipping address is required',
        },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        {
          error: 'Payment method is required',
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get user's cart
    const cart = await db.collection('carts').findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        {
          error: 'Cart is empty',
        },
        { status: 400 }
      );
    }

    // Fetch the diamonds to calculate the total price and validate availability
    const diamondIds = cart.items.map((item: any) => new ObjectId(item.diamondId));
    const diamonds = await db
      .collection('diamonds')
      .find({
        _id: { $in: diamondIds },
      })
      .toArray();

    // Check if all items in the cart are available and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);

      if (!diamond) {
        return NextResponse.json(
          {
            error: `Diamond with ID ${item.diamondId} not found`,
          },
          { status: 400 }
        );
      }

      if (!diamond.inStock) {
        return NextResponse.json(
          {
            error: `Diamond ${diamond.name || diamond._id} is out of stock`,
          },
          { status: 400 }
        );
      }

      const itemPrice = diamond.price * item.quantity;
      totalPrice += itemPrice;

      orderItems.push({
        diamondId: item.diamondId,
        quantity: item.quantity,
        price: diamond.price,
        totalPrice: itemPrice,
        diamond: {
          _id: diamond._id,
          name: diamond.name,
          cut: diamond.cut,
          color: diamond.color,
          clarity: diamond.clarity,
          carat: diamond.carat,
          price: diamond.price,
          image: diamond.image,
        },
      });
    }

    // Create the order
    const now = new Date();
    const order = {
      userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    // Insert the order
    const orderResult = await db.collection('orders').insertOne(order);

    if (!orderResult.acknowledged) {
      return NextResponse.json(
        {
          error: 'Failed to create order',
        },
        { status: 500 }
      );
    }

    // Clear the cart after successful checkout
    await db.collection('carts').deleteOne({ userId });

    // Update diamond stock status if needed
    // This can be done asynchronously or in a transaction if supported
    for (const item of cart.items) {
      await db.collection('diamonds').updateOne(
        { _id: new ObjectId(item.diamondId) },
        {
          $set: {
            inStock: false, // Mark as sold
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json({
      message: 'Checkout successful',
      orderId: orderResult.insertedId,
      order: {
        ...order,
        _id: orderResult.insertedId,
      },
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}
