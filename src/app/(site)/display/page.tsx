import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { CTA } from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Display-tuotteet',
  description:
    'Roll-up telineet, messuseinät, messupöydät ja muut display-tuotteet.',
}

const displayCategories = [
  {
    title: 'Roll-up telineet',
    description:
      'Helposti kuljetettavat roll-up telineet messuille ja tapahtumiin. Spyro, Export, Luxury, Deluxe ja Mini mallit.',
    image: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg',
    href: '/display/roll-up',
    count: 5,
  },
  {
    title: 'Messuseinät',
    description:
      'Pop-up messuseinät suorina ja kaarevina malleina. Magneettikiinnityksellä.',
    image: '/images/products/walls/suora_messuseina.jpg',
    href: '/display/messuseinat',
    count: 2,
  },
  {
    title: 'Messupöydät',
    description:
      'Esittelypöydät ja promopöydät messuille. Sis. kuljetuslaukun.',
    image: '/images/products/tables/promopyt_1_uusi_kuva_1.jpg',
    href: '/display/messupoydat',
    count: 3,
  },
]

export default function DisplayPage() {
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
      <CategoryGrid
        title="Display-kategoriat"
        subtitle="Valitse tuoteryhmä"
        categories={displayCategories}
      />

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
