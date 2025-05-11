import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers'; // Import cookies
import { NextRequest, NextResponse } from 'next/server';

interface AuthResult {
  userId: string; // Assuming this is a property if needed, but using 'id' as primary identifier from auth
  email: string;
  role: string;
  id: string; // Primary user identifier from the authentication result
}

// Process checkout from cart
export async function POST(request: NextRequest) {
  try {
    // Attempt to authenticate, but not strictly required for guest checkout
    const authSessionInfo = await authenticate(request, false); // Allow guest access

    if (authSessionInfo instanceof NextResponse) {
      // If authenticate returns NextResponse (e.g., for a malformed token, even if auth is optional),
      // it implies an issue that should prevent further processing.
      console.error(
        'Checkout: Authentication middleware returned an error response:',
        authSessionInfo
      );
      return authSessionInfo; // Propagate the error
    }

    // If authSessionInfo is null, it's a guest. If it's an AuthResult object, user is logged in.
    const userIdString = authSessionInfo ? (authSessionInfo as AuthResult).id : null;
    const userObjectId = userIdString ? new ObjectId(userIdString) : null;

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
    let cart: any = null; // Consider using a specific Cart type if available

    const cookieStore = cookies();
    const cartIdCookie = (await cookieStore).get('cartId'); // Assuming cookie name is 'cartId'

    if (userObjectId) {
      // User is authenticated
      if (cartIdCookie && ObjectId.isValid(cartIdCookie.value)) {
        const potentialCart = await db
          .collection('carts')
          .findOne({ _id: new ObjectId(cartIdCookie.value) });
        if (potentialCart) {
          if (!potentialCart.userId) {
            // Cart from cookie is a guest cart
            // Associate this guest cart with the now logged-in user
            await db
              .collection('carts')
              .updateOne(
                { _id: potentialCart._id },
                { $set: { userId: userObjectId, updatedAt: new Date() } }
              );
            potentialCart.userId = userObjectId; // Update in-memory object
            cart = potentialCart;
          } else if (potentialCart.userId.equals(userObjectId)) {
            // Cart from cookie already belongs to this user
            cart = potentialCart;
          }
          // If potentialCart.userId exists but doesn't match userObjectId, it's treated as not the user's active cart.
          // The code will then attempt to find a cart by userId directly.
        }
      }
      // If no suitable cart from cookie, try finding cart by userId
      if (!cart) {
        cart = await db.collection('carts').findOne({ userId: userObjectId });
      }
    } else {
      // User is a guest
      if (cartIdCookie && ObjectId.isValid(cartIdCookie.value)) {
        const guestCart = await db
          .collection('carts')
          .findOne({ _id: new ObjectId(cartIdCookie.value) });
        if (guestCart && !guestCart.userId) {
          // Ensure it's a guest cart
          cart = guestCart;
        }
      }
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      const errorMessage = userObjectId
        ? 'Cart is empty or not found for user'
        : 'Cart is empty or not found for guest';
      return NextResponse.json(
        {
          error: errorMessage,
          details: 'No active cart could be identified or cart is empty.',
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
    const orderItems: any[] = []; // Initialize as any[] or a more specific type

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
    const orderToInsert = {
      userId: userObjectId, // This can be null for guest orders
      items: orderItems,
      totalPrice,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      status: 'pending' as const, // Added 'as const' for type safety if OrderStatus is a union
      createdAt: now,
      updatedAt: now,
    };

    // Insert the order
    const orderResult = await db.collection('orders').insertOne(orderToInsert);

    if (!orderResult.acknowledged) {
      return NextResponse.json(
        {
          error: 'Failed to create order',
        },
        { status: 500 }
      );
    }

    // Clear the cart after successful checkout using the specific cart's _id
    if (cart && cart._id) {
      await db.collection('carts').deleteOne({ _id: new ObjectId(cart._id) });
    }

    // Update diamond stock status if needed
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
        ...orderToInsert,
        _id: orderResult.insertedId,
      },
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to process checkout', details: errorMessage },
      { status: 500 }
    );
  }
}
