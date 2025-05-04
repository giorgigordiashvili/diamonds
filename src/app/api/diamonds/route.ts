import { connectToDatabase } from '@/lib/mongodb';
import { Diamond } from '@/types/diamond';
import { Sort } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET all diamonds with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();

    // Build filter from query params
    const filter: Record<string, string | number | boolean | { $gte?: number; $lte?: number }> = {};

    // Apply filters if they exist in query params
    if (searchParams.has('shape')) {
      const shape = searchParams.get('shape');
      if (shape !== null) filter.shape = shape;
    }
    if (searchParams.has('minCarat') || searchParams.has('maxCarat')) {
      filter.carat = {};
      if (searchParams.has('minCarat')) {
        filter.carat.$gte = parseFloat(searchParams.get('minCarat') as string);
      }
      if (searchParams.has('maxCarat')) {
        filter.carat.$lte = parseFloat(searchParams.get('maxCarat') as string);
      }
    }
    if (searchParams.has('color')) {
      const color = searchParams.get('color');
      if (color !== null) filter.color = color;
    }
    if (searchParams.has('clarity')) {
      const clarity = searchParams.get('clarity');
      if (clarity !== null) filter.clarity = clarity;
    }
    if (searchParams.has('cut')) {
      const cut = searchParams.get('cut');
      if (cut !== null) filter.cut = cut;
    }
    if (searchParams.has('minPrice')) {
      filter.price = filter.price && typeof filter.price === 'object' ? filter.price : {};
      filter.price.$gte = parseFloat(searchParams.get('minPrice') as string);
    }
    if (searchParams.has('maxPrice')) {
      filter.price = filter.price && typeof filter.price === 'object' ? filter.price : {};
      filter.price.$lte = parseFloat(searchParams.get('maxPrice') as string);
    }
    if (searchParams.has('featured')) filter.featured = searchParams.get('featured') === 'true';

    // Handle pagination
    const page = searchParams.has('page') ? parseInt(searchParams.get('page') as string) : 1;
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit') as string) : 20;
    const skip = (page - 1) * limit;

    // Handle sorting
    const sortField = searchParams.get('sortBy') || 'price';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const sort: Sort = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Get total count (for pagination)
    const total = await db.collection('diamonds').countDocuments(filter);

    // Get diamonds
    const diamonds = await db
      .collection('diamonds')
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Transform _id to string id for each diamond
    const transformedDiamonds = diamonds.map((diamond) => {
      // Create a string ID from ObjectId and remove the _id
      const { _id, ...rest } = diamond;
      return {
        id: _id.toString(),
        ...rest,
      };
    });

    return NextResponse.json({
      diamonds: transformedDiamonds,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error('Failed to fetch diamonds:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch diamonds', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST a new diamond
export async function POST(request: NextRequest) {
  try {
    const diamond = (await request.json()) as Diamond;
    const { db } = await connectToDatabase();

    // Validate required fields
    const requiredFields = [
      'name',
      'shape',
      'carat',
      'color',
      'clarity',
      'cut',
      'polish',
      'symmetry',
      'fluorescence',
      'certificate',
      'price',
    ];
    const missingFields = requiredFields.filter((field) => !(field in diamond));

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Add timestamps
    const timestamp = new Date();
    const newDiamond = {
      ...diamond,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const result = await db.collection('diamonds').insertOne(newDiamond);

    // Return the created diamond with the id
    const createdDiamond = {
      id: result.insertedId.toString(),
      ...newDiamond,
    };

    return NextResponse.json(createdDiamond, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create diamond:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create diamond', details: errorMessage },
      { status: 500 }
    );
  }
}
