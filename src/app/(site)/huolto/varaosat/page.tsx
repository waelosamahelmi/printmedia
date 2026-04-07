import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import VaraosatContent from './VaraosatContent'
import catalogSnapshot from '@/lib/fallback/catalogSnapshot.json'

export const metadata: Metadata = {
  title: 'Varaosat ja Tarvikkeet | PrintMedia PM Solutions Oy',
  description:
    'Varaosat ja kulutustarvikkeet tulostimiin ja leikkureihin. Alkuperäis- ja tarvikesosat ammattikäyttöön.',
}

const fallbackPrinterGroups = [
  {
    id: 'printer-fallback',
    name: 'Tulostimien varaosat',
    products: [
      {
        id: 'printer-fallback-card',
        name: 'Tulostimien tarvikkeet ja varaosat',
        shortDesc:
          'Pystymme toimittamaan niin alkuperais- kuin tarvikeosiakin moniin suurkuvatulostimiin. Varastostamme loytyy myos kulutusosia eri tulostimiin, esimerkiksi Mutoh-, Roland- ja Mimaki-laitteisiin.',
      },
    ],
  },
]

const fallbackCutterGroups = [
  {
    id: 'cutter-fallback',
    name: 'Leikkureiden varaosat',
    products: [
      {
        id: 'cutter-fallback-card',
        name: 'Leikkureiden varaosat',
        shortDesc:
          'Toimitamme leikkureihin teraa, kulutusosia ja muita varaosia ammattikayttoon. Kerro laitemalli ja tarpeesi, niin etsimme sopivat osat nopeasti.',
      },
    ],
  },
]

const fallbackAccessories = [
  {
    id: 'turvaviivain-tersreunalla',
    name: 'Turvaviivain terasreunalla',
    shortDesc: 'Tukeva alumiinirunko, terasreuna ja liukuesteet. Saatavilla pituudet 80 cm, 110 cm, 140 cm ja 170 cm.',
    category: { name: 'Turvaviivaimet' },
  },
  {
    id: 'turvaviivain-leikkurilla',
    name: 'Turvaviivain leikkurilla',
    shortDesc: 'Levea alumiinirunko, liukuesteet ja muovipaadyt. Saatavilla pituudet 120 cm, 180 cm ja 260 cm.',
    category: { name: 'Turvaviivaimet' },
  },
  {
    id: 'bungee-ball',
    slug: 'bungee-ball',
    name: 'Bungee ball',
    shortDesc: 'Kuminauhan paksuus 4 mm, pituus 150 mm. Pallon halkaisija 28 mm. Myydaan 50 kpl erissa.',
    category: { name: 'Banner-tarvikkeet' },
  },
  {
    id: 'bungee-hook',
    slug: 'bungee-hook',
    name: 'Bungee hook',
    shortDesc: 'Kuminauhan paksuus 4 mm, pituus 150 mm. Myydaan 50 kpl erissa.',
    category: { name: 'Banner-tarvikkeet' },
  },
  {
    id: 'banner-clip',
    slug: 'banner-clip',
    name: 'Banner clip',
    shortDesc: 'Nopea asentaa ja soveltuu eri paksuisille materiaaleille. Kiinnikkeen leveys 35 mm. Myydaan 100 kpl erissa.',
    category: { name: 'Banner-tarvikkeet' },
  },
]

