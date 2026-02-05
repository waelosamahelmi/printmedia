import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Muut tarvikkeet | PrintMedia PM Solutions Oy',
  description:
    'Turvaviivaimet, bungee-kiinnikkeet, bannerclipsit ja muut tarvikkeet suurkuvatulostukseen.',
}

const products = [
  {
    name: 'Turvaviivain teräsreunalla',
    description: 'Tukeva alumiini runko, jossa teräsreuna ja pohjassa liukuesteet.',
    specs: 'Profiilin mitat: korkeus 44 mm, leveys 105 mm',
    sizes: ['80cm', '110cm', '140cm', '170cm'],
    image: '/images/products/accessories/turvaviivain_tersreunalla.jpg',
  },
  {
    name: 'Turvaviivain leikkurilla',
    description: 'Leveä alumiini runko, pohjassa liukuesteet, muovipäädyt. Leikkurin liikkuvuutta voidaan säätää mukana tulevalla työkalulla.',
    specs: 'Profiilin mitat: korkeus 55 mm, leveys 150 mm. Max leikkaussyvyys 4 mm',
    sizes: ['120cm', '180cm', '260cm'],
    image: '/images/products/accessories/turvaviivain_leikkurilla.jpg',
  },
  {
    name: 'Bungee ball',
    productNumber: '3551',
    description: 'Kuminauhan paksuus 4 mm, pituus 150 mm. Pallon halkaisija 28 mm.',
    packSize: 'Myydään 50 kpl erissä',
    image: '/images/products/accessories/bungee-ball.jpg',
  },
  {
    name: 'Bungee hook',
    productNumber: '3552',
    description: 'Kuminauhan paksuus 4 mm, pituus 150 mm.',
    packSize: 'Myydään 50 kpl erissä',
    image: '/images/products/accessories/bungee-koukku.jpg',
  },
  {
    name: 'Banner clip',
    productNumber: '3553',
    description: 'Nopea asentaa. Soveltuu eri paksuisille materiaaleille. Kiinnikkeen leveys 35 mm.',
    packSize: 'Myydään 100 kpl erissä',
    image: '/images/products/accessories/bannerclip.jpg',
  },
]

export default function MuutTarvikkeetPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/tarvikkeet"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin tarvikkeisiin
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Muut tarvikkeet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Turvaviivaimet, kiinnikkeet ja muut hyödylliset tarvikkeet 
            suurkuvatulostuksen ammattilaisille.
          </p>
        </div>

        {/* Turvaviivaimet section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Turvaviivaimet
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {products.slice(0, 2).map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gray-100 p-6 flex justify-center h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{product.specs}</p>
                  <div>
                    <span className="font-medium text-gray-900">Saatavilla pituudet: </span>
                    <span className="text-gray-600">{product.sizes?.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kiinnikkeet section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Kiinnikkeet
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.slice(2).map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gray-100 p-6 flex justify-center h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    {product.productNumber && (
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                        #{product.productNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  {product.packSize && (
                    <p className="text-sm text-primary-600 font-medium">{product.packSize}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download hinnasto */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Katso kaikki tuotteet hinnastosta
          </h2>
          <Button href="/hinnasto">Lataa hinnasto</Button>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Tarvitsetko tarvikkeita?
          </h2>
          <p className="text-primary-100 mb-6">
            Ota yhteyttä myyntiimme niin autamme löytämään sopivat tuotteet.
          </p>
          <Button href="/yhteystiedot" variant="secondary">
            Ota yhteyttä
          </Button>
        </div>
      </Container>
    </div>
  )
}

