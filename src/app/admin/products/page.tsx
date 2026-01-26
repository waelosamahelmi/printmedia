import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/Button'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'

async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tuotteet</h1>
          <p className="text-gray-600">
            Hallitse tuotteita ({products.length} kpl)
          </p>
        </div>
        <Button href="/admin/products/new">
          <Plus className="w-5 h-5" />
          Lisää tuote
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Hae tuotteita..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
            <option value="">Kaikki kategoriat</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
            <option value="">Kaikki tilat</option>
            <option value="PUBLISHED">Julkaistu</option>
            <option value="DRAFT">Luonnos</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tuote
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kategoria
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hinta
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tila
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Päivitetty
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Toiminnot
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              ?
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.sku || '–'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category?.name || '–'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.price
                        ? new Intl.NumberFormat('fi-FI', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(Number(product.price))
                        : product.priceType === 'quote'
                        ? 'Kysy hinta'
                        : '–'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {product.status === 'PUBLISHED' ? 'Julkaistu' : 'Luonnos'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.updatedAt).toLocaleDateString('fi-FI')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tuotteet/${product.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Näytä"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="Muokkaa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Poista"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Ei tuotteita.{' '}
                    <Link
                      href="/admin/products/new"
                      className="text-primary-600 hover:underline"
                    >
                      Lisää ensimmäinen tuote
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
