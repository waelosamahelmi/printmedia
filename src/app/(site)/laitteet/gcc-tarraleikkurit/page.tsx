import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileDown } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'GCC Tarraleikkurit | PrintMedia PM Solutions Oy',
  description:
    'GCC tarraleikkurit vaativampaankin tuotantoon. RXII ja Jaguar V mallistot eri leikkuuleveyksillä.',
}

export default async function GCCTarraleikkuritPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'gcc-tarraleikkurit'
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
            href="/laitteet"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin laitteisiin
          </Link>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="w-48 h-24 relative flex-shrink-0 bg-white rounded-lg p-4">
            <Image
              src="/images/logos/GCC_Logo.png"
              alt="GCC"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              GCC Tarraleikkurit
            </h1>
            <p className="text-xl text-gray-600">
              Laadukkaat tarraleikkurit ammattikäyttöön useissa eri leikkuuleveyksillä.
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-16 mb-12">
          {products.map((product, index) => {
            const features = product.features ? JSON.parse(product.features) : []
            const specs = product.specs ? JSON.parse(product.specs) : {}
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

            return (
              <div
                key={product.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="flex-1 bg-gray-100 rounded-2xl p-8 flex justify-center">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || product.name}
                      width={400}
                      height={300}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h2>
                  {product.shortDesc && (
                    <p className="text-lg text-gray-600 mb-6">{product.shortDesc}</p>
                  )}
                  
                  {features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Sisältää:</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {features.map((feature: string) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {specs.leikkuuleveydet && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Saatavana leikkuuleveyksissä:</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {Array.isArray(specs.leikkuuleveydet) 
                          ? specs.leikkuuleveydet.map((size: string) => (
                              <li key={size}>{size}</li>
                            ))
                          : <li>{specs.leikkuuleveydet}</li>
                        }
                      </ul>
                    </div>
                  )}

                  {specs.esite && (
                    <a
                      href={specs.esite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-6 text-primary-600 hover:text-primary-700"
                    >
                      <FileDown className="w-5 h-5" />
                      Lataa esite (PDF)
                    </a>
                  )}

                  <div className="mt-6">
                    <Link href={`/tuotteet/${product.slug}`}>
                      <Button variant="secondary">Lisätietoja</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kysy myös muista malleista!
          </h2>
          <p className="text-gray-600 mb-6">
            Autamme sinua löytämään juuri sinun tarpeisiisi sopivan tarraleikkurin.
          </p>
          <Button href="/yhteystiedot">Ota yhteyttä</Button>
        </div>
      </Container>
    </div>
  )
}

