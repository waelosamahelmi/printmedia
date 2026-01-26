import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileDown, Layers, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tulostusmateriaalit | PrintMedia PM Solutions Oy',
  description:
    'Laaja valikoima tulostusmedioita rullatavarana eri tulostimille. Tarrat, kalvot, pressut, bannerit, paperit ja laminaatit.',
}

const materials = [
  'Tarrat',
  'Kalvot',
  'Pressut',
  'Bannerit',
  'Paperit',
  'Laminaatit',
  'Ja monet muut',
]

export default function TulostusmateriaalitPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tulostusmateriaalit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Varastostamme löytyy laaja valikoima erilaisia tulostusmedioita 
            rullatavarana eri tulostimille.
          </p>
        </div>

        {/* Materials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {materials.map((material) => (
            <div
              key={material}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-lg font-medium text-gray-900">{material}</span>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Jatkuvasti laajeneva valikoima
              </h2>
              <p className="text-gray-600 mb-4">
                Katso tarkempi valikoimamme hinnastosta tai kysy lisää myynnistämme!
              </p>
              <p className="text-gray-600">
                Etsimme jatkuvasti uusia tuotteita asiakkaidemme tarpeisiin.
              </p>
            </div>
          </div>
        </div>

        {/* Download hinnasto */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Lataa hinnasto
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/files/hinnasto2022-tulostusmateriaalit.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FileDown className="w-6 h-6" />
              <span className="text-lg font-medium">Tulostusmateriaalihinnasto (PDF)</span>
            </a>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tarvitsetko tulostusmateriaaleja?
          </h2>
          <p className="text-gray-600 mb-6">
            Ota yhteyttä myyntiimme niin autamme löytämään sopivat materiaalit.
          </p>
          <Button href="/yhteystiedot">Ota yhteyttä</Button>
        </div>
      </Container>
    </div>
  )
}
