import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Messupöydät | PrintMedia PM Solutions Oy',
  description:
    'Helposti koottavat messupöydät. Pop Up -tyyliset promopöydät ammattimaiseen esittelyyn.',
}

export default async function MessupoydatPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'messupoydat'
      },
      status: 'PUBLISHED'
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })

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
          {products.map((product) => {
            const features = product.features ? JSON.parse(product.features) : []
            const specs = product.specs ? JSON.parse(product.specs) : {}
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
              >
                <div className="bg-gray-100 p-6 flex justify-center h-64">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || product.name}
                      width={250}
                      height={200}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {product.name}
                    </h2>
                    {specs.tuotenumero && (
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                        #{specs.tuotenumero}
                      </span>
                    )}
                  </div>
                  
                  {features.length > 0 && (
                    <ul className="space-y-2 mb-4 flex-1">
                      {features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {(specs.Paino || specs.Mitat || specs.Pakkaus) && (
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        {specs.Paino && (
                          <>
                            <span className="text-gray-500">Paino:</span>
                            <span className="text-gray-900">{specs.Paino}</span>
                          </>
                        )}
                        {specs.Mitat && (
                          <>
                            <span className="text-gray-500">Mitat:</span>
                            <span className="text-gray-900">{specs.Mitat}</span>
                          </>
                        )}
                        {specs.Pakkaus && (
                          <>
                            <span className="text-gray-500">Pakkaus:</span>
                            <span className="text-gray-900">{specs.Pakkaus}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Link href={`/tuotteet/${product.slug}`}>
                      <Button variant="secondary" size="sm">Lisätietoja</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
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

