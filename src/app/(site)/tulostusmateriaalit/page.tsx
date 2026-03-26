import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import TulostusmateriaalitContent from './TulostusmateriaalitContent'
import type { MaterialGroup } from './TulostusmateriaalitContent'

export const metadata: Metadata = {
  title: 'Tulostusmateriaalit | PrintMedia PM Solutions Oy',
  description:
    'Tulostusmateriaalit: Tarrat, Kalvot, Pressut, Bannerit, Paperit, Kankaat ja Laminaatit suurkuvatulostukseen.',
}

const GROUP_DEFS: { key: string; description: string }[] = [
  { key: 'Tarrat', description: 'Polymeeritarrat, monomeeritarrat ja erikoistarrat rullatavarana.' },
  { key: 'Kalvot', description: 'Roll up -kalvot, pop up -kalvot ja valomainoskalvot.' },
  { key: 'Pressut', description: 'Frontlit- ja muut banneripressut sisä- ja ulkokäyttöön.' },
  { key: 'Bannerit', description: 'Tulostusbannerimateriaalit.' },
  { key: 'Paperit', description: 'Valokuvapaperit, blueback-paperi, synteettinen paperi ja art canvas.' },
  { key: 'Kankaat', description: 'Non woven vohvelikangas ja muut kankaat suurkuvatulostukseen.' },
  { key: 'Laminaatit', description: 'Monomer- ja polymeerilaminaatit laminaattoreille.' },
  { key: 'Muut', description: 'Muut tulostusmateriaalit.' },
]

function resolveMaterialGroup(name: string, shortDesc: string | null): string {
  const text = `${name} ${shortDesc || ''}`.toLowerCase()
  if (text.includes('laminaat')) return 'Laminaatit'
  if (text.includes('tarra')) return 'Tarrat'
  if (
    text.includes('kalvo') ||
    text.includes('film') ||
    text.includes('polymeer') ||
    text.includes('monomeer') ||
    text.includes('valomainos')
  ) return 'Kalvot'
  if (text.includes('pressu') || text.includes('frontlit')) return 'Pressut'
  if (text.includes('banner')) return 'Bannerit'
  if (
    text.includes('paper') ||
    text.includes('blueback') ||
    text.includes('valokuva') ||
    text.includes('synteettinen')
  ) return 'Paperit'
  if (
    text.includes('kangas') ||
    text.includes('canvas') ||
    text.includes('vohvel') ||
    text.includes('non woven')
  ) return 'Kankaat'
  return 'Muut'
}

export default async function TulostusmateriaalitPage() {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: { slug: 'tulostusmateriaalit' },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDesc: true,
      description: true,
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  const byGroup: Record<string, typeof products> = {}
  for (const g of GROUP_DEFS) byGroup[g.key] = []
  for (const p of products) {
    const g = resolveMaterialGroup(p.name, p.shortDesc)
    if (!byGroup[g]) byGroup[g] = []
    byGroup[g].push(p)
  }

  const groups: MaterialGroup[] = GROUP_DEFS.map(({ key, description }) => ({
    key,
    description,
    products: byGroup[key] ?? [],
  }))

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
            Varastostamme löytyy laaja valikoima erilaisia tulostusmedioita
            rullatavarana eri tulostimille. Valitse kategoria nähdäksesi tuotteet.
          </p>
        </div>

        <TulostusmateriaalitContent groups={groups} />

        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Tarvitsetko tulostusmateriaaleja?</h2>
          <p className="text-primary-100 mb-6">
            Kysy tarjous tai lisätietoja valikoimastamme — autamme löytämään sopivan materiaalin.
          </p>
          <Button href="/yhteystiedot" variant="secondary">Ota yhteyttä</Button>
        </div>
      </Container>
    </div>
  )
}
