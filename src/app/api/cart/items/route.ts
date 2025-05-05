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

// Add an item to the cart
export async function POST(request: NextRequest) {
  try {
    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : (authResult as AuthResult).id;

    const data = await request.json();

    // Validate item data
    if (!data.diamondId || typeof data.quantity !== 'number' || data.quantity < 1) {
      return NextResponse.json(
        {
          error: 'Invalid item data. Item must have a diamondId and a quantity greater than 0.',
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if the diamond exists
    const diamond = await db.collection('diamonds').findOne({ _id: new ObjectId(data.diamondId) });
    if (!diamond) {
      return NextResponse.json({ error: 'Diamond not found' }, { status: 404 });
    }

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;
    }

    const now = new Date();
    let result;

    const itemToAdd = {
      diamondId: data.diamondId,
      quantity: data.quantity,
    };

    if (userId) {
      // For authenticated users - first check if cart exists
      const cart = await db.collection('carts').findOne({ userId: userId });

      if (!cart) {
        // Create new cart
        const newCart = {
          userId: userId,
          items: [itemToAdd],
          createdAt: now,
          updatedAt: now,
        };

        await db.collection('carts').insertOne(newCart);

        // Get the cart with the item
        result = await db.collection('carts').findOne({ userId: userId });
      } else {
        // Update existing cart - add item
        const updatedItems = [...cart.items, itemToAdd];

        result = await db.collection('carts').findOneAndUpdate(
          { userId: userId },
          {
            $set: {
              items: updatedItems,
              updatedAt: now,
            },
          },
          { returnDocument: ReturnDocument.AFTER }
        );
      }
    } else if (cartId) {
      // For guests - get cart first
      const cart = await db.collection('carts').findOne({ _id: new ObjectId(cartId) });

      if (cart) {
        // Update existing cart - add item
        const updatedItems = [...cart.items, itemToAdd];

        result = await db.collection('carts').findOneAndUpdate(
          { _id: new ObjectId(cartId) },
          {
            $set: {
              items: updatedItems,
              updatedAt: now,
            },
          },
          { returnDocument: ReturnDocument.AFTER }
        );
      }
    } else {
      // For new guests - create new cart and set cookie
      const newCart = {
        items: [
          {
            diamondId: data.diamondId,
            quantity: data.quantity,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      const insertResult = await db.collection('carts').insertOne(newCart);

      // Create a new cookie for the guest with the cart ID
      const response = NextResponse.json({
        message: 'Item added to cart successfully',
        cart: {
          _id: insertResult.insertedId,
          ...newCart,
          items: [
            {
              diamondId: data.diamondId,
              quantity: data.quantity,
              diamond: diamond,
            },
          ],
        },
      });

      response.cookies.set({
        name: 'cartId',
        value: insertResult.insertedId.toString(),
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return response;
    }

    // Get the cart data from result, handling different result formats
    const cart = result?.value || result;

    // If cart has items, populate diamond details
    if (cart && cart.items && cart.items.length > 0) {
      const diamondIds = cart.items.map((item: any) => new ObjectId(item.diamondId));
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      cart.items = cart.items.map((item: any) => {
        const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
        return {
          ...item,
          diamond,
        };
      });
    }

    return NextResponse.json({
      message: 'Item added to cart successfully',
      cart: cart,
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
