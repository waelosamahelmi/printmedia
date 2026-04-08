import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'

export const metadata: Metadata = {
  title: 'Laitteet | PrintMedia PM Solutions Oy',
  description:
    'Tarjoamme laajan valikoiman ammattitason tulostus- ja leikkauslaitteita. Olemme Docanin, GCC:n, Jingwein ja Fayonin valtuutettu jälleenmyyja Suomessa.',
}

type CategoryCard = {
  title: string
  description: string
  image: string
  images?: string[]
  href: string
  count?: number
}

const laiteSlugs = [
  'docan-uv-tulostimet',
  'gcc-tarraleikkurit',
  'monitoimileikkurit',
  'laminaattorit',
] as const

const fallbackCards: CategoryCard[] = [
  {
    title: 'Docan UV-tulostimet',
    description: 'Flatbed ja roll-to-roll UV-tulostimet monipuoliseen tulostukseen',
    image: '/images/devices/docan-m10-uv-clean.jpg',
    href: '/laitteet/docan-uv-tulostimet',
  },
  {
    title: 'GCC Tarraleikkurit',
    description: 'RXII Professional ja Jaguar V tarkkuusleikkurit',
    image: '/images/devices/cb03ii_500px_500x.jpg',
    href: '/laitteet/gcc-tarraleikkurit',
  },
  {
    title: 'Monitoimileikkurit',
    description: 'Jingwei CB03II ja CB08II flatbed-monitoimileikkurit',
    image: '/images/devices/J5-132.jpg',
    href: '/laitteet/monitoimileikkurit',
  },
  {
    title: 'Laminaattorit',
    description: 'Fayon FY1600 SE pneumaattinen kylmalaminaattori',
    image: '/images/devices/FY1600SE.jpg',
    href: '/laitteet/laminaattorit',
  },
]

async function getLaitteetCategories(): Promise<CategoryCard[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        slug: { in: [...laiteSlugs] },
        isVisible: true,
      },
      include: {
        _count: { select: { products: true } },
        products: {
          where: { status: 'PUBLISHED' },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
          take: 3,
        },
      },
    })

    if (categories.length === 0) {
      return fallbackCards
    }

    const bySlug = new Map(categories.map((category) => [category.slug, category]))

    return laiteSlugs.map((slug, index) => {
      const category = bySlug.get(slug)
      if (!category) {
        return fallbackCards[index]
      }

      const productImages = Array.from(
        new Set(category.products.flatMap((product) => product.images.map((image) => image.url)))
      ).slice(0, 3)

      return {
        title: category.name,
        description: category.description || fallbackCards[index].description,
        image: category.image || fallbackCards[index].image,
        images: productImages.length > 0 ? productImages : undefined,
        href: `/laitteet/${category.slug}`,
        count: category._count.products,
      }
    })
  } catch (error) {
    console.error('Failed to fetch laitteet categories:', error)
    return fallbackCards
  }
}

export default async function LaitteetPage() {
  const categories = await getLaitteetCategories()

  return (
    <div className="pt-32">
      <section className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Laitteet</h1>
            <p className="text-xl text-gray-600">
              Tarjoamme laajan valikoiman ammattitason tulostus- ja leikkauslaitteita.
              Olemme Docanin, GCC:n, Jingwein ja Fayonin valtuutettu jalleenmyyja Suomessa.
            </p>
          </div>
        </Container>
      </section>

      <CategoryGrid
        title="Laitekategoriat"
        subtitle="Valitse kategoria nahdaksesi kaikki tuotteet"
        categories={categories}
      />
    </div>
  )
}
