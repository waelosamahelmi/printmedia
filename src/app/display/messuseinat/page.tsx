import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Messuseinät | PrintMedia PM Solutions Oy',
  description:
    'Pop Up messuseinät näyttävään messumainontaan. Suorat ja kaarevat mallit kuljetuslaukuilla.',
}

const products = [
  {
    name: 'Pop Up Suora',
    features: [
      'Sisältää: Rungon, magneettinauhan, 2 kpl valoja, sekä kuljetuslaukun',
      'Laukusta on mahdollista tehdä promotiski',
      'Ei sisällä vuotaa eikä tulostusmateriaalia',
      'Vuotien kiinnitys magneettinauhalla',
      'Seinä kasaantuu 75 cm ja päädyt 67 cm leveistä vuodista',
    ],
    sizes: [
      'n. 230cm x 230cm / 30kg',
      'n. 230cm x 230cm / 32kg',
    ],
    image: '/images/products/walls/suora_messuseina.jpg',
  },
  {
    name: 'Pop Up Kaareva',
    features: [
      'Sisältää: Rungon, magneettinauhan, 2 kpl valoja, sekä kuljetuslaukun',
      'Laukusta on mahdollista tehdä promotiski',
      'Ei sisällä vuotaa eikä tulostusmateriaalia',
      'Vuotien kiinnitys magneettinauhalla',
      'Seinä kasaantuu 70 cm ja päädyt 67 cm leveistä vuodista',
    ],
    sizes: [
      'n. 230cm x 230cm / 25kg',
      'n. 280cm x 230cm / 30kg',
    ],
    image: '/images/products/walls/kaareva_280_x_230.jpg',
  },
]

export default function MessuseinatPage() {
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
            Messuseinät
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Pop Up -messuseinät näyttävään messumainontaan. 
            Helppokäyttöiset ja laadukkaat ratkaisut ammattimaiseen esittelyyn.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-12 mb-12">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-start bg-white rounded-2xl shadow-lg overflow-hidden`}
            >
              <div className="flex-1 bg-gray-100 p-8 flex justify-center w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={400}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {product.name}
                </h2>
                
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Koot:</h3>
                  <ul className="space-y-1">
                    {product.sizes.map((size) => (
                      <li key={size} className="text-gray-600">{size}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  * Tuotteen mukana ei toimiteta kasausohjeita, eikä vuodan mittoja
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Tarvitsetko messuseinän?
          </h2>
          <p className="text-primary-100 mb-6">
            Kysy tarjous ja toimitusaikaa myynnistämme.
          </p>
          <Button href="/yhteystiedot" variant="secondary">
            Ota yhteyttä
          </Button>
        </div>
      </Container>
    </div>
  )
}
