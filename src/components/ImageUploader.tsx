'use client';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  margin-bottom: 20px;
`;

const UploadButton = styled.button`
  background: #333;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background: #555;
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const ImagePreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  margin-right: 15px;
  border: 1px solid #444;
`;

const ProgressContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 5px;
  background-color: #333;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: #666;
  transition: width 0.3s;
`;

const ErrorMessage = styled.p`
  color: #ff4040;
  margin-top: 5px;
  font-size: 14px;
`;

interface ImageUploaderProps {
  onImageUploaded: (fileId: string, url: string) => void;
  currentImageUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, currentImageUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(10); // Initial progress indicator

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get authentication token from localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Simulate progress (since fetch doesn't support progress events directly)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type here as it will be automatically set with the boundary parameter
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setProgress(100);

      // Call the callback with file ID and URL
      onImageUploaded(data.fileId, data.url);

      // Reset upload state after a short delay to show completion
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 1000);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
      setError(errorMessage);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <UploaderContainer>
      <label htmlFor="diamond-image">Diamond Image</label>

      <div style={{ marginTop: '8px' }}>
        <UploadButton type="button" onClick={handleButtonClick} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Select Image'}
        </UploadButton>

        <FileInput
          ref={fileInputRef}
          type="file"
          id="diamond-image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {(previewUrl || isUploading) && (
          <PreviewContainer>
            {previewUrl && <ImagePreview src={previewUrl} alt="Diamond preview" />}
            {isUploading && <span>Uploading...</span>}
          </PreviewContainer>
        )}

        {isUploading && (
          <ProgressContainer>
            <ProgressBar progress={progress} />
          </ProgressContainer>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
    </UploaderContainer>
  );
};

export default ImageUploader;
