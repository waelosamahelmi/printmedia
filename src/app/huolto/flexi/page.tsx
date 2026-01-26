import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SAi Flexi | PrintMedia PM Solutions Oy',
  description:
    'SAi Flexi ja Enroute ohjelmistot. Laadukas RIP-ohjelmisto kuukausittaisena tilauspalveluna.',
}

export default function FlexiPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/huolto"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin huoltopalveluihin
          </Link>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="w-64 h-32 relative flex-shrink-0">
            <Image
              src="/images/logos/sai-flexi-logo.png"
              alt="SAi Flexi"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SAi Flexi ja Enroute ohjelmistot
            </h1>
            <p className="text-xl text-gray-600">
              Ei enää kallista kertainvestointia kalliiseen RIP-ohjelmistoon.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Kuukausittainen tilauspalvelu
            </h2>
            <p className="text-gray-600 mb-6">
              Laadukkaan RIP-ohjelmiston voit ostaa myös kuukausittaisena tilauspalveluna. 
              Samalla saat Flexi Design -ohjelmiston töiden esivalmisteluun ja suunnitteluun.
            </p>
            <p className="text-gray-600">
              Järkevä kokonaisuus esimerkiksi pientuotantoon tai vaikkapa isommankin 
              tulostustalon tarpeisiin.
            </p>
          </div>

          <div className="bg-primary-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tilaa nyt
            </h2>
            <p className="text-gray-600 mb-6">
              Voit tilata SAi Flexi -ohjelmiston suoraan verkosta tai kysyä lisätietoa 
              myynnistämme.
            </p>
            <div className="space-y-4">
              <a
                href="http://www.thinksai.com/printmediasolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Tilaa ohjelmisto
              </a>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Kysy lisää myynnistämme
          </h2>
          <p className="text-gray-300 mb-6">
            Autamme sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun.
          </p>
          <Button href="/yhteystiedot" variant="secondary">
            Ota yhteyttä
          </Button>
        </div>
      </Container>
    </div>
  )
}
