'use client'

import React from 'react'
import Image from 'next/image'

const ProfilePicture = ({
  imageUrl,
  fullName = 'User',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl'
  }

  const initials = fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (imageUrl) {
    return (
      <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
        <Image
          src={imageUrl}
          alt={`${fullName}'s profile picture`}
          fill
          className="object-cover"
          sizes={size === 'sm' ? '64px' : size === 'md' ? '96px' : '128px'}
        />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  )
}

export default ProfilePicture
