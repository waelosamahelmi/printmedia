import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Messuseinät | PrintMedia PM Solutions Oy',
  description:
    'Pop Up messuseinät näyttävään messumainontaan. Suorat ja kaarevat mallit kuljetuslaukuilla.',
}

export default async function MessuseinatPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'messuseinat'
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
            Messuseinät
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Pop Up -messuseinät näyttävään messumainontaan. 
            Helppokäyttöiset ja laadukkaat ratkaisut ammattimaiseen esittelyyn.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-12 mb-12">
          {products.map((product, index) => {
            const features = product.features ? JSON.parse(product.features) : []
            const specs = product.specs ? JSON.parse(product.specs) : {}
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

            return (
              <div
                key={product.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-start bg-white rounded-2xl shadow-lg overflow-hidden`}
              >
                <div className="flex-1 bg-gray-100 p-8 flex justify-center w-full">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || product.name}
                      width={500}
                      height={400}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="flex-1 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {product.name}
                  </h2>
                  
                  {features.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {specs.Koot && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Koot:</h3>
                      <p className="text-gray-600">{specs.Koot}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-4">
                    * Tuotteen mukana ei toimiteta kasausohjeita, eikä vuodan mittoja
                  </p>

                  <div className="mt-4">
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

