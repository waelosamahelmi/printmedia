import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { CTA } from '@/components/sections/CTA'
import { prisma } from '@/lib/db'
import { ArrowLeft, Package, Tag, Info, FileText, ListOrdered } from 'lucide-react'
import Link from 'next/link'
import productsSnapshot from '@/lib/fallback/productsSnapshot.json'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

type ProductShape = {
  id: string
  slug: string
  name: string
  shortDesc: string | null
  description: string | null
  specs: string | null
  sku: string | null
  category: {
    id: string
    name: string
    slug: string
    parent: { slug: string } | null
  } | null
  images: Array<{ url: string; alt: string | null }>
  documents: Array<{ url: string; name: string }>
}

const fallbackProductBySlug = new Map(
  (productsSnapshot as ProductShape[]).map((product) => [product.slug, product])
)

function getFallbackProduct(slug: string): ProductShape | null {
  return fallbackProductBySlug.get(slug) || null
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: {
          include: {
            parent: {
              select: {
                slug: true,
              },
            },
          },
        },
        images: { orderBy: { sortOrder: 'asc' } },
        documents: true,
      },
    })

    if (product) {
      return product
    }
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error)
  }

  if (process.env.NODE_ENV === 'production') {
    return getFallbackProduct(slug)
  }

  return null
}

function getCategoryHref(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  if (!product.category) return '/laitteet'

  const category = product.category
  const parentSlug = category.parent?.slug

  if (parentSlug === 'tulostimien-varaosat') {
    return `/huolto/varaosat?section=printer&group=${category.id}`
  }

  if (parentSlug === 'leikkureiden-varaosat') {
    return `/huolto/varaosat?section=cutter&group=${category.id}`
  }

  if (category.slug === 'muut-tarvikkeet' || parentSlug === 'muut-tarvikkeet') {
    return '/huolto/varaosat?section=accessories'
  }

  return `/laitteet/${category.slug}`
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return { title: 'Tuote ei löytynyt' }
  }

  return {
    title: product.name,
    description: product.shortDesc || '',
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const categoryHref = getCategoryHref(product)

  return (
    <div className="pt-32">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Etusivu</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={categoryHref} className="hover:text-primary-600">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </div>
        </Container>
      </section>

      {/* Product Details */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                {product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-24 h-24" />
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image: { url: string; alt: string | null }, idx: number) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt || `${product.name} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.category && (
                <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {product.category.name}
                </span>
              )}
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {product.shortDesc && (
                <p className="text-xl text-gray-600 mb-6">
                  {product.shortDesc}
                </p>
              )}



              {/* SKU */}
              {product.sku && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Tag className="w-4 h-4" />
                  <span>Tuotekoodi: {product.sku}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  href={`/hinnasto?hae=${encodeURIComponent(product.sku || product.name)}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ListOrdered className="w-4 h-4" />
                    Katso hinnastosta
                  </span>
                </Button>
                <Link
                  href="/yhteystiedot"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:border-primary-400 hover:text-primary-700 transition-colors"
                >
                  Pyydä tarjous
                </Link>
                <Button variant="secondary" size="lg" href="tel:+358440875025">
                  Soita meille
                </Button>
              </div>

              {/* Documents */}
              {product.documents.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Ladattavat tiedostot
                  </h3>
                  <div className="space-y-2">
                    {product.documents.map((doc: { url: string; name: string }, idx: number) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                      >
                        <FileText className="w-4 h-4" />
                        {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Description */}
      {product.description && (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6" />
                Tuotekuvaus
              </h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Specs */}
      {product.specs && (
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tekniset tiedot
              </h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.specs }}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Back link */}
      <section className="pb-8">
        <Container>
          <Link 
            href={categoryHref}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Takaisin
          </Link>
        </Container>
      </section>

      {/* CTA */}
      <CTA
        title="Kiinnostaako tämä tuote?"
        description="Ota yhteyttä ja kerro tarpeistasi. Autamme sinua löytämään parhaan ratkaisun."
        primaryCta={{ text: 'Pyydä tarjous', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="gradient"
      />
    </div>
  )
}
