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

// Merge a guest cart (from cookie) with a user's cart after login
export async function POST(request: NextRequest) {
  try {
    // Authentication is required for merging carts
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    const userId = (authResult as AuthResult).id;

    // Get the guest cart ID from the request body or cookie
    const data = await request.json().catch(() => ({}));
    let guestCartId = data.guestCartId;

    if (!guestCartId) {
      const cartCookie = request.cookies.get('cartId');
      guestCartId = cartCookie?.value;
    }

    if (!guestCartId) {
      return NextResponse.json({
        message: 'No guest cart to merge',
      });
    }

    const { db } = await connectToDatabase();

    // Find the guest cart
    const guestCart = await db.collection('carts').findOne({
      _id: new ObjectId(guestCartId),
    });

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      // No items in guest cart, nothing to merge

      // Clean up by deleting the empty guest cart
      await db.collection('carts').deleteOne({
        _id: new ObjectId(guestCartId),
      });

      // Clear the cookie
      const response = NextResponse.json({
        message: 'No items in guest cart to merge',
      });
      response.cookies.delete('cartId');
      return response;
    }

    // Find the user's cart
    const userCart = await db.collection('carts').findOne({ userId });
    const now = new Date();

    if (!userCart) {
      // If user doesn't have a cart, convert the guest cart to a user cart
      await db.collection('carts').updateOne(
        { _id: new ObjectId(guestCartId) },
        {
          $set: {
            userId,
            updatedAt: now,
          },
        }
      );
    } else {
      // Merge items from guest cart into user cart

      // First, create a map of existing items in the user cart for quick lookup
      const existingItems = new Map();
      userCart.items.forEach((item: any) => {
        existingItems.set(item.diamondId, item);
      });

      // Process items from guest cart
      const updatedItems = [...userCart.items];

      for (const item of guestCart.items) {
        if (existingItems.has(item.diamondId)) {
          // Item already exists in user cart, update quantity
          const existingItem = existingItems.get(item.diamondId);
          existingItem.quantity += item.quantity;
        } else {
          // New item, add to user cart
          updatedItems.push(item);
        }
      }

      // Update the user's cart with merged items
      await db.collection('carts').updateOne(
        { userId },
        {
          $set: {
            items: updatedItems,
            updatedAt: now,
          },
        }
      );

      // Delete the guest cart
      await db.collection('carts').deleteOne({
        _id: new ObjectId(guestCartId),
      });
    }

    // Get the updated cart to return
    const updatedCart = await db.collection('carts').findOne({ userId });

    // If cart has items, populate diamond details
    let cartWithDetails = updatedCart;

    if (updatedCart && updatedCart.items && updatedCart.items.length > 0) {
      const diamondIds = updatedCart.items.map((item: any) => new ObjectId(item.diamondId));
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      cartWithDetails = {
        ...updatedCart,
        items: updatedCart.items.map((item: any) => {
          const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
          return {
            ...item,
            diamond,
          };
        }),
      };
    }

    // Clear the cart cookie
    const response = NextResponse.json({
      message: 'Carts merged successfully',
      cart: cartWithDetails,
    });
    response.cookies.delete('cartId');
    return response;
  } catch (error) {
    console.error('Error merging carts:', error);
    return NextResponse.json({ error: 'Failed to merge carts' }, { status: 500 });
  }
}
