import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { CTA } from '@/components/sections/CTA'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Laitteet',
  description:
    'Tutustu PrintMedian laitevalikoimaan: Docan UV-tulostimet, GCC-tarraleikkurit, Jingwei-monitoimileikkurit ja Fayon-laminaattorit.',
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { 
      isVisible: true,
      parentId: null,
      // Filter only device categories by slug
      slug: {
        in: ['docan-uv-tulostimet', 'gcc-tarraleikkurit', 'monitoimileikkurit', 'laminaattorit', 'suurkuvatulostimet', 'leikkurit']
      }
    },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' }
  })

  return categories.map(cat => ({
    title: cat.name,
    description: cat.description || '',
    image: cat.image || '/images/placeholder.jpg',
    href: `/laitteet/${cat.slug}`,
    count: cat._count.products
  }))
}

export default async function LaitteetPage() {
  const categories = await getCategories()

  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Laitteet
            </h1>
            <p className="text-xl text-gray-600">
              Tarjoamme laajan valikoiman ammattitason tulostus- ja
              leikkauslaitteita. Olemme Docanin, GCC:n, Jingwein ja Fayonin
              valtuutettu jälleenmyyjä Suomessa.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 ? (
        <CategoryGrid
          title="Laitekategoriat"
          subtitle="Valitse kategoria nähdäksesi kaikki tuotteet"
          categories={categories}
        />
      ) : (
        <Container className="py-16">
          <p className="text-center text-gray-500">Ei kategorioita saatavilla.</p>
        </Container>
      )}

      {/* CTA */}
      <CTA
        title="Etkö löytänyt etsimääsi?"
        description="Kerro meille tarpeistasi, niin autamme sinua löytämään sopivan ratkaisun. Teemme myös erikoistilauksena laitteita."
        primaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="dark"
      />
    </div>
  )
}
