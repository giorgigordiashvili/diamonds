import { post } from './client';

export interface UploadResponse {
  fileId: string;
  url: string;
  success: boolean;
}

/**
 * Upload an image file
 *
 * @param file The file to upload
 * @param type Optional type/category of the upload (e.g., 'diamond', 'profile', etc.)
 * @returns Upload response with file ID and URL
 */
export async function uploadImage(file: File, type: string = 'diamond'): Promise<UploadResponse> {
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  // Custom request that doesn't use JSON
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Upload failed');
  }

  return response.json();
}

/**
 * Delete an uploaded image
 *
 * @param fileId ID of the file to delete
 * @returns Success status
 */
export function deleteImage(fileId: string): Promise<{ success: boolean }> {
  return post<{ success: boolean }>('/api/upload/delete', { fileId }, { requireAuth: true });
}
