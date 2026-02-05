import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Roll Up rungot | PrintMedia PM Solutions Oy',
  description:
    'Laadukkaat Roll Up rungot messu- ja tapahtumamainontaan. Spyro, Export, Luxury, Deluxe ja Mini Roll Up mallit.',
}

const products = [
  {
    name: 'Spyro',
    features: [
      'Kevyt kantaa mukana',
      'Puristavalla ylälistalla',
      'Mukana kantolaukku',
      '85 cm x 200 cm / 2kg',
    ],
    image: '/images/products/rollups/spyro2.jpg',
  },
  {
    name: 'Export',
    features: [
      'Suosittu perusmalli',
      'Kevyt kantaa mukana',
      'Puristavalla ylälistalla',
      'Pehmustettu kantolaukku',
      '85 cm x 200 cm / 2,8 kg',
    ],
    image: '/images/products/rollups/export_uusi_laukku.jpg',
  },
  {
    name: 'Luxury',
    features: [
      'Export mallia hieman tukevampi, paksulla tukijalalla',
      'Puristavalla ylälistalla',
      'Pehmustettu kantolaukku',
    ],
    sizes: [
      '85 cm x 200 cm / 3,7kg',
      '100 cm x 200 cm / 4,2kg',
      '120 cm x 200 cm / 5,4kg',
    ],
    image: '/images/products/rollups/luxury_uusi_laukku.jpg',
  },
  {
    name: 'Deluxe-1',
    features: [
      'Näyttävä pisaramallin roll up kääntyvällä lisäjalalla',
      'Puristavalla ylälistalla',
      'Pehmustettu kantolaukku',
    ],
    sizes: [
      '85 cm x 200 cm / 7kg',
      '100 cm x 200 cm / 8kg',
      '120 cm x 200 cm / 9kg',
      '150 cm x 200 cm / 10kg',
    ],
    image: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg',
  },
  {
    name: 'Mini Roll Up',
    features: [
      'Hauska pisaramallinen pöytä roll up',
      'Alumiinia, kromin väriset muovi päädyt',
      'Tarra ylälistalla',
      'Toimitetaan pakkauslaatikossa',
    ],
    sizes: [
      '21 cm x 28,5 cm / 0,3kg',
      '30 cm x 41,5 cm / 0,5kg',
    ],
    image: '/images/products/rollups/mini_roll_up.jpg',
  },
]

export default function RollUpPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/display"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin display-tuotteisiin
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Roll Up rungot
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Laadukkaat roll up -rungot messu- ja tapahtumamainontaan. 
            Valitse omaan käyttöösi sopiva malli laajasta valikoimastamme.
          </p>
        </div>

        {/* Products grid */}
        <div className="space-y-12 mb-12">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center bg-white rounded-2xl shadow-lg overflow-hidden`}
            >
              <div className="flex-1 bg-gray-100 p-8 flex justify-center w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="object-contain max-h-[400px]"
                />
              </div>
              <div className="flex-1 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h2>
                
                <ul className="space-y-2 mb-4">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {product.sizes && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Saatavana koissa:</h3>
                    <ul className="space-y-1">
                      {product.sizes.map((size) => (
                        <li key={size} className="text-gray-600">{size}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tarvitsetko roll up -runkoja?
          </h2>
          <p className="text-gray-600 mb-6">
            Kysy tarjous ja toimitusaikaa myynnistämme.
          </p>
          <Button href="/yhteystiedot">Ota yhteyttä</Button>
        </div>
      </Container>
    </div>
  )
}

