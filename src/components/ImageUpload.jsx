'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import ProfilePicture from './ProfilePicture'

const ImageUpload = ({
  currentImageUrl,
  onImageUpload,
  className = '',
  size = 'md',
  disabled = false,
  fallbackName
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  }

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setIsUploading(true)
      
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Upload the file
      await onImageUpload(file)
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onImageUpload])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [disabled, handleFileSelect])

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const displayImage = previewUrl || currentImageUrl

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Image display area */}
      <div
        className={`
          ${sizeClasses[size]} 
          relative rounded-full overflow-hidden cursor-pointer
          border-2 border-dashed transition-all duration-200
          ${isDragOver 
                            ? 'border-amber-400 bg-amber-50/10'
                : 'border-gray-600 hover:border-amber-500'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${isUploading ? 'animate-pulse' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {displayImage ? (
          // Show uploaded image
          <Image
            src={displayImage}
            alt="Profile"
            fill
            className="object-cover"
            sizes={size === 'sm' ? '80px' : size === 'md' ? '128px' : '160px'}
          />
        ) : (
          // Show fallback profile picture
          <ProfilePicture
            fullName={fallbackName || 'User'}
            size={size}
            className="w-full h-full"
          />
        )}

        {/* Upload overlay */}
        {!disabled && (
          <div className={`
            absolute inset-0 bg-black/50 flex items-center justify-center
            opacity-0 hover:opacity-100 transition-opacity duration-200
            ${isUploading ? 'opacity-100' : ''}
          `}>
            {isUploading ? (
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <div className="text-sm">Uploading...</div>
              </div>
            ) : (
              <div className="text-white text-center">
                <div className="text-2xl mb-1">📷</div>
                <div className="text-xs">Change Photo</div>
              </div>
            )}
          </div>
        )}

        {/* Drag overlay */}
        {isDragOver && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                <div className="text-amber-400 text-center">
              <div className="text-3xl mb-2">⬇️</div>
              <div className="text-sm font-medium">Drop to upload</div>
            </div>
          </div>
        )}
      </div>

      {/* Upload status */}
      {isUploading && (
        <div className="mt-2 text-center">
                          <div className="text-xs text-amber-400">Uploading image...</div>
        </div>
      )}

      {/* Help text */}
      {!displayImage && !isUploading && (
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-500">
            Supports: JPG, PNG, GIF (max 5MB)
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