export default async function VaraosatPage() {
  let sparePartRoots: Array<{ id: string; slug: string }> = []
  let sparePartCategories: Array<{ id: string; slug: string; name: string; parentId: string | null; products: Array<{ id: string; name: string; slug: string; shortDesc: string | null }> }> = []
  let looseSparePartCategories: typeof sparePartCategories = []
  let accessoryProducts: Array<{ id: string; slug: string; name: string; shortDesc: string | null; category: { name: string } | null }> = []

  try {
    sparePartRoots = await prisma.category.findMany({
      where: { slug: { in: ['tulostimien-varaosat', 'leikkureiden-varaosat'] } },
      select: { id: true, slug: true },
    })

    sparePartCategories = await prisma.category.findMany({
      where: {
        parentId: { in: sparePartRoots.map((r) => r.id) },
        isVisible: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        parentId: true,
        products: {
          where: { status: 'PUBLISHED' },
          select: { id: true, name: true, slug: true, shortDesc: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    looseSparePartCategories = await prisma.category.findMany({
      where: {
        isVisible: true,
        products: {
          some: { status: 'PUBLISHED' },
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        parentId: true,
        products: {
          where: { status: 'PUBLISHED' },
          select: { id: true, name: true, slug: true, shortDesc: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    accessoryProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        category: { slug: { in: ['muut-tarvikkeet', 'tarvikkeet'] } },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        shortDesc: true,
        category: { select: { name: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
  } catch (error) {
    console.error('Failed to fetch spare parts data:', error)
  }

  const rootBySlug = new Map(sparePartRoots.map((r) => [r.slug, r.id]))

  const printerGroups = sparePartCategories
    .filter((c) => c.parentId === rootBySlug.get('tulostimien-varaosat'))
    .map(({ id, name, products }) => ({ id, name, products }))

  const cutterGroups = sparePartCategories
    .filter((c) => c.parentId === rootBySlug.get('leikkureiden-varaosat'))
    .map(({ id, name, products }) => ({ id, name, products }))

  const sparePartKeywordRegex = /(capping|damper|enkood|huoltosarja|kaapeli|liitin|mekaan|moottor|o-?rengas|pidike|piirikortti|pumppu|rulla|sensori|sulake|suodatin|tulostuspa|wiper|letku|varaosa|printhead|head)/i

  const looseGroups = looseSparePartCategories
    .filter((category) => sparePartKeywordRegex.test(`${category.slug} ${category.name}`))
    .map(({ id, name, products }) => ({ id, name, products }))

  const loosePrinterGroups = looseGroups.filter(
    (group) => !/leikkuri|plotteri|cutter/i.test(group.name)
  )

  const looseCutterGroups = looseGroups.filter(
    (group) => /leikkuri|plotteri|cutter/i.test(group.name)
  )

  const hasPrimarySparePartGroups =
    printerGroups.some((group) => group.products.length > 0) ||
    cutterGroups.some((group) => group.products.length > 0)

  const resolvedPrinterGroups = process.env.NODE_ENV === 'production'
    ? catalogSnapshot.printerGroups
    : (hasPrimarySparePartGroups
      ? printerGroups
      : (loosePrinterGroups.length > 0 ? loosePrinterGroups : fallbackPrinterGroups))

  const resolvedCutterGroups = process.env.NODE_ENV === 'production'
    ? catalogSnapshot.cutterGroups
    : (hasPrimarySparePartGroups
      ? cutterGroups
      : (looseCutterGroups.length > 0 ? looseCutterGroups : fallbackCutterGroups))

  const resolvedAccessories = process.env.NODE_ENV === 'production'
    ? catalogSnapshot.accessories
    : (accessoryProducts.length > 0 ? accessoryProducts : fallbackAccessories)

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

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Varaosat ja Tarvikkeet</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Toimitamme alkuperäis- ja tarvikesosia sekä suurkuvatulostimiin että leikkureihin.
            Valitse osasto nähdäksesi tuotteet.
          </p>
        </div>

        <Suspense fallback={null}>
          <VaraosatContent
            printerGroups={resolvedPrinterGroups}
            cutterGroups={resolvedCutterGroups}
            accessories={resolvedAccessories}
          />
        </Suspense>

        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Tarvitsetko varaosia?</h2>
          <p className="text-primary-100 mb-6">
            Soita tai lähetä sähköpostia — autamme löytämään oikeat osat laitemallisi mukaan.
          </p>
          <Button href="/yhteystiedot" variant="secondary">Ota yhteyttä</Button>
        </div>
      </Container>
    </div>
  )
}
