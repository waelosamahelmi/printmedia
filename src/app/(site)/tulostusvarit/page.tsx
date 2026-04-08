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
  return prisma.product.findMany({
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
}

type InkProduct = Awaited<ReturnType<typeof getInkProducts>>[number]

type InkCardImage = {
  url: string
  alt: string | null
}

type InkCard = {
  id: string
  slug: string
  name: string
  shortDesc: string | null
  image: InkCardImage | undefined
}

const canonicalInkCards: InkCard[] = [
  {
    id: 'fallback-jetbest-es3-varikasetti-440ml',
    slug: 'jetbest-es3-varikasetti-440ml',
    name: 'Jetbest ES3 - varikasetti 440 ml (C, M, Y, K, LC, LM)',
    shortDesc: 'Alkuperaista vastaava 440 ml varikasetti Roland-, Mutoh- ja Mimaki ES3 -laitteisiin.',
    image: { url: '/images/products/inks/jetbest-es3-new.jpg', alt: 'Jetbest ES3 - varikasetti 440 ml' },
  },
  {
    id: 'fallback-jetbest-es3-tayttopullo-500ml',
    slug: 'jetbest-es3-tayttopullo-500ml',
    name: 'Jetbest ES3 - tayttopullo 500 ml (C, M, Y, K, LC, LM)',
    shortDesc: '500 ml tayttopullo Jetbest tayttojarjestelmalle, eco-solvent-kayttoon.',
    image: undefined,
  },
  {
    id: 'fallback-jetbest-ss21-varikasetti-440ml',
    slug: 'jetbest-ss21-varikasetti-440ml',
    name: 'Jetbest SS21 - varikasetti 440 ml (C, M, Y, K, LC, LM, W, O)',
    shortDesc: 'Mimaki SS21 -yhteensopiva 440 ml varikasetti useisiin JV/CJV-sarjoihin.',
    image: { url: '/images/products/inks/ss21-chat.png', alt: 'Jetbest SS21 - varikasetti 440 ml' },
  },
  {
    id: 'fallback-jetbest-i2-varikasetti-440ml',
    slug: 'jetbest-i2-varikasetti-440ml',
    name: 'Jetbest I-2 - varikasetti 440 ml (C, M, Y, K, LC, LM, LK)',
    shortDesc: 'Roland Eco-sol MAX2 -yhteensopiva 440 ml varikasetti.',
    image: { url: '/images/products/inks/jetbest-eco-i2-new.jpg', alt: 'Jetbest I-2 - varikasetti 440 ml' },
  },
  {
    id: 'fallback-jetbest-cleaning-solvent-220ml',
    slug: 'jetbest-cleaning-solvent-220ml',
    name: 'Jetbest Cleaning Solvent 220 ml',
    shortDesc: 'Puhdistusneste eco-solvent- ja mild-solvent-vareille.',
    image: undefined,
  },
  {
    id: 'fallback-jetbest-cleaning-solvent-440ml',
    slug: 'jetbest-cleaning-solvent-440ml',
    name: 'Jetbest Cleaning Solvent 440 ml',
    shortDesc: 'Puhdistusneste 440 ml varikokoon, eco-solvent- ja mild-solvent-kayttoon.',
    image: undefined,
  },
  {
    id: 'fallback-cleaning-eco-solvent-1000ml',
    slug: 'cleaning-eco-solvent-1000ml',
    name: 'Cleaning Eco-Solvent 1000 ml pullo',
    shortDesc: '1 litran puhdistusaine eco-solvent-, mild-solvent- ja solvent-vareille.',
    image: undefined,
  },
  {
    id: 'fallback-jetbest-lus170-uv-1l',
    slug: 'jetbest-lus170-uv-1l',
    name: 'Jetbest LUS170 UV 1L pullo (C, M, Y, K, W, V, CL)',
    shortDesc: 'UV-vari 1 litran tayttopullossa, yhteensopiva mm. Mimaki UCJV -sarjan kanssa.',
    image: { url: '/images/products/inks/jetbest-lus170-new.jpg', alt: 'Jetbest LUS170 UV 1L pullo' },
  },
  {
    id: 'fallback-jetbest-lus170-uv-cleaning-1l',
    slug: 'jetbest-lus170-uv-cleaning-1l',
    name: 'Jetbest LUS170 UV Cleaning 1L pullo',
    shortDesc: 'Jetbest LUS170 UV -sarjan puhdistusaine 1 litran pullossa.',
    image: undefined,
  },
  {
    id: 'fallback-chromoink-uv-1000ml',
    slug: 'chromoink-uv-1000ml',
    name: 'Chromoink UV 1000 ml pullo (C, M, Y, K, LC, LM, W)',
    shortDesc: 'UV-vari 1 litran pullossa Konica Minolta -tulostuspaille.',
    image: { url: '/images/products/inks/chromoink-new.jpg', alt: 'Chromoink UV 1000 ml pullo' },
  },
  {
    id: 'fallback-1511-chromoink-uv-1000ml-pullo-coating-liquid-sti',
    slug: '1511-chromoink-uv-1000-ml-pullo-coating-liquid-sti',
    name: 'Chromoink UV coating liquid STI 1000 ml',
    shortDesc: 'Chromoink UV -sarjan coating liquid STI.',
    image: undefined,
  },
  {
    id: 'fallback-1512-chromoink-uv-1000ml-pullo-coating-liquid-dil',
    slug: '1512-chromoink-uv-1000-ml-pullo-coating-liquid-dil',
    name: 'Chromoink UV coating liquid DIL 1000 ml',
    shortDesc: 'Chromoink UV -sarjan coating liquid DIL.',
    image: undefined,
  },
  {
    id: 'fallback-1513-chromoink-uv-1000ml-pullo-uv-cleaner',
    slug: '1513-chromoink-uv-1000-ml-pullo-uv-cleaner',
    name: 'Chromoink UV cleaner 1000 ml',
    shortDesc: 'Chromoink UV -sarjan puhdistusaine.',
    image: undefined,
  },
]

function extractColorCode(name: string) {
  if (/light cyan|\blc\b/i.test(name)) return 'LC'
  if (/light magenta|\blm\b/i.test(name)) return 'LM'
  if (/light black/i.test(name)) return 'LK'
  if (/\bcyan\b|,\s*c$/i.test(name)) return 'C'
  if (/\bmagenta\b|,\s*m$/i.test(name)) return 'M'
  if (/\byellow\b|,\s*y$/i.test(name)) return 'Y'
  if (/\bblack\b|,\s*k$/i.test(name)) return 'K'
  if (/\bwhite\b|,\s*w$/i.test(name)) return 'W'
  if (/\borange\b/i.test(name)) return 'O'
  return null
}

function buildInkCards(products: InkProduct[]) {
  const bySlug = new Map(products.map((product) => [product.slug, product]))

  const findByPrefix = (prefix: string) => products.filter((product) => product.slug.startsWith(prefix))
  const findByPrefixes = (prefixes: string[]) => prefixes.flatMap(findByPrefix)

  const createVariantCard = ({
    primarySlug,
    variantProducts,
    fallbackImageSlug,
  }: {
    primarySlug: string
    variantProducts: InkProduct[]
    fallbackImageSlug?: string
  }): InkCard | null => {
    const primary = bySlug.get(primarySlug)
    if (!primary) return null

    const codes = Array.from(
      new Set(
        variantProducts
          .map((product) => extractColorCode(product.name))
          .filter((code) => code !== null)
      )
    )

    const image = primary.images[0] || (fallbackImageSlug ? bySlug.get(fallbackImageSlug)?.images[0] : undefined)

    return {
      id: primary.id,
      slug: primary.slug,
      name: codes.length > 0 ? `${primary.name} (${codes.join(', ')})` : primary.name,
      shortDesc: primary.shortDesc,
      image,
    }
  }

  const createSingleCard = (slug: string): InkCard | null => {
    const product = bySlug.get(slug)
    if (!product) return null
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDesc: product.shortDesc,
      image: product.images[0],
    }
  }

  return [
    createVariantCard({
      primarySlug: 'jetbest-es3-varikasetti-440ml',
      variantProducts: findByPrefixes(['1141', '1142', '1143', '1144', '1145', '1146']),
    }),
    createVariantCard({
      primarySlug: 'jetbest-es3-tayttopullo-500ml',
      variantProducts: findByPrefixes(['1148', '1149', '1150', '1151', '1152', '1153']),
    }),
    createVariantCard({
      primarySlug: 'jetbest-ss21-varikasetti-440ml',
      variantProducts: findByPrefixes(['1155', '1156', '1157', '1158', '1159', '1168', '1169', '1179']),
      fallbackImageSlug: 'jetbest-es3-varikasetti-440ml',
    }),
    createVariantCard({
      primarySlug: 'jetbest-i2-varikasetti-440ml',
      variantProducts: findByPrefixes(['1160', '1161', '1162', '1163', '1164', '1165', '1166']),
      fallbackImageSlug: 'jetbest-es3-varikasetti-440ml',
    }),
    createSingleCard('jetbest-cleaning-solvent-220ml'),
    createSingleCard('jetbest-cleaning-solvent-440ml'),
    createSingleCard('cleaning-eco-solvent-1000ml'),
    createVariantCard({
      primarySlug: 'jetbest-lus170-uv-1l',
      variantProducts: findByPrefixes(['1541', '1542', '1543', '1544', '1545', '1546', '1547']),
    }),
    createSingleCard('jetbest-lus170-uv-cleaning-1l'),
    createVariantCard({
      primarySlug: 'chromoink-uv-1000ml',
      variantProducts: findByPrefixes(['1501', '1502', '1503', '1504', '1505', '1506', '1507']),
    }),
    createSingleCard('1511-chromoink-uv-1000-ml-pullo-coating-liquid-sti'),
    createSingleCard('1512-chromoink-uv-1000-ml-pullo-coating-liquid-dil'),
    createSingleCard('1513-chromoink-uv-1000-ml-pullo-uv-cleaner'),
  ].filter((card): card is InkCard => Boolean(card))
}

