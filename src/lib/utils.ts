import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return 'Kysy hinta'
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  }).format(num)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äå]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http')) return path
  return path.startsWith('/') ? path : `/${path}`
}
