import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { prisma } from '@/lib/db'
import { ArrowLeft, Package, Grid3X3 } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug, isVisible: true },
    include: {
      products: {
        where: { status: 'PUBLISHED' },
        include: {
          images: { take: 1, orderBy: { sortOrder: 'asc' } }
        },
        orderBy: { sortOrder: 'asc' }
      },
      children: {
        where: { isVisible: true },
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })
  return category
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return { title: 'Kategoria ei löytynyt' }
  }

  return {
    title: category.name,
    description: category.description || `${category.name} - PrintMedia Finland`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-primary-600">Etusivu</Link>
            <span>/</span>
            <Link href="/laitteet" className="hover:text-primary-600">Laitteet</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-gray-600">
                  {category.description}
                </p>
              )}
            </div>
            {category.image && (
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Subcategories */}
      {category.children.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Grid3X3 className="w-6 h-6" />
              Alakategoriat
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/laitteet/${child.slug}`}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
                >
                  {child.image && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={child.image}
                        alt={child.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {child.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {child._count.products} tuotetta
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Products */}
      <section className="py-12">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Tuotteet ({category.products.length})
          </h2>
          
          {category.products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/tuotteet/${product.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                      {product.name}
                    </h3>
                    {product.shortDesc && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.shortDesc}
                      </p>
                    )}
                    {product.price && (
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        {new Intl.NumberFormat('fi-FI', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        }).format(Number(product.price))}
                      </p>
                    )}
                    {product.isFeatured && (
                      <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded mt-2">
                        Suosittu
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Ei tuotteita tässä kategoriassa.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Back link */}
      <section className="pb-8">
        <Container>
          <Link 
            href="/laitteet"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Takaisin laitteet-sivulle
          </Link>
        </Container>
      </section>

      {/* CTA */}
      <CTA
        title="Etkö löytänyt etsimääsi?"
        description="Kerro meille tarpeistasi, niin autamme sinua löytämään sopivan ratkaisun."
        primaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="dark"
      />
    </div>
  )
}
