import { GridFSBucket, ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';

export async function uploadFileToGridFS(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
) {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Create GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: 'diamondImages',
    });

    // Create a unique filename to avoid conflicts
    const uniqueFilename = `${Date.now()}-${filename}`;

    // Upload file to GridFS
    return new Promise<string>((resolve, reject) => {
      // Create upload stream
      const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType,
      });

      // Handle upload events
      uploadStream.on('error', (error) => {
        console.error('Error uploading to GridFS:', error);
        reject(error);
      });

      uploadStream.on('finish', () => {
        // Return the ID of the uploaded file
        resolve(uploadStream.id.toString());
      });

      // Write the buffer to the upload stream
      uploadStream.write(fileBuffer);
      uploadStream.end();
    });
  } catch (error) {
    console.error('Failed to upload to GridFS:', error);
    throw error;
  }
}

export async function getFileFromGridFS(fileId: string) {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Create GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: 'diamondImages',
    });

    // Find file metadata
    const file = await db.collection('diamondImages.files').findOne({ _id: new ObjectId(fileId) });

    if (!file) {
      throw new Error('File not found');
    }

    // Create download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    // Convert stream to buffer
    return new Promise<{ buffer: Buffer; contentType: string }>((resolve, reject) => {
      const chunks: Buffer[] = [];

      downloadStream.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
      });

      downloadStream.on('error', (error) => {
        reject(error);
      });

      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          contentType: file.contentType || 'application/octet-stream',
        });
      });
    });
  } catch (error) {
    console.error('Failed to download from GridFS:', error);
    throw error;
  }
}

export async function deleteFileFromGridFS(fileId: string) {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Create GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: 'diamondImages',
    });

    // Delete file
    await bucket.delete(new ObjectId(fileId));
    return true;
  } catch (error) {
    console.error('Failed to delete from GridFS:', error);
    throw error;
  }
}
