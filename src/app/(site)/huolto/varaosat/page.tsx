import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Package, Wrench, ChevronDown, ArrowDown } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Varaosat ja Tarvikkeet | PrintMedia PM Solutions Oy',
  description:
    'Varaosat ja kulutustarvikkeet tulostimiin ja leikkureihin. Alkuperäis- ja tarvikesosat ammattikäyttöön.',
}

const printerBrands = ['Mutoh', 'Roland', 'Mimaki', 'Ja monet muut']

function formatPrice(price: unknown) {
  if (!price) return 'Pyydä tarjous'
  const value = Number(price)
  if (!Number.isFinite(value)) return 'Pyydä tarjous'
  return `${value.toFixed(2).replace('.', ',')} EUR`
}

export default async function VaraosatPage() {
  const accessoryProducts = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: {
        slug: {
          in: ['muut-tarvikkeet', 'tarvikkeet']
        }
      }
    },
    include: {
      category: true
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
  })

  const featuredAccessories = accessoryProducts.slice(0, 6)
  const extraAccessories = accessoryProducts.slice(6)

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
            Toimitamme alkuperäis- ja tarvikesosia sekä suurkuvatulostimiin että
            leikkureihin. Kerro tarpeesi, niin autamme löytämään oikeat osat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tulostimien varaosat</h2>
            <p className="text-gray-600 mb-6">
              Varastostamme löytyy kulutusosia ja varaosia useisiin
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
              Toimitamme myös leikkureiden kulutusosia ja varaosia ammattikäyttöön.
              Tarvitsetko varaosia? Ota meihin yhteyttä niin autamme löytämään oikeat osat.
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <a
            href="#tuotteet"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-white shadow-md hover:bg-primary-700 transition-colors"
            aria-label="Siirry tuotteisiin"
          >
            <span className="font-semibold">Tuotteet</span>
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>

        <div className="mb-12 space-y-4 scroll-mt-28" id="tuotteet">
          <h2 className="text-2xl font-bold text-gray-900">Tarvikkeet</h2>
          <p className="text-gray-600">
            Hinnaston "Muut tarvikkeet" -tuotteet on lisätty alle. Voit avata lisäosion,
            jos haluat nähdä kaikki tuotteet.
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarviketuotteet</h3>

            {accessoryProducts.length === 0 ? (
              <p className="text-gray-600">Tarviketuotteita ei löytynyt vielä.</p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredAccessories.map((product) => (
                    <article
                      key={product.id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[160px]"
                    >
                      <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                        {product.category?.name || 'Tarvikkeet'}
                      </div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      {product.shortDesc && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.shortDesc}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-primary-700">
                          {formatPrice(product.price)}
                        </span>
                        <Link
                          href={`/tuotteet/${product.slug}`}
                          className="text-sm font-medium text-primary-700 hover:text-primary-800"
                        >
                          Lisätiedot
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {extraAccessories.length > 0 && (
                  <details className="group mt-4">
                    <summary className="list-none cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors w-full sm:w-72 mx-auto">
                      <span>Näytä lisää</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {extraAccessories.map((product) => (
                        <article
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 min-h-[160px]"
                        >
                          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                            {product.category?.name || 'Tarvikkeet'}
                          </div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          {product.shortDesc && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.shortDesc}</p>
                          )}
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-primary-700">
                              {formatPrice(product.price)}
                            </span>
                            <Link
                              href={`/tuotteet/${product.slug}`}
                              className="text-sm font-medium text-primary-700 hover:text-primary-800"
                            >
                              Lisätiedot
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Tarvitsetko varaosia?</h2>
          <p className="text-gray-300 mb-6">
            Soita tai lähettä sähköpostia, niin autamme löytämään oikeat osat.
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
