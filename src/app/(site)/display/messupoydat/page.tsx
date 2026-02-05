import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Messupöydät | PrintMedia PM Solutions Oy',
  description:
    'Helposti koottavat messupöydät. Pop Up -tyyliset promopöydät ammattimaiseen esittelyyn.',
}

const products = [
  {
    name: 'Promopöytä-1',
    productNumber: '4602',
    features: [
      'Pop Up style',
      'Välihylly',
      'Vuodan kiinnitys magneettinauhalla (sis. hintaan)',
      'Mukana kangaslaukku',
      'Ei sisällä vuotaa eikä tulostusmateriaalia',
    ],
    specs: {
      weight: '12 kg',
      dimensions: 'L 90 cm, K 88 cm, S 40 cm',
      package: 'L 100 cm, K 18 cm, S 40 cm',
    },
    image: '/images/products/tables/promopyt_1_uusi_kuva_1.jpg',
  },
  {
    name: 'Promopöytä-2',
    productNumber: '4601',
    features: [
      'Pop Up style',
      'Välihylly',
      'Vuodan kiinnitys magneettinauhalla (sis. hintaan)',
      'Mukana kangaslaukku',
      'Ei sisällä vuotaa eikä tulostusmateriaalia',
    ],
    specs: {
      weight: '16 kg',
      dimensions: 'L 129 cm, K 88 cm, S 45 cm',
      package: 'L 100 cm, K 18 cm, S 40 cm',
    },
    image: '/images/products/tables/promopyt_2_uusi_kuva_1.jpg',
  },
  {
    name: 'Promopöytä-4',
    productNumber: '4604',
    features: [
      'Vaalea pyökki',
      'Nopea kasata, tarranauha pohjustusmateriaalissa',
      'Välihyllyllä',
      'Vuodan koko noin L 184 cm, K 90 cm',
      'Vuodan kiinnitys teippaamalla tai tarranauhalla',
      'Mukana kangaslaukku',
      'Pohjustusmateriaalilla oma kantolaukku',
    ],
    specs: {
      weight: '10 kg',
      dimensions: 'L 118 cm, K 93 cm, S 40 cm',
      package: 'L 62 cm, K 42 cm, S 15 cm',
    },
    image: '/images/products/tables/promopyt_4.jpg',
  },
]

export default function MessupoydatPage() {
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
            Messupöydät
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Helposti koottavat messupöydät ammattimaiseen esittelyyn. 
            Pop Up -tyyliset promopöydät ovat näppäriä kuljettaa ja nopeita pystyttää.
          </p>
        </div>

        {/* Products */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="bg-gray-100 p-6 flex justify-center h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={250}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                    #{product.productNumber}
                  </span>
                </div>
                
                <ul className="space-y-2 mb-4 flex-1">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500">Paino:</span>
                    <span className="text-gray-900">{product.specs.weight}</span>
                    <span className="text-gray-500">Mitat:</span>
                    <span className="text-gray-900">{product.specs.dimensions}</span>
                    <span className="text-gray-500">Pakkaus:</span>
                    <span className="text-gray-900">{product.specs.package}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 text-center mb-12">
          * Tuotteen mukana ei toimiteta kasausohjeita, eikä vuodan mittoja
        </p>

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tarvitsetko messupöytiä?
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

