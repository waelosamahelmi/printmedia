import { Metadata } from 'next'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { prisma } from '@/lib/db'
import { ArrowDown, ArrowLeft, Check, FileDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tulostusvärit | PrintMedia PM Solutions Oy',
  description:
    'Jetbest tulostusvärit ja puhdistusaineet suurkuvatulostimiin. Tuotteet ilman hintoja, kysy ajantasainen tarjous myynnistä.',
}

const compatibleBrands = [
  'Roland Eco-sol Max / Max 2',
  'Mutoh Eco-solvent Ultra',
  'Mimaki SS21 / UCJV',
]

async function getInkProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: {
        slug: 'tulostusvarit',
      },
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  // Keep product cards in a logical order: cartridges together first.
  const preferredOrder = [
    'jetbest-es3-varikasetti-440ml',
    'jetbest-ss21-varikasetti-440ml',
    'jetbest-i2-varikasetti-440ml',
    'jetbest-es3-tayttopullo-500ml',
    'jetbest-cleaning-solvent-220ml',
    'jetbest-cleaning-solvent-440ml',
    'cleaning-eco-solvent-1000ml',
    'jetbest-lus170-uv-1l',
    'jetbest-lus170-uv-cleaning-1l',
    'chromoink-uv-1000ml',
  ]

  const indexBySlug = new Map(preferredOrder.map((slug, index) => [slug, index]))

  return products.sort((a, b) => {
    const aIndex = indexBySlug.get(a.slug) ?? Number.MAX_SAFE_INTEGER
    const bIndex = indexBySlug.get(b.slug) ?? Number.MAX_SAFE_INTEGER
    if (aIndex !== bIndex) {
      return aIndex - bIndex
    }
    return a.name.localeCompare(b.name, 'fi')
  })
}

export default async function TulostusvaritPage() {
  const products = await getInkProducts()
  const es3PrimaryImage = products.find((product) => product.slug === 'jetbest-es3-varikasetti-440ml')?.images[0]

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tulostusvärit</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Vuosien kokemuksella! Jetbest osoittautui pitkän testijakson
            jälkeen loistavaksi ja jopa paremmaksi kuin moni
            alkuperäisväreistä. Huippulaadukkaat eco-solvent- ja UV-värit
            Roland-, Mutoh- ja Mimaki-tulostimiin.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-56 h-28 flex-shrink-0 rounded-lg bg-white p-2 flex items-center">
                <Image
                  src="/images/logos/jetbest_sahkoposti_v2.jpg"
                  alt="Jetbest"
                  width={560}
                  height={189}
                  className="w-full h-auto max-h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Jetbest Eco-Solvent</h2>
                <p className="text-gray-600">
                  Alkuperäisen värin käyttäjät voivat vaihtaa laadukkaat lähes
                  alkuperäistä vastaavat värikasetit tulostimeen ilman mitään
                  erillisiä toimenpiteitä.
                  <strong> Väriprofiileja ei myöskään tarvitse uusia.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Yhteensopivat värit</h3>
              <p className="text-gray-600 mb-4">
                Jetbestiltä löytyy lähes identtiset värit seuraaville:
              </p>
              <ul className="space-y-2 mb-8">
                {compatibleBrands.map((brand) => (
                  <li key={brand} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{brand}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">Saatavilla olevat koot</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">440ml patruunat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">220ml patruunat</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Dokumentit ja vertailut</h3>
              <div className="space-y-4">
                <a
                  href="/files/ecosolmax_vs._jbnew-eco.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileDown className="w-6 h-6 text-primary-600" />
                  <span className="text-gray-700">Jetbest vs. Roland Eco-Sol Max ja Mutoh Eco-Sol Ultra</span>
                </a>
                <a
                  href="/files/ss21_vs_jbss21.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileDown className="w-6 h-6 text-primary-600" />
                  <span className="text-gray-700">Jetbest vs. Mimaki SS21</span>
                </a>
                <a
                  href="/files/ghs_ss21_safety_data_sheet_fi.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileDown className="w-6 h-6 text-primary-600" />
                  <span className="text-gray-700">Käyttöturvallisuustiedote SS21</span>
                </a>
                <a
                  href="/files/new_eco_ink_msds_fi.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileDown className="w-6 h-6 text-primary-600" />
                  <span className="text-gray-700">Käyttöturvallisuustiedote ES3</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <a
              href="#tuotteet"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-white shadow-md hover:bg-primary-700 transition-colors"
              aria-label="Siirry tuotteisiin"
            >
              <span className="font-semibold">Tuotteet</span>
              <ArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div id="tuotteet" className="mb-12 scroll-mt-28">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tuotteet</h2>
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isJetbestSs21 = product.slug === 'jetbest-ss21-varikasetti-440ml'
                const displayImage = isJetbestSs21 && es3PrimaryImage ? es3PrimaryImage : product.images[0]

                return (
                  <Link
                    key={product.id}
                    href={`/tuotteet/${product.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {displayImage ? (
                        <img
                          src={displayImage.url}
                          alt={displayImage.alt || product.name}
                          className="w-full h-full object-contain object-center p-3 bg-white"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                      {product.shortDesc && (
                        <p className="text-sm text-gray-600">{product.shortDesc}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-gray-600">
              Ei tuotteita vielä. Tuo hinnasto ensin ja päivitä sivu.
            </div>
          )}
        </div>

        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Kysy tarjous tulostusväreistä</h2>
          <p className="text-primary-100 mb-6">
            Hinnat päivittyvät välillä, joten saat ajantasaisen tarjouksen
            nopeasti myynnistämme.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/yhteystiedot" variant="secondary">
              Ota yhteyttä
            </Button>
            <a
              href="tel:+358440875025"
              className="inline-flex items-center bg-white/10 border border-white/40 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Soita 0440 875 025
            </a>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/hinnasto"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin hinnasto-sivulle
          </Link>
        </div>
      </Container>
    </div>
  )
}
