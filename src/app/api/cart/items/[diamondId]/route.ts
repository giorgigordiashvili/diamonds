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

// Update an item in the cart
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ diamondId: string }> }
) {
  try {
    const diamondId = (await params).diamondId;
    if (!diamondId) {
      return NextResponse.json({ error: 'Diamond ID is required' }, { status: 400 });
    }

    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : (authResult as AuthResult).id;

    const data = await request.json();

    // Validate item data
    if (typeof data.quantity !== 'number' || data.quantity < 1) {
      return NextResponse.json(
        {
          error: 'Invalid item data. Quantity must be a number greater than 0.',
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;
    }

    if (!userId && !cartId) {
      return NextResponse.json({ error: 'No cart found' }, { status: 404 });
    }

    const now = new Date();
    let result;

    const updateQuery = {
      $set: {
        'items.$[elem].quantity': data.quantity,
        updatedAt: now,
      },
    };

    const updateOptions = {
      arrayFilters: [{ 'elem.diamondId': diamondId }],
      returnDocument: ReturnDocument.AFTER,
    };

    if (userId) {
      // For authenticated users - update by userId
      result = await db
        .collection('carts')
        .findOneAndUpdate({ userId: userId }, updateQuery, updateOptions);
    } else {
      // For guests - update by cart ID
      result = await db
        .collection('carts')
        .findOneAndUpdate({ _id: new ObjectId(cartId!) }, updateQuery, updateOptions);
    }

    if (!result?.value) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    const cart = result.value;

    // If cart has items, populate diamond details
    if (cart.items && cart.items.length > 0) {
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
    if (!diamondId) {
      return NextResponse.json({ error: 'Diamond ID is required' }, { status: 400 });
    }

    // Authentication is optional - both logged in users and guests can have carts
    const authResult = await authenticate(request, false);
    // Get userId if authenticated, otherwise use null
    const userId = authResult instanceof NextResponse ? null : (authResult as AuthResult).id;

    const { db } = await connectToDatabase();

    // Use a cart ID from cookie if it exists for guest users
    let cartId: string | null = null;
    if (!userId) {
      const cartCookie = request.cookies.get('cartId');
      cartId = cartCookie?.value || null;
    }

    if (!userId && !cartId) {
      return NextResponse.json({ error: 'No cart found' }, { status: 404 });
    }

    const now = new Date();
    let cart;

    // First, get the current cart
    if (userId) {
      cart = await db.collection('carts').findOne({ userId: userId });
    } else {
      cart = await db.collection('carts').findOne({ _id: new ObjectId(cartId!) });
    }

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Filter out the item to remove
    const updatedItems = cart.items.filter((item: any) => item.diamondId !== diamondId);

    // Update the cart with the filtered items
    let result;
    const updateOperation = {
      $set: {
        items: updatedItems,
        updatedAt: now,
      },
    };

    if (userId) {
      result = await db.collection('carts').findOneAndUpdate({ userId: userId }, updateOperation, {
        returnDocument: ReturnDocument.AFTER,
      });
    } else {
      result = await db
        .collection('carts')
        .findOneAndUpdate({ _id: new ObjectId(cartId!) }, updateOperation, {
          returnDocument: ReturnDocument.AFTER,
        });
    }

    if (!result?.value) {
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

    const updatedCart = result.value;

    // If cart has items, populate diamond details
    if (updatedCart.items && updatedCart.items.length > 0) {
      const diamondIds = updatedCart.items.map((item: any) => new ObjectId(item.diamondId));
      const diamonds = await db
        .collection('diamonds')
        .find({
          _id: { $in: diamondIds },
        })
        .toArray();

      // Attach diamond details to cart items
      updatedCart.items = updatedCart.items.map((item: any) => {
        const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
        return {
          ...item,
          diamond,
        };
      });
    }

    return NextResponse.json({
      message: 'Item removed from cart successfully',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}
