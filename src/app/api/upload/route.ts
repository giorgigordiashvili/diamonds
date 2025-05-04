import { uploadFileToGridFS } from '@/lib/gridfs';
import { NextRequest, NextResponse } from 'next/server';

// Disable default body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler for image uploads
export async function POST(request: NextRequest) {
  try {
    // This uses the ReadableStream API to handle the file upload
    const formData = await request.formData();

    // Get the file from form data
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to GridFS
    const fileId = await uploadFileToGridFS(fileBuffer, file.name, file.type);

    // Return success with the file ID
    return NextResponse.json({
      success: true,
      fileId,
      url: `/api/images/${fileId}`,
    });
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to upload file', details: errorMessage },
      { status: 500 }
    );
  }
}
