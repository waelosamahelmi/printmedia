'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import { ArrowRight } from 'lucide-react'

interface Category {
  title: string
  description: string
  image: string
  images?: string[]
  href: string
  count?: number
}

interface CategoryGridProps {
  sectionId?: string
  title?: string
  subtitle?: string
  categories: Category[]
}

export function CategoryGrid({
  sectionId,
  title = 'Tuotekategoriat',
  subtitle = 'Löydä sopiva ratkaisu tarpeisiisi laajasta valikoimastamme',
  categories,
}: CategoryGridProps) {
  const gridClassName =
    categories.length === 4
      ? 'grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8'
      : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'

  return (
    <section id={sectionId} className="section bg-gray-50">
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

        <div className={gridClassName}>
          {categories.map((category, index) => {
            const uniqueImages = Array.from(new Set((category.images || []).filter(Boolean))).slice(0, 3)
            const showCollage = uniqueImages.length >= 3
            const heroImage = uniqueImages[0] || category.image
            const preferContain = category.href.includes('docan-uv-tulostimet')

            return (
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
                      {showCollage ? (
                        <div className="grid grid-cols-3 h-full gap-1 bg-gray-200 p-1">
                          {uniqueImages.map((imgSrc, imgIndex) => (
                            <div key={`${category.title}-${imgIndex}`} className="relative overflow-hidden">
                              <Image
                                src={imgSrc}
                                alt={`${category.title} ${imgIndex + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 10vw"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Image
                          src={heroImage}
                          alt={category.title}
                          fill
                          className={preferContain
                            ? 'object-contain p-2 transition-transform duration-500 bg-gray-100'
                            : 'object-cover transition-transform duration-500 group-hover:scale-110'}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
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
            )
          })}
        </div>
      </Container>
    </section>
  )
}