function buildCanonicalInkCards(products: InkProduct[]) {
  const availableSlugs = new Set(products.map((product) => product.slug))

  return canonicalInkCards.map((card) => ({
    ...card,
    slug: availableSlugs.has(card.slug) ? card.slug : '',
  }))
}

export default async function TulostusvaritPage() {
  let productCards = canonicalInkCards

  try {
    const products = await getInkProducts()
    const dbProductCards = buildInkCards(products)
    productCards = dbProductCards.length > 0 ? buildCanonicalInkCards(products) : canonicalInkCards
  } catch (error) {
    console.error('Failed to fetch ink products:', error)
  }

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
              className="inline-flex items-center gap-3 rounded-2xl bg-primary-600 px-7 py-4 text-white shadow-lg ring-4 ring-primary-100 hover:bg-primary-700 hover:shadow-xl transition-all"
              aria-label="Siirry tuotteisiin"
            >
              <span className="text-base font-semibold">Tuotteet</span>
              <ArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div id="tuotteet" className="mb-12 scroll-mt-28">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tuotteet</h2>
          {productCards.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCards.map((product) => {
                const cardClassName = 'bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group'
                const cardContent = (
                  <>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image.url}
                          alt={product.image.alt || product.name}
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
                  </>
                )

                if (product.slug) {
                  return (
                    <Link
                      key={product.id}
                      href={`/tuotteet/${product.slug}`}
                      className={cardClassName}
                    >
                      {cardContent}
                    </Link>
                  )
                }

                return (
                  <article key={product.id} className={cardClassName}>
                    {cardContent}
                  </article>
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
