import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { CTA } from '@/components/sections/CTA'
import { ContactForm } from '@/components/sections/ContactForm'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { ProductsShowcase } from '@/components/sections/ProductsShowcase'
import { Container } from '@/components/ui/Container'
import { prisma } from '@/lib/db'
import {
  Award, Wrench, Truck, Users, Clock, Building2, DollarSign,
  CheckCircle, Settings, Cpu, Package, Layers, FileDown, Phone, Mail,
  type LucideIcon,
} from 'lucide-react'

// Map string icon names from database to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  Award, Wrench, Truck, Users, Clock, Building2, DollarSign,
  CheckCircle, Settings, Cpu, Package, Layers, FileDown, Phone, Mail,
}
import type {
  PageSection,
  HeroSettings,
  FeaturesSettings,
  CTASettings,
  CategoriesSettings,
  ProductsSettings,
  ContactSettings,
  ContentSettings,
  CustomHTMLSettings,
} from '@/lib/sections/types'

interface SectionRendererProps {
  section: PageSection
}

// Parse settings JSON safely
function parseSettings<T>(settings: string | null | undefined): T | null {
  if (!settings) return null
  try {
    return JSON.parse(settings) as T
  } catch (error) {
    console.error('Failed to parse section settings:', error)
    return null
  }
}

// Fetch categories for categories section
async function fetchCategories(settings: CategoriesSettings) {
  if (settings.mode === 'manual' && settings.categoryIds) {
    return await prisma.category.findMany({
      where: {
        id: { in: settings.categoryIds },
        isVisible: true,
      },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    })
  } else {
    // Auto mode - fetch all visible categories
    return await prisma.category.findMany({
      where: {
        isVisible: true,
        parentId: null, // Only top-level categories
      },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
      take: settings.limit || 6,
    })
  }
}

// Fetch products for products section
async function fetchProducts(settings: ProductsSettings) {
  const whereClause: any = {
    status: 'PUBLISHED',
  }

  if (settings.mode === 'manual' && settings.productIds) {
    whereClause.id = { in: settings.productIds }
  } else if (settings.mode === 'featured') {
    whereClause.isFeatured = true
  } else if (settings.mode === 'category' && settings.categoryId) {
    whereClause.categoryId = settings.categoryId
  }

  return await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
    orderBy: { sortOrder: 'asc' },
    take: settings.limit || 4,
  })
}

export async function SectionRenderer({ section }: SectionRendererProps) {
  // Skip invisible sections
  if (!section.isVisible) {
    return null
  }

  const { type, settings: settingsJson } = section

  switch (type) {
    case 'hero': {
      const settings = parseSettings<HeroSettings>(settingsJson)
      if (!settings) return null
      return <Hero {...settings} />
    }

    case 'features': {
      const settings = parseSettings<FeaturesSettings>(settingsJson)
      if (!settings) return null
      return (
        <section className="section">
          <Container>
            <div className="section-header">
              <h2 className="section-title">{settings.title || 'Miksi valita PrintMedia?'}</h2>
              {settings.subtitle && <p className="section-subtitle">{settings.subtitle}</p>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {settings.features.map((feature) => {
                const Icon = iconMap[feature.icon] || Award
                return (
                  <div key={feature.title} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>
      )
    }

    case 'categories': {
      const settings = parseSettings<CategoriesSettings>(settingsJson)
      if (!settings) return null

      const categories = await fetchCategories(settings)

      // Transform database categories to component format
      const formattedCategories = categories.map((cat) => ({
        title: cat.name,
        description: cat.description || '',
        image: cat.image || '/images/placeholder.jpg',
        href: `/laitteet/${cat.slug}`, // Add proper href for linking
        count: cat._count.products,
      }))

      return (
        <CategoryGrid
          title={settings.title}
          subtitle={settings.subtitle}
          categories={formattedCategories}
        />
      )
    }

    case 'products': {
      const settings = parseSettings<ProductsSettings>(settingsJson)
      if (!settings) return null

      const products = await fetchProducts(settings)

      // Transform products to match ProductsShowcase expected format
      const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        shortDesc: product.shortDesc || '',
        image: product.images[0]?.url || '/images/placeholder.jpg',
        href: `/tuotteet/${product.slug}`, // Add proper href for linking
        badge: product.isFeatured ? 'Suosittu' : undefined,
        price: product.price ? `${product.price} €` : undefined,
      }))

      return (
        <ProductsShowcase
          title={settings.title}
          subtitle={settings.subtitle}
          products={formattedProducts}
          viewAllHref={settings.viewAllHref}
        />
      )
    }

    case 'cta': {
      const settings = parseSettings<CTASettings>(settingsJson)
      if (!settings) return null
      return <CTA {...settings} />
    }

    case 'contact': {
      const settings = parseSettings<ContactSettings>(settingsJson)
      if (!settings) return null
      return <ContactForm {...settings} />
    }

    case 'content': {
      const settings = parseSettings<ContentSettings>(settingsJson)
      if (!settings) return null

      const maxWidthClass = {
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-5xl',
        xl: 'max-w-7xl',
        full: 'max-w-full',
      }[settings.maxWidth || 'lg']

      return (
        <section className="section">
          <Container>
            <div
              className={`${maxWidthClass} mx-auto prose prose-gray max-w-none`}
              dangerouslySetInnerHTML={{ __html: settings.html }}
            />
          </Container>
        </section>
      )
    }

    case 'custom_html': {
      const settings = parseSettings<CustomHTMLSettings>(settingsJson)
      if (!settings) return null

      // WARNING: This allows raw HTML injection
      // Only use for trusted admin content
      return (
        <div
          dangerouslySetInnerHTML={{ __html: settings.html }}
        />
      )
    }

    default:
      console.warn(`Unknown section type: ${type}`)
      return null
  }
}
