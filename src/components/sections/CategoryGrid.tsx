'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { ArrowRight } from 'lucide-react'

interface Category {
  title: string
  description: string
  image: string
  href: string
  count?: number
}

interface CategoryGridProps {
  title?: string
  subtitle?: string
  categories: Category[]
}

export function CategoryGrid({
  title = 'Tuotekategoriat',
  subtitle = 'Löydä sopiva ratkaisu tarpeisiisi laajasta valikoimastamme',
  categories,
}: CategoryGridProps) {
  return (
    <section className="section bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href} className="group block">
                <div className="card-hover h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    
                    {/* Category count badge */}
                    {category.count && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                        {category.count} tuotetta
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-primary-600 font-semibold text-sm">
                      Tutustu tuotteisiin
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
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
