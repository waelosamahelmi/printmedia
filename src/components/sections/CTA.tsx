'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Phone } from 'lucide-react'

interface CTAProps {
  title?: string
  description?: string
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  image?: string
  variant?: 'default' | 'dark' | 'gradient'
}

export function CTA({
  title = 'Tarvitsetko apua valinnoissa?',
  description = 'Asiantuntijamme auttavat sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun. Ota yhteyttä ja kerro, mitä etsit.',
  primaryCta = { text: 'Pyydä tarjous', href: '/yhteystiedot' },
  secondaryCta = { text: 'Soita meille', href: 'tel:+358405048822' },
  image,
  variant = 'default',
}: CTAProps) {
  const bgClasses = {
    default: 'bg-gray-50',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-r from-primary-600 to-primary-700',
  }

  const textClasses = {
    default: 'text-gray-900',
    dark: 'text-white',
    gradient: 'text-white',
  }

  const subtextClasses = {
    default: 'text-gray-600',
    dark: 'text-gray-300',
    gradient: 'text-primary-100',
  }

  return (
    <section className={`section ${bgClasses[variant]}`}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${textClasses[variant]}`}>
              {title}
            </h2>
            <p className={`text-lg mb-8 ${subtextClasses[variant]}`}>
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant={variant === 'default' ? 'primary' : 'accent'}
                size="lg"
                href={primaryCta.href}
              >
                {primaryCta.text}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant={variant === 'default' ? 'secondary' : 'ghost'}
                size="lg"
                className={variant !== 'default' ? 'text-white border-white/20 hover:bg-white/10' : ''}
                href={secondaryCta.href}
              >
                <Phone className="w-5 h-5" />
                {secondaryCta.text}
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={image}
                  alt="PrintMedia palvelut"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          )}

          {/* Or decorative elements if no image */}
          {!image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className={`text-4xl font-bold ${textClasses[variant]}`}>500+</div>
                    <div className={subtextClasses[variant]}>Tyytyväistä asiakasta</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className={`text-4xl font-bold ${textClasses[variant]}`}>10+</div>
                    <div className={subtextClasses[variant]}>Vuotta kokemusta</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className={`text-4xl font-bold ${textClasses[variant]}`}>24h</div>
                    <div className={subtextClasses[variant]}>Nopea vastausaika</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className={`text-4xl font-bold ${textClasses[variant]}`}>100%</div>
                    <div className={subtextClasses[variant]}>Takuu laitteille</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  )
}
