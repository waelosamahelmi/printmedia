import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { CTA } from '@/components/sections/CTA'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Display-tuotteet',
  description:
    'Roll-up telineet, messuseinät, messupöydät ja muut display-tuotteet.',
}

async function getDisplayCategories() {
  const categories = await prisma.category.findMany({
    where: { 
      isVisible: true,
      slug: {
        in: ['roll-up', 'messuseinat', 'messupoydat', 'display-tuotteet']
      }
    },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' }
  })

  return categories.map(cat => ({
    title: cat.name,
    description: cat.description || '',
    image: cat.image || '/images/placeholder.jpg',
    href: `/display/${cat.slug}`,
    count: cat._count.products
  }))
}

export default async function DisplayPage() {
  const categories = await getDisplayCategories()
  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Display-tuotteet
            </h1>
            <p className="text-xl text-gray-600">
              Laadukkaat display-tuotteet messuille, tapahtumiin ja
              myymälöihin. Roll-up telineet, messuseinät, pöydät ja paljon muuta.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 ? (
        <CategoryGrid
          title="Display-kategoriat"
          subtitle="Valitse tuoteryhmä"
          categories={categories}
        />
      ) : (
        <Container className="py-16">
          <p className="text-center text-gray-500">Ei kategorioita saatavilla.</p>
        </Container>
      )}

      {/* Features */}
      <section className="section bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">Miksi valita meidän display-tuotteet?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Korkea laatu
              </h3>
              <p className="text-gray-600">
                Kestävät materiaalit ja huolellinen viimeistely takaavat pitkän
                käyttöiän.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nopea toimitus
              </h3>
              <p className="text-gray-600">
                Varastossa olevat tuotteet toimitetaan nopeasti. Pikatoimitus
                mahdollinen.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Kilpailukykyiset hinnat
              </h3>
              <p className="text-gray-600">
                Edulliset hinnat ilman kompromisseja laadusta. Määräalennukset
                saatavilla.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTA
        title="Suunnitteletko messuja tai tapahtumaa?"
        description="Autamme sinua valitsemaan oikeat display-tuotteet ja voimme toimittaa myös painotyöt valmiisiin telineisiin."
        primaryCta={{ text: 'Pyydä tarjous', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="gradient"
      />
    </div>
  )
}
