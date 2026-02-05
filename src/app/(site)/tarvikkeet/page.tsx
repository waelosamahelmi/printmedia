import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { CTA } from '@/components/sections/CTA'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Tarvikkeet',
  description:
    'Varaosat ja muut tarvikkeet ammattikäyttöön.',
}

async function getSuppliesCategories() {
  const categories = await prisma.category.findMany({
    where: { 
      isVisible: true,
      slug: {
        in: ['muut-tarvikkeet', 'tarvikkeet', 'varaosat']
      }
    },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' }
  })

  return categories.map(cat => ({
    title: cat.name,
    description: cat.description || '',
    image: cat.image || '/images/placeholder.jpg',
    href: `/tarvikkeet/${cat.slug}`,
    count: cat._count.products
  }))
}

export default async function TarvikkeetPage() {
  const categories = await getSuppliesCategories()

  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Tarvikkeet
            </h1>
            <p className="text-xl text-gray-600">
              Laaja valikoima tulostusmateriaaleja, musteita ja muita
              tarvikkeita. Kaikki mitä tarvitset ammattimaiseen tulostukseen ja
              leikkaukseen.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 ? (
        <CategoryGrid
          title="Tarvikekategoriat"
          subtitle="Tutustu valikoimaamme"
          categories={categories}
        />
      ) : (
        <Container className="py-16">
          <p className="text-center text-gray-500">Ei kategorioita saatavilla.</p>
        </Container>
      )}

      {/* Info Section */}
      <section className="section">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ammattilaisille suunnitellut tarvikkeet
              </h2>
              <p className="text-gray-600 mb-4">
                Tarjoamme laajan valikoiman laadukkaita tarvikkeita 
                tulostus- ja leikkauslaitteiden ammattimaiseen käyttöön.
              </p>
              <p className="text-gray-600 mb-6">
                Valikoimastamme löydät turvaviivaimet, kiinnikkeet ja 
                muut tarvittavat lisätarvikkeet.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  Laadukkaat materiaalit
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  Nopea toimitus
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  Kilpailukykyiset hinnat
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <img
                src="/images/products/accessories/bannerclip.jpg"
                alt="Tarvikkeet"
                className="mx-auto max-h-64 object-contain"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTA
        title="Tarvitsetko apua valinnassa?"
        description="Autamme sinua löytämään oikeat materiaalit ja tarvikkeet juuri sinun tarpeisiisi."
        primaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="default"
      />
    </div>
  )
}
