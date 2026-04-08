'use client'

interface ImagePlaceholderProps {
  text?: string
  className?: string
}

export function ImagePlaceholder({ 
  text = 'kuva tulossa', 
  className = '' 
}: ImagePlaceholderProps) {
  return (
    <div className={`flex items-center justify-center bg-white border border-gray-200 ${className}`}>
      <p className="text-gray-400 text-center text-sm font-medium">
        {text}
      </p>
    </div>
  )
}
