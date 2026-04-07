import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import VaraosatContent from './VaraosatContent'

export const metadata: Metadata = {
  title: 'Varaosat ja Tarvikkeet | PrintMedia PM Solutions Oy',
  description:
    'Varaosat ja kulutustarvikkeet tulostimiin ja leikkureihin. Alkuperäis- ja tarvikesosat ammattikäyttöön.',
}

export default async function VaraosatPage() {
  const sparePartRoots = await prisma.category.findMany({
    where: { slug: { in: ['tulostimien-varaosat', 'leikkureiden-varaosat'] } },
    select: { id: true, slug: true },
  })

  const rootBySlug = new Map(sparePartRoots.map((r) => [r.slug, r.id]))

  const sparePartCategories = await prisma.category.findMany({
    where: {
      parentId: { in: sparePartRoots.map((r) => r.id) },
      isVisible: true,
    },
    include: {
      products: {
        where: { status: 'PUBLISHED' },
        select: { id: true, name: true, slug: true, shortDesc: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  const accessoryProducts = await prisma.product.findMany({
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

  const printerGroups = sparePartCategories
    .filter((c) => c.parentId === rootBySlug.get('tulostimien-varaosat'))
    .map(({ id, name, products }) => ({ id, name, products }))

  const cutterGroups = sparePartCategories
    .filter((c) => c.parentId === rootBySlug.get('leikkureiden-varaosat'))
    .map(({ id, name, products }) => ({ id, name, products }))

  const hasContent =
    printerGroups.some((group) => group.products.length > 0) ||
    cutterGroups.some((group) => group.products.length > 0) ||
    accessoryProducts.length > 0

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

        {hasContent ? (
          <Suspense fallback={null}>
            <VaraosatContent
              printerGroups={printerGroups}
              cutterGroups={cutterGroups}
              accessories={accessoryProducts}
            />
          </Suspense>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-700">
            Varaosa- ja tarvikesisaltoa tuodaan tuotantoon vaiheittain. Ota yhteytta, niin autamme oikeiden osien valinnassa jo nyt.
          </div>
        )}

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
