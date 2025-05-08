import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Cart } from '@/types/cart';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Get the current user's cart
export async function GET(request: NextRequest) {
  try {
    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : authResult.id;

    const { db } = await connectToDatabase();

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;
    }

    let cart;
    if (userId) {
      // For authenticated users - find by userId
      cart = await db.collection('carts').findOne({ userId: userId });
    } else if (cartId) {
      // For guests - find by cart ID (stored in cookie)
      cart = await db.collection('carts').findOne({ _id: new ObjectId(cartId) });
    }

    // If no cart found, create an empty one
    if (!cart) {
      const newCart: Omit<Cart, '_id'> = {
        userId: userId || undefined,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // If no cart exists, return empty cart without saving it yet
      return NextResponse.json(newCart);
    }

    // If cart has items, populate diamond details
    if (cart.items && cart.items.length > 0) {
      const diamondIds = cart.items.map(
        (item: { diamondId: string }) => new ObjectId(item.diamondId)
      );
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      cart.items = cart.items.map((item: { diamondId: string; quantity: number }) => {
        const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
        return {
          ...item,
          diamond,
        };
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return NextResponse.json({ error: 'Failed to retrieve cart' }, { status: 500 });
  }
}

// Create or replace the entire cart
export async function POST(request: NextRequest) {
  try {
    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : authResult.id;

    const data = await request.json();
    if (!Array.isArray(data.items)) {
      return NextResponse.json(
        { error: 'Invalid cart data. Items must be an array.' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of data.items) {
      if (!item.diamondId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          {
            error:
              'Invalid item data. Each item must have a diamondId and a quantity greater than 0.',
          },
          { status: 400 }
        );
      }
    }

    const { db } = await connectToDatabase();

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;
    }

    const now = new Date();
    let cart;
    if (userId) {
      // For authenticated users - upsert by userId
      const result = await db.collection('carts').findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            items: data.items,
            updatedAt: now,
          },
          $setOnInsert: {
            userId: userId,
            createdAt: now,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
      cart = result?.value || null;
    } else if (cartId) {
      // For guests - update existing cart
      const result = await db.collection('carts').findOneAndUpdate(
        { _id: new ObjectId(cartId) },
        {
          $set: {
            items: data.items,
            updatedAt: now,
          },
        },
        { returnDocument: 'after' }
      );
      cart = result?.value || null;
    } else {
      // For new guests - create new cart and set cookie
      const result = await db.collection('carts').insertOne({
        items: data.items,
        createdAt: now,
        updatedAt: now,
      });

      cart = {
        _id: result.insertedId,
        items: data.items,
        createdAt: now,
        updatedAt: now,
      };

      // Create a new cookie for the guest with the cart ID
      const response = NextResponse.json(cart);
      response.cookies.set({
        name: 'cartId',
        value: result.insertedId.toString(),
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return response;
    }

    // Check if cart exists before trying to access its properties
    if (!cart) {
      // Create a default cart object if cart is null
      cart = {
        items: data.items,
        createdAt: now,
        updatedAt: now,
        userId: userId || undefined,
      };
    }

    // If items exist, populate diamond details
    if (cart.items && cart.items.length > 0) {
      const diamondIds = cart.items.map(
        (item: { diamondId: string }) => new ObjectId(item.diamondId)
      );
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      cart.items = cart.items.map((item: { diamondId: string; quantity: number }) => {
        const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
        return {
          ...item,
          diamond,
        };
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// Delete the entire cart
export async function DELETE(request: NextRequest) {
  try {
    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : authResult.id;

    const { db } = await connectToDatabase();

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;
    }

    if (userId) {
      // For authenticated users - delete by userId
      await db.collection('carts').deleteOne({ userId: userId });
    } else if (cartId) {
      // For guests - delete by cart ID (stored in cookie)
      await db.collection('carts').deleteOne({ _id: new ObjectId(cartId) });
    } else {
      return NextResponse.json({ message: 'No cart found to delete' });
    }

    // For guest users, clear the cookie
    if (!userId && cartId) {
      const response = NextResponse.json({ message: 'Cart deleted successfully' });
      response.cookies.delete('cartId');
      return response;
    }

    return NextResponse.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart:', error);
    return NextResponse.json({ error: 'Failed to delete cart' }, { status: 500 });
  }
}
