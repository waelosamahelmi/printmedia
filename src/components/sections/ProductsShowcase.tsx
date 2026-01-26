'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  shortDesc: string
  image: string
  href: string
  badge?: string
  price?: string
}

interface ProductsShowcaseProps {
  title?: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
}

export function ProductsShowcase({
  title = 'Suositut tuotteet',
  subtitle = 'Tutustu suosituimpiin tuotteisiimme',
  products,
  viewAllHref = '/laitteet',
}: ProductsShowcaseProps) {
  return (
    <section className="section bg-white">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title text-left">{title}</h2>
            <p className="section-subtitle text-left mt-2">{subtitle}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="secondary" href={viewAllHref}>
              Katso kaikki
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={product.href} className="group block">
                <div className="card-hover h-full flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                      {product.shortDesc}
                    </p>
                    {product.price && (
                      <div className="text-lg font-bold text-primary-600">
                        {product.price}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
