import { prisma } from '@/lib/db'
import { Hero } from '@/components/sections/Hero'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ProductsShowcase } from '@/components/sections/ProductsShowcase'
import { CTA } from '@/components/sections/CTA'

async function getPageData() {
  const [categories, products, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isVisible: true, parentId: null },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
      take: 6
    }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      include: { 
        category: true,
        images: { take: 1, orderBy: { sortOrder: 'asc' } }
      },
      orderBy: { sortOrder: 'asc' },
      take: 4
    }),
    prisma.setting.findMany()
  ])

  const settingsMap: Record<string, string> = {}
  settings.forEach(s => { settingsMap[s.key] = s.value })

  return { categories, products, settings: settingsMap }
}

export default async function HomePage() {
  const { categories, products, settings } = await getPageData()

  // Transform categories for CategoryGrid
  const categoryItems = categories.map(cat => ({
    title: cat.name,
    description: cat.description || '',
    image: cat.image || '/images/placeholder.jpg',
    href: `/laitteet/${cat.slug}`,
    count: cat._count.products
  }))

  // Transform products for ProductsShowcase
  const productItems = products.map(product => ({
    id: product.id,
    name: product.name,
    shortDesc: product.shortDesc || '',
    image: product.images[0]?.url || '/images/placeholder.jpg',
    href: `/tuotteet/${product.slug}`,
    badge: product.isFeatured ? 'Suosittu' : undefined
  }))

  return (
    <>
      {/* Hero Section */}
      <Hero
        subtitle={settings.company_name || 'PrintMedia PM Solutions Oy'}
        title="Suurkuvatulostusalan tukkukauppa"
        description={settings.site_description || 'Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.'}
        primaryCta={{ text: 'Tutustu laitteisiin', href: '/laitteet' }}
        secondaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        image="/images/devices/J5-132.jpg"
        features={[
          'Valtuutettu jälleenmyyjä',
          'Ammattitaitoinen huolto',
          'Nopea toimitus',
        ]}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Categories Section */}
      {categoryItems.length > 0 && (
        <CategoryGrid
          title="Tuotekategoriat"
          subtitle="Löydä sopiva ratkaisu tarpeisiisi laajasta valikoimastamme"
          categories={categoryItems}
        />
      )}

      {/* Featured Products */}
      {productItems.length > 0 && (
        <ProductsShowcase
          title="Suositut tuotteet"
          subtitle="Tutustu suosituimpiin tuotteisiimme"
          products={productItems}
          viewAllHref="/laitteet"
        />
      )}

      {/* CTA Section */}
      <CTA
        title="Tarvitsetko apua valinnoissa?"
        description="Asiantuntijamme auttavat sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun. Ota yhteyttä ja kerro, mitä etsit."
        primaryCta={{ text: 'Pyydä tarjous', href: '/yhteystiedot' }}
        secondaryCta={{ text: settings.phone ? `Soita ${settings.phone}` : 'Soita meille', href: `tel:${settings.phone || '+358440875025'}` }}
        variant="gradient"
      />
    </>
  )
}
