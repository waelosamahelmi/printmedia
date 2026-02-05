import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Muut tarvikkeet | PrintMedia PM Solutions Oy',
  description:
    'Turvaviivaimet, bungee-kiinnikkeet, bannerclipsit ja muut tarvikkeet suurkuvatulostukseen.',
}

export default async function MuutTarvikkeetPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'muut-tarvikkeet'
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

  // Separate turvaviivaimet and kiinnikkeet
  const turvaviivaimet = products.filter(p => p.name.toLowerCase().includes('turvaviivain'))
  const kiinnikkeet = products.filter(p => !p.name.toLowerCase().includes('turvaviivain'))

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
        {turvaviivaimet.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Turvaviivaimet
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {turvaviivaimet.map((product) => {
                const specs = product.specs ? JSON.parse(product.specs) : {}
                const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gray-100 p-6 flex justify-center h-64">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          width={400}
                          height={200}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {product.name}
                      </h3>
                      {product.shortDescription && (
                        <p className="text-gray-600 mb-3">{product.shortDescription}</p>
                      )}
                      {specs.profiilin_mitat && (
                        <p className="text-sm text-gray-500 mb-4">{specs.profiilin_mitat}</p>
                      )}
                      {specs.pituudet && (
                        <div>
                          <span className="font-medium text-gray-900">Saatavilla pituudet: </span>
                          <span className="text-gray-600">{specs.pituudet}</span>
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
          </div>
        )}

        {/* Kiinnikkeet section */}
        {kiinnikkeet.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Kiinnikkeet
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {kiinnikkeet.map((product) => {
                const specs = product.specs ? JSON.parse(product.specs) : {}
                const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gray-100 p-6 flex justify-center h-48">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          width={200}
                          height={150}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {product.name}
                        </h3>
                        {specs.tuotenumero && (
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                            #{specs.tuotenumero}
                          </span>
                        )}
                      </div>
                      {product.shortDescription && (
                        <p className="text-gray-600 mb-3">{product.shortDescription}</p>
                      )}
                      {specs.pakkauskoko && (
                        <p className="text-sm text-primary-600 font-medium">{specs.pakkauskoko}</p>
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
          </div>
        )}

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

