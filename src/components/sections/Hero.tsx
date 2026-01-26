'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Phone, CheckCircle } from 'lucide-react'

interface HeroProps {
  title?: string
  subtitle?: string
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
  features?: string[]
}

export function Hero({
  title = 'Ammattitason tulostus- ja leikkausratkaisut',
  subtitle = 'PrintMedia Finland Oy',
  description = 'Tarjoamme laajan valikoiman suurkuvatulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille. Luotettavaa palvelua jo vuodesta 2012.',
  primaryCta = { text: 'Tutustu laitteisiin', href: '/laitteet' },
  secondaryCta = { text: 'Ota yhteyttä', href: '/yhteystiedot' },
  image = '/images/devices/hero-printer.jpg',
  features = [
    'Nopea toimitus',
    'Ammattitaitoinen huolto',
    'Kilpailukykyiset hinnat',
  ],
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />

      <Container className="relative pt-32 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              {subtitle}
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={i >= title.split(' ').length - 2 ? 'gradient-text' : ''}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 mb-8 max-w-xl"
            >
              {description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="primary" size="lg" href={primaryCta.href}>
                {primaryCta.text}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" href={secondaryCta.href}>
                <Phone className="w-5 h-5" />
                {secondaryCta.text}
              </Button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-gray-400/20">
              <Image
                src={image}
                alt="PrintMedia tulostimet"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Valtuutettu jälleenmyyjä
                  </div>
                  <div className="text-xs text-gray-500">
                    Mimaki, Roland, GCC
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-primary-600 text-white rounded-xl shadow-xl p-4"
            >
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm text-primary-100">vuotta kokemusta</div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
