'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeaturesProps {
  title?: string
  subtitle?: string
  features: Feature[]
}

export function Features({
  title = 'Miksi valita PrintMedia?',
  subtitle = 'Tarjoamme kokonaisvaltaisen palvelun tulostus- ja leikkausratkaisuihin',
  features,
}: FeaturesProps) {
  return (
    <section className="section">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
