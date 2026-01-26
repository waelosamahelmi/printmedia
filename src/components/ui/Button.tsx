'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30',
        secondary:
          'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
        accent:
          'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400 shadow-lg shadow-accent-500/25',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/25',
        link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, asChild, href, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))
    
    // If href is provided, render as Link
    if (href) {
      return (
        <Link href={href} className={classes}>
          {isLoading && <LoadingSpinner />}
          {children}
        </Link>
      )
    }
    
    // Otherwise render as button
    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export { Button, buttonVariants }
