import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { CartItem } from '@/types/cart';
import { ObjectId, Document, UpdateFilter } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Update a specific item in the cart
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ diamondId: string }> }
) {
  try {
    const diamondId = (await params).diamondId;

    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : authResult.id;

    const data = await request.json();

    // Validate quantity
    if (typeof data.quantity !== 'number' || data.quantity < 1) {
      return NextResponse.json(
        {
          error: 'Quantity must be a number greater than 0',
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if the diamond exists
    const diamond = await db.collection('diamonds').findOne({ _id: new ObjectId(diamondId) });
    if (!diamond) {
      return NextResponse.json({ error: 'Diamond not found' }, { status: 404 });
    }

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;

      if (!cartId) {
        return NextResponse.json({ error: 'No cart found' }, { status: 404 });
      }
    }

    const now = new Date();
    let result;

    if (userId) {
      // For authenticated users - update by userId
      result = await db.collection('carts').findOneAndUpdate(
        {
          userId: userId,
          'items.diamondId': diamondId,
        },
        {
          $set: {
            'items.$.quantity': data.quantity,
            updatedAt: now,
          },
        },
        { returnDocument: 'after' }
      );
    } else {
      // For guests - update by cart ID
      result = await db.collection('carts').findOneAndUpdate(
        {
          _id: cartId ? new ObjectId(cartId) : undefined,
          'items.diamondId': diamondId,
        },
        {
          $set: {
            'items.$.quantity': data.quantity,
            updatedAt: now,
          },
        },
        { returnDocument: 'after' }
      );
    }

    if (!result || !result.value) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    const cart = result.value;

    // Populate diamond details
    if (cart.items && cart.items.length > 0) {
      const diamondIds = cart.items.map((item: CartItem) => new ObjectId(item.diamondId));
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      cart.items = cart.items.map((item: CartItem) => {
        const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
        return {
          ...item,
          diamond,
        };
      });
    }

    return NextResponse.json({
      message: 'Cart item updated successfully',
      cart: cart,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// Remove an item from the cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ diamondId: string }> }
) {
  try {
    const diamondId = (await params).diamondId;

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

      if (!cartId) {
        return NextResponse.json({ error: 'No cart found' }, { status: 404 });
      }
    }

    const now = new Date();
    let result;

    if (userId) {
      // For authenticated users - remove item by userId
      const update = {
        $pull: {
          items: { diamondId },
        },
        $set: { updatedAt: now },
      } as unknown as UpdateFilter<Document>;

      result = await db
        .collection('carts')
        .findOneAndUpdate({ userId: userId }, update, { returnDocument: 'after' });
    } else {
      // For guests - remove item by cart ID
      if (!cartId) {
        return NextResponse.json({ error: 'No cart found' }, { status: 404 });
      }

      const update = {
        $pull: {
          items: { diamondId },
        },
        $set: { updatedAt: now },
      } as unknown as UpdateFilter<Document>;

      result = await db
        .collection('carts')
        .findOneAndUpdate({ _id: new ObjectId(cartId) }, update, { returnDocument: 'after' });
    }

    if (!result || !result.value) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cart = result.value;

    // Populate diamond details
    if (cart.items && cart.items.length > 0) {
      const diamondIds = cart.items.map((item: CartItem) => new ObjectId(item.diamondId));
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      cart.items = cart.items.map((item: CartItem) => {
        const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
        return {
          ...item,
          diamond,
        };
      });
    }

    return NextResponse.json({
      message: 'Item removed from cart successfully',
      cart: cart,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
