import Link from 'next/link'
import Image from '@/components/ui/Image'
import { cn, getImageUrl } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    shortDesc?: string | null
    price?: number | string | null
    priceType?: string | null
    images?: Array<{ url: string; alt?: string | null; isPrimary?: boolean }> | null
    category?: { name: string; slug: string } | null
  }
  className?: string
  variant?: 'default' | 'compact' | 'featured'
}

export function ProductCard({
  product,
  className,
  variant = 'default',
}: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0]
  const imageUrl = getImageUrl(primaryImage?.url)

  const formatPrice = (price: number | string | null | undefined, priceType?: string | null) => {
    if (priceType === 'quote') return 'Kysy hinta'
    if (priceType === 'call') return 'Soita meille'
    if (!price) return 'Kysy hinta'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
    }).format(numPrice)
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/tuotteet/${product.slug}`}
        className={cn('group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors', className)}
      >
        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-contain p-2"
            sizes="64px"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {product.name}
          </h4>
          <p className="text-sm text-primary-600 font-semibold">
            {formatPrice(product.price, product.priceType)}
          </p>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/tuotteet/${product.slug}`}
        className={cn('group block', className)}
      >
        <div className="card-hover h-full flex flex-col lg:flex-row">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-auto lg:w-1/2 bg-gray-100 overflow-hidden">
            <Image
              src={imageUrl}
              alt={primaryImage?.alt || product.name}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="p-8 lg:w-1/2 flex flex-col justify-center">
            {product.category && (
              <span className="text-sm text-primary-600 font-medium mb-2">
                {product.category.name}
              </span>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            {product.shortDesc && (
              <p className="text-gray-600 mb-6">{product.shortDesc}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(product.price, product.priceType)}
              </span>
              <span className="flex items-center text-primary-600 font-semibold">
                Lue lisää
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={`/tuotteet/${product.slug}`}
      className={cn('group block', className)}
    >
      <div className="card-hover h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
          {product.category && (
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              {product.category.name}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
              {product.shortDesc}
            </p>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price, product.priceType)}
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
