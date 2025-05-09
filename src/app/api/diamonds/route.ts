import { connectToDatabase } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Clarity, Diamond } from '@/types/diamond';
import { Sort } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET all diamonds with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();

    // Build filter from query params
    const filter: Record<
      string,
      string | number | boolean | { $gte?: number; $lte?: number } | { $in?: string[] }
    > = {};

    // Apply filters if they exist in query params
    if (searchParams.has('shape')) {
      const shape = searchParams.get('shape');
      if (shape !== null) filter.shape = shape;
    }

    // Correctly handle caratMin and caratMax
    const caratFilter: { $gte?: number; $lte?: number } = {};
    let hasCaratFilter = false;

    if (searchParams.has('caratMin')) {
      const caratMinValue = searchParams.get('caratMin');
      if (caratMinValue !== null) {
        caratFilter.$gte = parseFloat(caratMinValue);
        hasCaratFilter = true;
      }
    }
    if (searchParams.has('caratMax')) {
      const caratMaxValue = searchParams.get('caratMax');
      if (caratMaxValue !== null) {
        caratFilter.$lte = parseFloat(caratMaxValue);
        hasCaratFilter = true;
      }
    }

    if (hasCaratFilter) {
      filter.carat = caratFilter;
    }

    // Handle colorMin and colorMax
    const colorOrder = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const colorMin = searchParams.get('colorMin');
    const colorMax = searchParams.get('colorMax');

    if (colorMin && colorMax) {
      const minIndex = colorOrder.indexOf(colorMin);
      const maxIndex = colorOrder.indexOf(colorMax);
      if (minIndex !== -1 && maxIndex !== -1 && minIndex <= maxIndex) {
        filter.color = { $in: colorOrder.slice(minIndex, maxIndex + 1) };
      }
    } else if (colorMin) {
      const minIndex = colorOrder.indexOf(colorMin);
      if (minIndex !== -1) {
        filter.color = { $in: colorOrder.slice(minIndex) };
      }
    } else if (colorMax) {
      const maxIndex = colorOrder.indexOf(colorMax);
      if (maxIndex !== -1) {
        filter.color = { $in: colorOrder.slice(0, maxIndex + 1) };
      }
    }

    // Handle clarityMin and clarityMax
    const clarityOrder: Clarity[] = [
      'FL',
      'IF',
      'VVS1',
      'VVS2',
      'VS1',
      'VS2',
      'SI1',
      'SI2',
      'I1',
      'I2',
      'I3',
    ];
    const clarityMin = searchParams.get('clarityMin');
    const clarityMax = searchParams.get('clarityMax');

    if (clarityMin && clarityMax) {
      const minIndex = clarityOrder.indexOf(clarityMin as Clarity);
      const maxIndex = clarityOrder.indexOf(clarityMax as Clarity);
      if (minIndex !== -1 && maxIndex !== -1 && minIndex <= maxIndex) {
        filter.clarity = { $in: clarityOrder.slice(minIndex, maxIndex + 1) };
      }
    } else if (clarityMin) {
      const minIndex = clarityOrder.indexOf(clarityMin as Clarity);
      if (minIndex !== -1) {
        filter.clarity = { $in: clarityOrder.slice(minIndex) };
      }
    } else if (clarityMax) {
      const maxIndex = clarityOrder.indexOf(clarityMax as Clarity);
      if (maxIndex !== -1) {
        filter.clarity = { $in: clarityOrder.slice(0, maxIndex + 1) };
      }
    } else if (searchParams.has('clarity')) {
      // Keep existing single clarity filter
      const clarity = searchParams.get('clarity');
      if (clarity !== null) filter.clarity = clarity;
    }

    if (searchParams.has('cut')) {
      const cut = searchParams.get('cut');
      if (cut !== null) filter.cut = cut;
    }

    // Handle priceMin and priceMax
    const priceFilter: { $gte?: number; $lte?: number } = {};
    let hasPriceFilter = false;

    if (searchParams.has('minPrice')) {
      const minPriceValue = searchParams.get('minPrice');
      if (minPriceValue !== null) {
        priceFilter.$gte = parseFloat(minPriceValue);
        hasPriceFilter = true;
      }
    }

    if (searchParams.has('maxPrice')) {
      const maxPriceValue = searchParams.get('maxPrice');
      if (maxPriceValue !== null) {
        priceFilter.$lte = parseFloat(maxPriceValue);
        hasPriceFilter = true;
      }
    }

    if (hasPriceFilter) {
      filter.price = priceFilter;
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
    // Authenticate as admin
    const authResult = await authenticate(request, true); // true means admin-only
    if (authResult instanceof NextResponse) {
      return authResult; // Auth failed, return error response
    }

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

    // Create the response object with the server-generated id and all relevant properties
    // We don't need to extract the id from the diamond object, we can just use spread
    // and then override it with our server-generated id
    const createdDiamond = {
      ...diamond, // This includes all diamond properties
      id: result.insertedId.toString(), // This overrides any client-provided id
      createdAt: timestamp,
      updatedAt: timestamp,
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
