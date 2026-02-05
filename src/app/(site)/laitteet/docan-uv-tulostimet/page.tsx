import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Phone, Mail, ArrowLeft, ExternalLink, Check } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Docan UV-tasotulostimet | PrintMedia PM Solutions Oy',
  description:
    'Laadukkaat Docan UV-tasotulostimet suurkuvatulostukseen. Konica Minolta, Ricoh ja Kyocera tulostuspäillä.',
}

export default async function DocanUVTulostimetPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'docan-uv-tulostimet'
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

  // Get the first/main product for display
  const mainProduct = products[0]
  const features = mainProduct?.features ? JSON.parse(mainProduct.features) : []
  const specs = mainProduct?.specs ? JSON.parse(mainProduct.specs) : {}
  const primaryImage = mainProduct?.images?.find((img: { isPrimary: boolean }) => img.isPrimary) || mainProduct?.images?.[0]

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
          <div className="w-48 h-24 relative flex-shrink-0">
            <Image
              src="/images/logos/docan_logo2.jpg"
              alt="Docan"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UV-tasotulostimet
            </h1>
            <p className="text-xl text-gray-600">
              {mainProduct?.shortDescription || 'Viimeistellyt Docan tulostimet omaavat luotettavan toiminnan ja uskomattoman tulostuslaadun hyödyntäen Konica Minoltan, Ricohin tai Kyoceran tulostuspäitä.'}
            </p>
          </div>
        </div>

        {/* Main image */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-12 flex justify-center">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || mainProduct?.name || 'Docan UV-tulostin'}
              width={574}
              height={400}
              className="object-contain"
            />
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {mainProduct?.description && (
            <div dangerouslySetInnerHTML={{ __html: mainProduct.description.replace(/\n/g, '<br/>') }} />
          )}
          
          {features.length > 0 && (
            <>
              <h2>Ominaisuudet</h2>
              <ul>
                {features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </>
          )}

          {specs.varikokoonpanot && (
            <>
              <h2>Värikokoonpanot</h2>
              <ul>
                {Array.isArray(specs.varikokoonpanot) 
                  ? specs.varikokoonpanot.map((color: string) => (
                      <li key={color}>{color}</li>
                    ))
                  : <li>{specs.varikokoonpanot}</li>
                }
              </ul>
            </>
          )}

          {specs.max_paksuus && (
            <p>
              <strong>Tulostusmateriaalin paksuus:</strong> {specs.max_paksuus}
            </p>
          )}
        </div>

        {/* Links */}
        {(specs.esite || specs.video1 || specs.video2) && (
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <h3 className="font-semibold text-lg mb-4">Materiaalit ja videot</h3>
            <div className="flex flex-wrap gap-4">
              {specs.esite && (
                <a
                  href={specs.esite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Lataa esite (PDF)
                </a>
              )}
              {specs.video1 && (
                <a
                  href={specs.video1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Katso video YouTubesta
                </a>
              )}
              {specs.video2 && (
                <a
                  href={specs.video2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Katso lisää videoita
                </a>
              )}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kysy lisää!</h2>
          <p className="text-gray-600 mb-6">
            <strong>Toimitusjohtaja Harri Hynynen</strong>
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+358440875020"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <Phone className="w-5 h-5" />
              0440 875 020
            </a>
            <a
              href="mailto:harri.hynynen@printmedia.fi"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <Mail className="w-5 h-5" />
              harri.hynynen@printmedia.fi
            </a>
          </div>
          <div className="mt-6">
            <Button href="/yhteystiedot">Ota yhteyttä</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

