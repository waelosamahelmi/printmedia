import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Package, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Leikkureiden varaosat | PrintMedia PM Solutions Oy',
  description:
    'Alkuperäis- ja tarvikeosia leikkureihin. Varaosat ja kulutustarvikkeet ammattikäyttöön.',
}

export default function LeikkureidenVaraosatPage() {
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Leikkureiden varaosat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Pystymme toimittamaan niin alkuperäis- kuin tarvikeosiakin moniin 
            leikkureihin asiakkaillemme.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Laaja valikoima
            </h2>
            <p className="text-gray-600">
              Varastostamme löytyy iso määrä kulutusosia ja varaosia eri leikkureihin.
              Kerro tarpeistasi, niin katsotaan kuinka pystymme sinua palvelemaan.
            </p>
          </div>

          <div className="bg-primary-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kerro tarpeistasi
            </h2>
            <p className="text-gray-600 mb-6">
              Ota yhteyttä ja kerro mitä varaosia tai tarvikkeita tarvitset. 
              Katsotaan kuinka pystymme sinua palvelemaan.
            </p>
            <Button href="/yhteystiedot">Ota yhteyttä</Button>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Tarvitsetko varaosia leikkuriisi?
          </h2>
          <p className="text-gray-300 mb-6">
            Soita tai lähetä sähköpostia, niin autamme löytämään oikeat osat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+358440875025"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Soita: 0440 875 025
            </a>
            <a
              href="mailto:myynti@printmedia.fi"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              myynti@printmedia.fi
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}
