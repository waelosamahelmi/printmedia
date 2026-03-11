import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Package, Wrench, ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Varaosat ja Tarvikkeet | PrintMedia PM Solutions Oy',
  description:
    'Varaosat ja kulutustarvikkeet tulostimiin ja leikkureihin. Alkuperais- ja tarvikeosat ammattikayttoon.',
}

const printerBrands = ['Mutoh', 'Roland', 'Mimaki', 'Ja monet muut']

const productSections = [
  'Tulostimien varaosat',
  'Leikkureiden varaosat',
  'Tarvikkeet',
]

export default function VaraosatPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        <nav className="mb-8">
          <Link
            href="/huolto"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin huolto ja tuki -sivulle
          </Link>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Varaosat ja Tarvikkeet</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Toimitamme alkuperais- ja tarvikeosia seka suurkuvatulostimiin etta
            leikkureihin. Kerro tarpeesi, niin autamme loytamaan oikeat osat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tulostimien varaosat</h2>
            <p className="text-gray-600 mb-6">
              Varastostamme loytyy kulutusosia ja varaosia useisiin
              suurkuvatulostimiin.
            </p>
            <h3 className="font-semibold text-gray-900 mb-3">Tuetut merkit:</h3>
            <ul className="space-y-2">
              {printerBrands.map((brand) => (
                <li key={brand} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  {brand}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leikkureiden varaosat</h2>
            <p className="text-gray-600 mb-6">
              Toimitamme myos leikkureiden kulutusosia ja varaosia ammattikayttoon.
              Ota yhteytta, niin tarkistamme saatavuuden nopeasti.
            </p>
            <Button href="/yhteystiedot">Ota yhteytta</Button>
          </div>
        </div>

        <div className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Tuotteiden lisauspaikat</h2>
          <p className="text-gray-600">
            Jokaisessa osa-alueessa nakyy yksi tuoterivi valmiina. Avaa lisaosio,
            jos haluat tuoda esiin lisaa tuotteita.
          </p>

          {productSections.map((section) => (
            <div
              key={section}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section}</h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={`${section}-${slot}`}
                    className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 min-h-[120px]"
                  >
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Tuotepaikka
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {section} - Tuote {slot}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Lisaa tahan myohemmin tuotteen nimi, kuvaus ja hinta pyydettaessa.
                    </p>
                  </div>
                ))}
              </div>

              <details className="group mt-4">
                <summary className="list-none cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors w-full sm:w-72 mx-auto">
                  <span>Näytä lisää</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {[4, 5, 6].map((slot) => (
                    <div
                      key={`${section}-${slot}`}
                      className="bg-white border border-dashed border-gray-300 rounded-xl p-4 min-h-[120px]"
                    >
                      <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                        Lisapaikka
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {section} - Tuote {slot}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        Lisaa tahan tarvittaessa enemman tuotteita samaan kategoriaan.
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Tarvitsetko varaosia?</h2>
          <p className="text-gray-300 mb-6">
            Soita tai laheta sahkopostia, niin autamme loytamaan oikeat osat.
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
