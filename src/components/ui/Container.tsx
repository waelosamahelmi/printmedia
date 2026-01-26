import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'wide' | 'narrow'
}

export function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-7xl': size === 'default' || size === 'wide',
          'max-w-5xl': size === 'narrow',
        },
        className
      )}
    >
      {children}
    </div>
  )
}
