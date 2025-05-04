import { deleteFileFromGridFS, getFileFromGridFS } from '@/lib/gridfs';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Handler for retrieving images by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid image ID format' }, { status: 400 });
    }

    // Get the file from GridFS
    const { buffer, contentType } = await getFileFromGridFS(id);

    // Return the image with appropriate content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Failed to fetch image with ID: ${id}`, error);

    // Check if error is a known error with a 'message' property
    if (error instanceof Error) {
      if (error.message === 'File not found') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch image', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch image', details: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// Handler for deleting images by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid image ID format' }, { status: 400 });
    }

    // Delete the file from GridFS
    await deleteFileFromGridFS(id);

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Failed to delete image with ID: ${id}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete image', details: errorMessage },
      { status: 500 }
    );
  }
}
