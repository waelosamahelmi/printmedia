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

function getCategoryHref(slug: string): string {
  const routeMap: Record<string, string> = {
    'docan-uv-tulostimet': '/laitteet/docan-uv-tulostimet',
    'gcc-tarraleikkurit': '/laitteet/gcc-tarraleikkurit',
    'monitoimileikkurit': '/laitteet/monitoimileikkurit',
    laminaattorit: '/laitteet/laminaattorit',
    tulostusvarit: '/tulostusvarit',
    tulostusmateriaalit: '/tulostusmateriaalit',
    tarvikkeet: '/tarvikkeet',
    'display-tuotteet': '/display',
    'roll-up': '/display/roll-up',
    messuseinat: '/display/messuseinat',
    messupoydat: '/display/messupoydat',
  }

  return routeMap[slug] || `/laitteet/${slug}`
}

// Fetch categories for categories section
async function fetchCategories(settings: CategoriesSettings) {
  try {
    if (settings.mode === 'manual' && settings.categoryIds) {
      return await prisma.category.findMany({
        where: {
          id: { in: settings.categoryIds },
          isVisible: true,
        },
        include: {
          _count: { select: { products: true } },
          products: {
            where: { status: 'PUBLISHED' },
            take: 3,
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      })
    }

    const includeSlugs = settings.includeSlugs && settings.includeSlugs.length > 0
      ? settings.includeSlugs
      : undefined
    const excludeSlugs = settings.excludeSlugs && settings.excludeSlugs.length > 0
      ? settings.excludeSlugs
      : undefined

    return await prisma.category.findMany({
      where: {
        isVisible: true,
        parentId: null,
        ...(includeSlugs ? { slug: { in: includeSlugs } } : {}),
        ...(excludeSlugs ? { slug: { notIn: excludeSlugs } } : {}),
      },
      include: {
        _count: { select: { products: true } },
        products: {
          where: { status: 'PUBLISHED' },
          take: 3,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: settings.limit || 6,
    })
  } catch (error) {
    console.error('Failed to fetch categories for section:', error)
    return []
  }
}

// Fetch products for products section
async function fetchProducts(settings: ProductsSettings) {
  try {
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
  } catch (error) {
    console.error('Failed to fetch products for section:', error)
    return []
  }
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

      const featureGridClass =
        settings.features.length === 3
          ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto'
          : 'grid sm:grid-cols-2 lg:grid-cols-4 gap-8'

      return (
        <section id={settings.sectionId} className="section scroll-mt-32">
          <Container>
            <div className="section-header">
              <h2 className="section-title">{settings.title || 'Miksi valita PrintMedia?'}</h2>
              {settings.subtitle && <p className="section-subtitle">{settings.subtitle}</p>}
            </div>
            <div className={featureGridClass}>
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

      if (settings.items && settings.items.length > 0) {
        return (
          <CategoryGrid
            sectionId={settings.sectionId}
            title={settings.title}
            subtitle={settings.subtitle}
            categories={settings.items}
          />
        )
      }

      const categories = await fetchCategories(settings)

      // Transform database categories to component format
      const formattedCategories = categories.map((cat) => {
        // Get product images (max 3)
        const productImages = Array.from(
          new Set(cat.products.flatMap(product => product.images.map(img => img.url)))
        ).slice(0, 3)

        return {
          title: cat.name,
          description: cat.description || '',
          image: cat.image || '/images/placeholder.jpg',
          images: productImages.length > 0 ? productImages : undefined,
          href: getCategoryHref(cat.slug),
          count: cat._count.products,
        }
      })

      return (
        <CategoryGrid
          sectionId={settings.sectionId}
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
      let html = settings?.html

      // Some fallback strings were serialized as invalid JSON; recover the html payload.
      if (!html && settingsJson) {
        const match = settingsJson.match(/"html":"([\s\S]*)"\s*}\s*$/)
        if (match && match[1]) {
          html = match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
        }
      }

      if (!html && section.content) {
        html = section.content
      }

      if (!html) return null

      // WARNING: This allows raw HTML injection
      // Only use for trusted admin content
      return (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )
    }

    default:
      console.warn(`Unknown section type: ${type}`)
      return null
  }
}
