import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ArrowLeft, ChevronDown, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tulostusmateriaalit | PrintMedia PM Solutions Oy',
  description:
    'Tulostusmateriaalit ja valmiit tuoteosiot: Tarrat, Kalvot, Pressut, Bannerit, Paperit, Laminaatit ja monet muut.',
}

const materialGroups = [
  'Tarrat',
  'Kalvot',
  'Pressut',
  'Bannerit',
  'Paperit',
  'Laminaatit',
  'Ja monet muut',
]

function ProductSlots({ prefix }: { prefix: string }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {[1, 2, 3].map((slot) => (
        <div
          key={slot}
          className="bg-white border border-dashed border-gray-300 rounded-xl p-4 min-h-[130px]"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Tuotepaikka</div>
          <h4 className="font-semibold text-gray-900">{prefix} - Tuote {slot}</h4>
          <p className="text-sm text-gray-600 mt-2">
            Lisaa tahan myohemmin tuotteen nimi, kuvaus ja mahdollinen tuotekuva.
          </p>
        </div>
      ))}
    </div>
  )
}

export default function TulostusmateriaalitPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        <nav className="mb-8">
          <Link
            href="/hinnasto"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin hinnastoon
          </Link>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tulostusmateriaalit</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Varastostamme loytyy laaja valikoima erilaisia tulostusmedioita
            rullatavarana eri tulostimille.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {materialGroups.map((group) => (
            <details
              key={group}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm open:shadow-md overflow-hidden"
            >
              <summary className="list-none cursor-pointer p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-lg font-medium text-gray-900 flex-1">{group}</span>
                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                <ProductSlots prefix={group} />
              </div>
            </details>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Jatkuvasti laajeneva valikoima</h2>
          <p className="text-gray-600 mb-2">
            Katso tarkempi valikoimamme hinnastosta tai kysy lisaa myynnistamme.
          </p>
          <p className="text-gray-600">Etsimme jatkuvasti uusia tuotteita asiakkaidemme tarpeisiin.</p>
        </div>
      </Container>
    </div>
  )
}
