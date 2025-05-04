import { connectToDatabase } from '@/lib/mongodb';
import { Diamond } from '@/types/diamond';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET a single diamond by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const headersList = await headers();

    // Get host from request headers to build full URL
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid diamond ID format' }, { status: 400 });
    }

    const diamond = await db.collection('diamonds').findOne({ _id: new ObjectId(id) });

    if (!diamond) {
      return NextResponse.json({ error: 'Diamond not found' }, { status: 404 });
    }

    // Transform _id to string id
    const { _id, ...rest } = diamond;

    // Transform image path to full URL if it exists
    interface TransformedDiamond extends Omit<typeof rest, '_id'> {
      id: string;
      image?: string;
    }

    const transformedDiamond: TransformedDiamond = {
      id: _id.toString(),
      ...rest,
    };

    // If the diamond has an image field and it's not already a full URL
    if (transformedDiamond.image && !transformedDiamond.image.startsWith('http')) {
      // If the image is already a valid API path starting with /api
      if (transformedDiamond.image.startsWith('/api')) {
        transformedDiamond.image = `${baseUrl}${transformedDiamond.image}`;
      } else {
        // Ensure the image path starts with /api if it's just an ID
        if (!transformedDiamond.image.includes('/')) {
          transformedDiamond.image = `${baseUrl}/api/images/${transformedDiamond.image}`;
        }
      }
    }
    return NextResponse.json(transformedDiamond);
  } catch (error: unknown) {
    const { id } = await params;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Failed to fetch diamond with ID: ${id}`, error);
    return NextResponse.json(
      { error: 'Failed to fetch diamond', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a diamond
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updateData = (await request.json()) as Partial<Diamond>;
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid diamond ID format' }, { status: 400 });
    }

    // Don't allow updating the _id field
    if ('_id' in updateData) {
      delete updateData._id;
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    const result = await db
      .collection('diamonds')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json({ error: 'Diamond not found' }, { status: 404 });
    }

    // Transform _id to string id
    const { _id, ...rest } = result;
    const updatedDiamond = {
      id: _id.toString(),
      ...rest,
    };

    return NextResponse.json(updatedDiamond);
  } catch (error: unknown) {
    const { id } = await params;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Failed to update diamond with ID: ${id}`, error);
    return NextResponse.json(
      { error: 'Failed to update diamond', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE a diamond
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid diamond ID format' }, { status: 400 });
    }

    const result = await db.collection('diamonds').findOneAndDelete({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: 'Diamond not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Diamond deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const { id } = await params;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Failed to delete diamond with ID: ${id}`, error);
    return NextResponse.json(
      { error: 'Failed to delete diamond', details: errorMessage },
      { status: 500 }
    );
  }
}
