'use client';

import React, { useState } from 'react';

import ImageUpload from '@/components/ImageUpload';
import ProfilePicture from '@/components/ProfilePicture';

const TestUpload = () => {
  const [testImage, setTestImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleTestUpload = async file => {
    try {
      setUploadStatus('Processing...');

      // Create blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      setTestImage(blobUrl);

      setUploadStatus('Preview created successfully! ✅');

      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Test failed:', error);
      setUploadStatus('Test failed! ❌');
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-white mb-8 text-center'>
          Image Upload Test
        </h1>

        <div className='text-center mb-8'>
          <p className='text-gray-300 mb-4'>
            This page tests if image uploads and blob previews work correctly.
          </p>
          <p className='text-sm text-gray-500'>
            Try uploading an image to see if the preview displays without CSP
            errors.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Upload Test */}
          <div className='bg-gray-800 p-6 rounded-lg'>
            <h2 className='text-xl font-semibold text-white mb-4 text-center'>
              Upload Test
            </h2>
            <div className='flex justify-center mb-4'>
              <ImageUpload
                currentImageUrl={testImage}
                onImageUpload={handleTestUpload}
                size='lg'
                fallbackName='Test User'
              />
            </div>
            {uploadStatus && (
              <div className='text-center'>
                <div
                  className={`text-sm font-medium ${
                    uploadStatus.includes('successfully')
                      ? 'text-green-400'
                      : uploadStatus.includes('failed')
                        ? 'text-red-400'
                        : 'text-amber-400'
                  }`}
                >
                  {uploadStatus}
                </div>
              </div>
            )}
          </div>

          {/* Preview Test */}
          <div className='bg-gray-800 p-6 rounded-lg'>
            <h2 className='text-xl font-semibold text-white mb-4 text-center'>
              Preview Test
            </h2>
            <div className='space-y-4'>
              <div className='flex justify-center'>
                <ProfilePicture
                  size='lg'
                  imageUrl={testImage}
                  fullName='Test User'
                />
              </div>
              {testImage && (
                <div className='text-center'>
                  <div className='text-green-400 text-sm'>
                    ✅ Image preview working!
                  </div>
                  <div className='text-gray-400 text-xs mt-2'>
                    Blob URL: {testImage.substring(0, 50)}...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='mt-8 bg-gray-800 p-6 rounded-lg'>
          <h3 className='text-lg font-semibold text-white mb-3'>
            Test Instructions:
          </h3>
          <ol className='text-gray-300 space-y-2 list-decimal list-inside'>
            <li>Click on the upload area or drag an image file</li>
            <li>Check if the image preview appears without errors</li>
            <li>Look at the browser console for any CSP violations</li>
            <li>
              Verify that both the ImageUpload and ProfilePicture components
              work
            </li>
          </ol>
        </div>

        {/* Status */}
        <div className='mt-6 text-center'>
          <div className='text-sm text-gray-400'>
            Current Status:{' '}
            {testImage ? 'Image loaded successfully' : 'No image uploaded yet'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUpload;
