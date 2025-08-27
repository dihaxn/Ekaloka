'use client'

import React, { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ProfilePicture from '@/components/ProfilePicture'

const TestProfilePhoto = () => {
  const [testImage, setTestImage] = useState(null)

  const handleTestUpload = async (file) => {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a preview URL for testing
      const previewUrl = URL.createObjectURL(file)
      setTestImage(previewUrl)
      
      alert('Test upload successful!')
    } catch (error) {
      console.error('Test upload failed:', error)
      alert('Test upload failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Profile Photo System Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test ImageUpload Component */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              ImageUpload Component Test
            </h2>
            <div className="flex justify-center">
              <ImageUpload
                currentImageUrl={testImage}
                onImageUpload={handleTestUpload}
                size="lg"
                fallbackName="John Doe"
              />
            </div>
            <div className="mt-4 text-center text-gray-400 text-sm">
              Click or drag to test upload functionality
            </div>
          </div>

          {/* Test ProfilePicture Component */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              ProfilePicture Component Test
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ProfilePicture size="sm" fullName="John Doe" />
                <span className="text-white">Small size</span>
              </div>
              <div className="flex items-center gap-4">
                <ProfilePicture size="md" fullName="Jane Smith" />
                <span className="text-white">Medium size</span>
              </div>
              <div className="flex items-center gap-4">
                <ProfilePicture size="lg" fullName="Bob Johnson" />
                <span className="text-white">Large size</span>
              </div>
              <div className="flex items-center gap-4">
                <ProfilePicture size="md" imageUrl={testImage} fullName="Test User" />
                <span className="text-white">With uploaded image</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Test Instructions:</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Try uploading different image files (JPG, PNG, GIF)</li>
            <li>• Test drag and drop functionality</li>
            <li>• Verify file size validation (max 5MB)</li>
            <li>• Check that fallback avatars show correctly</li>
            <li>• Test different component sizes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TestProfilePhoto
