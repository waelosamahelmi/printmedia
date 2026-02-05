import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { CTA } from '@/components/sections/CTA'
import { prisma } from '@/lib/db'
import { ArrowLeft, Package, Tag, Info, FileText } from 'lucide-react'
import Link from 'next/link'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      documents: true
    }
  })
  return product
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
                <Link href={`/laitteet/${product.category.slug}`} className="hover:text-primary-600">
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

              {product.price && (
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary-600">
                    {new Intl.NumberFormat('fi-FI', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(Number(product.price))}
                  </span>
                </div>
              )}

              {/* Price Type */}
              {product.priceType === 'quote' && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-lg text-gray-600">Pyydä tarjous</span>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Tag className="w-4 h-4" />
                  <span>Tuotekoodi: {product.sku}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                <Button variant="primary" size="lg" href="/yhteystiedot">
                  Pyydä tarjous
                </Button>
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
            href={product.category ? `/laitteet/${product.category.slug}` : '/laitteet'}
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
