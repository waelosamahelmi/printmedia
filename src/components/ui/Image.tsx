'use client'

import { ImgHTMLAttributes } from 'react'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
}

// Custom Image component that uses regular img tags for Hostinger compatibility
export default function Image({ 
  src, 
  alt, 
  width, 
  height, 
  fill,
  className = '',
  priority,
  ...props 
}: ImageProps) {
  // Handle fill mode with absolute positioning
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  )
}
