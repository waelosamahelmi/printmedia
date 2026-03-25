'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, FileDown, X, ChevronDown, ChevronUp } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string | null
  price: string | null
  priceType: string | null
  shortDesc: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

interface CategoryGroup {
  name: string
  slug: string
  products: Product[]
}

export default function HinnastoContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/products/public')
      .then(r => r.json())
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    products.forEach(p => {
      if (p.category) seen.set(p.category.slug, p.category.name)
    })
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }))
  }, [products])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter(p => {
      const matchesSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku?.toLowerCase().includes(q) ?? false) ||
        (p.shortDesc?.toLowerCase().includes(q) ?? false)
      const matchesCat = selectedCategory === 'all' || p.category?.slug === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [products, search, selectedCategory])

  const grouped = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, CategoryGroup>()
    filtered.forEach(p => {
      const key = p.category?.slug ?? 'muu'
      const name = p.category?.name ?? 'Muut'
      if (!map.has(key)) map.set(key, { name, slug: key, products: [] })
      map.get(key)!.products.push(p)
    })
    return Array.from(map.values())
  }, [filtered])

  const toggleCategory = (slug: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const formatPrice = (price: string | null, priceType: string | null) => {
    if (priceType === 'quote' || priceType === 'call') return 'Kysy hinta'
    if (!price) return '—'
    const num = parseFloat(price)
    return num.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  }

  return (
    <div>
      {/* PDF download banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-medium text-primary-900">Hinnasto on saatavilla myös PDF-muodossa</p>
          <p className="text-sm text-primary-700">Hinnasto 2023 — kaikki tuotteet yhdessä tiedostossa</p>
        </div>
        <a
          href="/files/PrintMedia_-_HINNASTO_2023_V2.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors whitespace-nowrap shrink-0"
        >
          <FileDown className="w-4 h-4" />
          Avaa PDF
        </a>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Hae tuotetta nimellä tai tuotenumerolla..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="py-2.5 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white"
        >
          <option value="all">Kaikki kategoriat</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {(search || selectedCategory !== 'all') && !loading && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} tuotetta löytyi
          {search && <span> hakusanalla "<strong>{search}</strong>"</span>}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-32" />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Ei tuloksia</p>
          <p className="text-sm mt-1">Kokeile eri hakusanaa tai valitse toinen kategoria</p>
        </div>
      )}

      {/* Product groups */}
      {!loading && grouped.map(group => {
        const isCollapsed = collapsedCategories.has(group.slug)
        return (
          <div key={group.slug} className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(group.slug)}
              className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <span className="font-semibold text-gray-800">{group.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">{group.products.length} tuotetta</span>
                {isCollapsed ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
              </div>
            </button>

            {/* Products table */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-white">
                      <th className="text-left px-5 py-2.5 font-medium text-gray-600 w-1/3">Tuote</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600">Tuotenro</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 hidden md:table-cell">Kuvaus</th>
                      <th className="text-right px-5 py-2.5 font-medium text-gray-600">Hinta (ALV 0%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.products.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b border-gray-100 last:border-0 hover:bg-primary-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">{p.shortDesc ?? '—'}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900">
                          {formatPrice(p.price, p.priceType)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
