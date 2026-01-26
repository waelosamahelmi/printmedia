import Link from 'next/link'
import { prisma } from '@/lib/db'
import {
  FileText,
  Package,
  Image as ImageIcon,
  Users,
  Eye,
  TrendingUp,
  Clock,
} from 'lucide-react'

async function getStats() {
  const [pagesCount, productsCount, categoriesCount, usersCount] =
    await Promise.all([
      prisma.page.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
    ])

  return { pagesCount, productsCount, categoriesCount, usersCount }
}

async function getRecentProducts() {
  return prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
}

async function getRecentPages() {
  return prisma.page.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentProducts = await getRecentProducts()
  const recentPages = await getRecentPages()

  const statCards = [
    {
      name: 'Sivut',
      value: stats.pagesCount,
      icon: FileText,
      href: '/admin/pages',
      color: 'bg-blue-500',
    },
    {
      name: 'Tuotteet',
      value: stats.productsCount,
      icon: Package,
      href: '/admin/products',
      color: 'bg-green-500',
    },
    {
      name: 'Kategoriat',
      value: stats.categoriesCount,
      icon: ImageIcon,
      href: '/admin/products/categories',
      color: 'bg-purple-500',
    },
    {
      name: 'Käyttäjät',
      value: stats.usersCount,
      icon: Users,
      href: '/admin/users',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Tervetuloa PrintMedia hallintapaneeliin
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.name}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Viimeisimmät tuotteet
            </h2>
            <Link
              href="/admin/products"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Näytä kaikki →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.category?.name || 'Ei kategoriaa'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString('fi-FI')}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Ei tuotteita vielä.{' '}
                <Link
                  href="/admin/products/new"
                  className="text-primary-600 hover:underline"
                >
                  Lisää ensimmäinen tuote
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Viimeksi muokatut sivut
            </h2>
            <Link
              href="/admin/pages"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Näytä kaikki →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPages.length > 0 ? (
              recentPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/admin/pages/${page.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {page.title}
                    </div>
                    <div className="text-sm text-gray-500">/{page.slug}</div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      page.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {page.status === 'PUBLISHED' ? 'Julkaistu' : 'Luonnos'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Ei sivuja vielä.{' '}
                <Link
                  href="/admin/pages/new"
                  className="text-primary-600 hover:underline"
                >
                  Lisää ensimmäinen sivu
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pikatoiminnot
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Lisää tuote</span>
          </Link>
          <Link
            href="/admin/pages/new"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Lisää sivu</span>
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Lataa media</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Näytä sivusto</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
