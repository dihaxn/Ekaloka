'use client'

import React, { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ProfilePicture from '@/components/ProfilePicture'

const DemoProfilePhoto = () => {
  const [demoImage, setDemoImage] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleDemoUpload = async (file) => {
    try {
      setUploadStatus('Uploading...')

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Create a preview URL for demo
      const previewUrl = URL.createObjectURL(file)
      setDemoImage(previewUrl)
      setUploadStatus('Upload successful! ✅')

      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000)

    } catch (error) {
      console.error('Demo upload failed:', error)
      setUploadStatus('Upload failed! ❌')
      setTimeout(() => setUploadStatus(''), 3000)
    }
  }

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Profile Photo System Demo
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the complete profile picture upload system with drag & drop,
              real-time preview, and smart fallback avatars.
            </p>
          </div>

          {/* Main Demo Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Interactive Upload Demo */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                🖼️ Interactive Upload
              </h2>

              <div className="flex justify-center mb-6">
                <ImageUpload
                  currentImageUrl={demoImage}
                  onImageUpload={handleDemoUpload}
                  size="lg"
                  fallbackName="Demo User"
                />
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">
                  Click or drag an image here
                </div>
                <div className="text-xs text-gray-500">
                  Supports: JPG, PNG, GIF (max 5MB)
                </div>
              </div>

              {uploadStatus && (
                <div className="mt-4 text-center">
                  <div className={`text-sm font-medium ${
                    uploadStatus.includes('successful') ? 'text-green-400' :
                    uploadStatus.includes('failed') ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {uploadStatus}
                  </div>
                </div>
              )}
            </div>

            {/* Component Showcase */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                🎨 Component Showcase
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <ProfilePicture size="sm" fullName="John Doe" />
                  <div>
                    <div className="text-white font-medium">Small Size</div>
                    <div className="text-gray-400 text-sm">64x64px - Perfect for lists</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <ProfilePicture size="md" fullName="Jane Smith" />
                  <div>
                    <div className="text-white font-medium">Medium Size</div>
                    <div className="text-gray-400 text-sm">96x96px - Great for cards</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <ProfilePicture size="lg" fullName="Bob Johnson" />
                  <div>
                    <div className="text-white font-medium">Large Size</div>
                    <div className="text-gray-400 text-sm">128x128px - Profile headers</div>
                  </div>
                </div>

                {demoImage && (
                  <div className="flex items-center gap-4">
                    <ProfilePicture size="md" imageUrl={demoImage} fullName="Demo User" />
                    <div>
                      <div className="text-white font-medium">With Uploaded Image</div>
                      <div className="text-gray-400 text-sm">Real photo display</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop</h3>
              <p className="text-gray-400 text-sm">
                Intuitive drag and drop interface with visual feedback
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Preview</h3>
              <p className="text-gray-400 text-sm">
                See your changes immediately with real-time preview
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Validation</h3>
              <p className="text-gray-400 text-sm">
                File type and size validation with user-friendly errors
              </p>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              🚀 How to Use
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">For Users:</h3>
                <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Click on the profile picture area</li>
                  <li>Select an image file (JPG, PNG, GIF)</li>
                  <li>Or drag and drop an image directly</li>
                  <li>Wait for upload to complete</li>
                  <li>Your new profile picture will appear!</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">For Developers:</h3>
                <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Import ImageUpload component</li>
                  <li>Pass onImageUpload callback function</li>
                  <li>Handle file upload in your API</li>
                  <li>Update state with new image URL</li>
                  <li>Component handles the rest automatically</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoProfilePhoto
