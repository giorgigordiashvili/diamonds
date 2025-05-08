import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Get all carts (admin only)
export async function GET(request: NextRequest) {
  try {
    // Only allow admin users to access all carts
    const authResult = await authenticate(request, true);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

    // Check if user is admin
    if (authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { db } = await connectToDatabase();

    const carts = await db.collection('carts').find({}).toArray();

    // For each cart, populate user details if userId exists
    const cartsWithDetails = await Promise.all(
      carts.map(async (cart) => {
        if (cart.userId) {
          const user = await db.collection('users').findOne(
            { _id: new ObjectId(cart.userId) },
            { projection: { password: 0 } } // Exclude password
          );
          return {
            ...cart,
            user: user || undefined,
          };
        }
        return cart;
      })
    );

    // If cart has items, populate diamond details
    for (const cart of cartsWithDetails) {
      if (cart.items && cart.items.length > 0) {
        const diamondIds = cart.items
          .map((item: { diamondId: string }) => {
            try {
              return new ObjectId(item.diamondId);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              console.warn(`Invalid diamond ID: ${item.diamondId}`);
              return null;
            }
          })
          .filter((id: ObjectId | null) => id !== null);

        const diamonds = await db
          .collection('diamonds')
          .find({
            _id: { $in: diamondIds },
          })
          .toArray();

        // Attach diamond details to cart items
        cart.items = cart.items.map((item: { diamondId: string; [key: string]: any }) => {
          const diamond = diamonds.find((d) => d._id.toString() === item.diamondId);
          return {
            ...item,
            diamond: diamond || undefined,
          };
        });
      }
    }

    return NextResponse.json({
      carts: cartsWithDetails,
      total: cartsWithDetails.length,
    });
  } catch (error) {
    console.error('Error retrieving carts:', error);
    return NextResponse.json({ error: 'Failed to retrieve carts' }, { status: 500 });
  }
}
