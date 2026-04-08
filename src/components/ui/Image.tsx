'use client'

import { ImgHTMLAttributes, SyntheticEvent, useEffect, useState } from 'react'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
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
  style,
  onError,
  ...props 
}: ImageProps) {
  const normalizedSrc = typeof src === 'string' ? src.trim() : ''
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [normalizedSrc])

  const showPlaceholder = normalizedSrc.length === 0 || hasError

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true)
    onError?.(event)
  }

  // Handle fill mode with absolute positioning
  if (fill) {
    const hasExplicitObjectFit = /(?:^|\s)object-(contain|cover|fill|none|scale-down)(?:\s|$)/.test(className)

    if (showPlaceholder) {
      return (
        <ImagePlaceholder
          className={`absolute inset-0 w-full h-full ${className}`.trim()}
        />
      )
    }

    return (
      <img
        src={normalizedSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${hasExplicitObjectFit ? '' : 'object-cover'} ${className}`.trim()}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        {...props}
      />
    )
  }

  if (showPlaceholder) {
    return (
      <ImagePlaceholder
        className={className}
      />
    )
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      style={style}
      onError={handleError}
      {...props}
    />
  )
}
