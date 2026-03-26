'use client'

import { useMemo, useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, FileDown, X, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { priceListSections, type PriceListSection } from './priceListData'

interface CategoryGroup {
  name: string
  slug: string
  sections: PriceListSection[]
}

const INK_SECTION_TITLES = new Set([
  'Jetbest ES3 - värikasetti 440 ml',
  'Jetbest ES3 - täyttöpullo 500 ml',
  'Jetbest SS21 – värikasetti 440 ml',
  'Jetbest I-2 – värikasetti 440 ml',
  'Jetbest puhdistuskasetit 220 ml',
  'Puhdistusaineet 1 L',
  'Jetbest LUS-170',
  'Chromoink',
])

const DISPLAY_SECTION_TITLES = new Set([
  'Spyro',
  'Export',
  'Luxury',
  'Deluxe',
  'Newly',
  'Mini Roll Up',
  'Roll up -tarvikkeet',
  'Promopöytä-1',
  'Promopöytä-2',
  'Promopöytä-4',
  'Suorat messuseinä',
  'Kaarevat messuseinät',
  'Lisävarusteet',
  'Esitetelineet',
  'Julistelistat',
  'X Banner',
])

const TOOLS_SECTION_TITLES = new Set([
  'Turvaviivain teräsreunalla',
  'Turvaviivain leikkurilla',
  'Kiinnitystarvikkeet',
  'Leikkurinterät',
  'Puhdistustarvikkeet',
  'Mediaklipsit avattujen rullien kiinnittämiseen',
])

function resolveCategory(section: PriceListSection) {
  if (INK_SECTION_TITLES.has(section.title)) {
    return { slug: 'tulostusvarit', name: 'Tulostusvärit' }
  }

  if (DISPLAY_SECTION_TITLES.has(section.title)) {
    return { slug: 'display-tuotteet', name: 'Display-tuotteet' }
  }

  if (TOOLS_SECTION_TITLES.has(section.title)) {
    return { slug: 'tarvikkeet-ja-tyokalut', name: 'Tarvikkeet ja työkalut' }
  }

  return { slug: 'tulostusmateriaalit', name: 'Tulostusmateriaalit' }
}

function normalizePrice(price: string) {
  return price.replace(/\?/g, '€').trim()
}

function normalizeText(text: string) {
  return text
    .replace(/K\?\?ntyv\?/g, 'Kääntyvä')
    .replace(/k\?\?ntyv\?/g, 'kääntyvä')
    .replace(/kiilt\?v\?/g, 'kiiltävä')
    .replace(/k\?sittely\?/g, 'käsittelyä')
    .replace(/ehk\?isee/g, 'ehkäisee')
    .replace(/Neli\?hinta/g, 'Neliöhinta')
    .replace(/pitk\?/g, 'pitkä')
    .replace(/leve\?/g, 'leveä')
    .replace(/k\?rki/g, 'kärki')
    .replace(/([A-Za-zÅÄÖåäö])€([A-Za-zÅÄÖåäö])/g, '$1ä$2')
    .replace(/([A-Za-zÅÄÖåäö])\?([A-Za-zÅÄÖåäö])/g, '$1ä$2')
}

function buildOrderUrl(productName: string, code: string, qty: number) {
  const params = new URLSearchParams({
    aihe: 'tarjouspyynto',
    tuote: productName,
    koodi: code,
    maara: String(qty),
  })
  return `/yhteystiedot?${params.toString()}`
}

export default function HinnastoContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('hae') ?? '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    const q = searchParams.get('hae')
    if (q) setSearch(q)
  }, [searchParams])
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const sections = useMemo(() => {
    return priceListSections.map(section => {
      const category = resolveCategory(section)

      return {
        ...section,
        category: category.name,
        categorySlug: category.slug,
        products: section.products.map(product => ({
          ...product,
          price: normalizePrice(product.price),
        })),
      }
    })
  }, [])

  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    sections.forEach(section => {
      seen.set(section.categorySlug, section.category)
    })
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }))
  }, [sections])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return sections
      .map(section => {
        const matchesCategory = selectedCategory === 'all' || section.categorySlug === selectedCategory
        const products = section.products.filter(product => {
          return !q ||
            product.name.toLowerCase().includes(q) ||
            product.code.toLowerCase().includes(q) ||
            product.details.toLowerCase().includes(q) ||
            section.title.toLowerCase().includes(q) ||
            section.description.toLowerCase().includes(q)
        })

        if (!matchesCategory || products.length === 0) {
          return null
        }

        return {
          ...section,
          products,
        }
      })
      .filter((section): section is PriceListSection => section !== null)
  }, [sections, search, selectedCategory])

  const grouped = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, CategoryGroup>()
    filtered.forEach(section => {
      const key = section.categorySlug
      const name = section.category
      if (!map.has(key)) {
        map.set(key, { name, slug: key, sections: [] })
      }
      map.get(key)!.sections.push(section)
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

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    router.replace(pathname, { scroll: false })
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
          <p className="text-sm text-primary-700">Hinnasto — kaikki tuotteet yhdessä tiedostossa</p>
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
              onClick={clearFilters}
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

      {(search || selectedCategory !== 'all') && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-amber-900">
            Suodatus on päällä. Näytät vain hakutuloksia, et koko hinnastoa.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Näytä koko hinnasto
          </button>
        </div>
      )}

      {/* Results count */}
      {(search || selectedCategory !== 'all') && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.reduce((sum, section) => sum + section.products.length, 0)} tuotetta löytyi
          {search && <span> hakusanalla "<strong>{search}</strong>"</span>}
        </p>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-800">Ei tuloksia</p>
          <p className="text-sm mt-1">Kokeile eri hakusanaa tai valitse toinen kategoria</p>
          <div className="mt-8 inline-block bg-primary-50 border border-primary-200 rounded-xl px-6 py-4 text-left max-w-md">
            <p className="text-sm font-semibold text-primary-800 mb-1">Etkö löydä etsimääsi?</p>
            <p className="text-sm text-primary-700">Ei hätää — meiltä löytyy myös paljon tuotteita, joita ei näy nettisivuillamme. Kysy lisää!</p>
            <a
              href="/yhteystiedot?aihe=tuotetiedustelu"
              className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:text-primary-800 underline underline-offset-2"
            >
              Kysy myynnistä →
            </a>
          </div>
        </div>
      )}

      {/* Product groups */}
      {grouped.map(group => {
        const isCollapsed = collapsedCategories.has(group.slug)
        const productCount = group.sections.reduce((sum, section) => sum + section.products.length, 0)

        return (
          <div key={group.slug} className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(group.slug)}
              className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <span className="font-semibold text-gray-800">{group.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">{productCount} tuotetta</span>
                {isCollapsed ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
              </div>
            </button>

            {/* Products table */}
            {!isCollapsed && (
              <div className="divide-y divide-gray-200 bg-white">
                {group.sections.map(section => (
                  <section key={section.id} className="p-4 sm:p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      {section.description && (
                        <p className="mt-1 text-sm text-gray-600">{normalizeText(section.description)}</p>
                      )}
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left px-5 py-2.5 font-medium text-gray-600 w-[30%]">Tuote</th>
                            <th className="text-left px-4 py-2.5 font-medium text-gray-600">Tuotenro</th>
                            <th className="text-left px-4 py-2.5 font-medium text-gray-600 hidden md:table-cell">Tiedot</th>
                            <th className="text-right px-5 py-2.5 font-medium text-gray-600">Hinta (ALV 0%)</th>
                            <th className="text-right px-4 py-2.5 font-medium text-gray-600">Tilaa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.products.map((product, index) => (
                            <tr
                              key={`${section.id}-${product.code}-${index}`}
                              className={`border-b border-gray-100 last:border-0 hover:bg-primary-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                              <td className="px-5 py-3 font-medium text-gray-900">{normalizeText(product.name)}</td>
                              <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.code}</td>
                              <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-md">{product.details ? normalizeText(product.details) : '—'}</td>
                              <td className="px-5 py-3 text-right font-semibold text-gray-900">{product.price}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <input
                                    type="number"
                                    min="1"
                                    value={quantities[`${section.id}-${product.code}`] ?? 1}
                                    onChange={(e) => {
                                      const val = Math.max(1, parseInt(e.target.value) || 1)
                                      setQuantities(prev => ({ ...prev, [`${section.id}-${product.code}`]: val }))
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-14 text-center border border-gray-300 rounded py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                  />
                                  <Link
                                    href={buildOrderUrl(
                                      normalizeText(product.name),
                                      product.code,
                                      quantities[`${section.id}-${product.code}`] ?? 1
                                    )}
                                    className="inline-flex items-center gap-1 bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                                  >
                                    <ShoppingCart className="w-3 h-3" />
                                    Pyydä tarjous
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
