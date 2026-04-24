'use client'

import { useMemo, useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, FileDown, X, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { priceListSections, type PriceListSection } from './priceListData'

interface CategoryGroup {
  name: string
  slug: string
  sections: PriceListSection[]
}

interface OrderItem {
  key: string
  name: string
  code: string
  qty: number
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
  if (section.title === 'Huolto') {
    return { slug: 'huolto', name: 'Huolto' }
  }

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

function buildBulkOrderUrl(items: OrderItem[]) {
  const params = new URLSearchParams({ aihe: 'tarjouspyynto' })
  items.forEach(item => {
    params.append('tuote', item.name)
    params.append('koodi', item.code)
    params.append('maara', String(item.qty))
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
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({})
  const [isOrderOpen, setIsOrderOpen] = useState(false)

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

  const addToOrder = (sectionId: string, productName: string, code: string) => {
    const key = `${sectionId}-${code}`
    const qty = quantities[key] ?? 1

    setOrderItems(prev => {
      const existing = prev[key]
      return {
        ...prev,
        [key]: {
          key,
          name: productName,
          code,
          qty: existing ? existing.qty + qty : qty,
        },
      }
    })
  }

  const updateOrderQty = (key: string, qty: number) => {
    setOrderItems(prev => {
      const existing = prev[key]
      if (!existing) return prev
      return {
        ...prev,
        [key]: { ...existing, qty: Math.max(1, qty) },
      }
    })
  }

  const removeOrderItem = (key: string) => {
    setOrderItems(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const clearOrder = () => {
    setOrderItems({})
  }

  const orderList = Object.values(orderItems)
  const orderLineCount = orderList.length
  const orderTotalQty = orderList.reduce((sum, item) => sum + item.qty, 0)

  const submitOrderRequest = () => {
    if (orderLineCount === 0) return
    router.push(buildBulkOrderUrl(orderList))
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

      <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-medium text-black mb-0.5">Etkö löydä etsimääsi?</p>
          <p className="font-medium text-black">
            Ei hätää — meiltä löytyy myös paljon tuotteita, joita ei näy nettisivuillamme. Kysy lisää!
          </p>
        </div>
        <a
          href="/yhteystiedot?aihe=tuotetiedustelu"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors whitespace-nowrap shrink-0"
        >
          Kysy myynnistä
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

      {/* Desktop: floating button top-right */}
      <div className="hidden sm:block fixed top-32 right-6 z-40 pointer-events-none">
        <button
          onClick={() => setIsOrderOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full border-2 border-white bg-primary-600 px-6 py-4 text-base font-bold text-white shadow-2xl hover:bg-primary-700 transition-colors"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>
          <ShoppingCart className="w-4 h-4" />
          Avaa tilaus ({orderLineCount})
        </button>
      </div>

      {/* Mobile: bottom bar, visible only when items added */}
      {orderLineCount > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white border-t border-gray-200 shadow-2xl">
          <button
            onClick={() => setIsOrderOpen(true)}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-primary-600 px-6 py-4 text-base font-bold text-white hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Avaa tilaus ({orderLineCount} tuotetta)
          </button>
        </div>
      )}

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
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600 sm:px-5">Tuote</th>
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600 hidden sm:table-cell">Tuotenro</th>
                            <th className="text-left px-4 py-2.5 font-medium text-gray-600 hidden md:table-cell">Tiedot</th>
                            <th className="text-right px-2 py-2.5 font-medium text-gray-600 sm:px-5">Hinta (ALV 0%)</th>
                            <th className="text-right px-2 py-2.5 font-medium text-gray-600 sm:px-4">Tilaa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.products.map((product, index) => (
                            <tr
                              key={`${section.id}-${product.code}-${index}`}
                              className={`border-b border-gray-100 last:border-0 hover:bg-primary-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                              <td className="px-3 py-3 font-medium text-gray-900 sm:px-5">{normalizeText(product.name)}</td>
                              <td className="px-3 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">{product.code}</td>
                              <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-md">{product.details ? normalizeText(product.details) : '—'}</td>
                              <td className="px-2 py-3 text-right font-semibold text-gray-900 sm:px-5">{product.price}</td>
                              <td className="px-2 py-3 text-right sm:px-4">
                                {/* Desktop: qty input + full button */}
                                <div className="hidden sm:flex items-center justify-end gap-1.5">
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
                                  <button
                                    onClick={() => addToOrder(section.id, normalizeText(product.name), product.code)}
                                    className="inline-flex items-center gap-1 bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                                  >
                                    <ShoppingCart className="w-3 h-3" />
                                    Lisää tilaukseen
                                  </button>
                                </div>
                                {/* Mobile: qty input + icon button */}
                                <div className="sm:hidden flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    min="1"
                                    value={quantities[`${section.id}-${product.code}`] ?? 1}
                                    onChange={(e) => {
                                      const val = Math.max(1, parseInt(e.target.value) || 1)
                                      setQuantities(prev => ({ ...prev, [`${section.id}-${product.code}`]: val }))
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-12 text-center border border-gray-300 rounded py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                                  />
                                  <button
                                    onClick={() => addToOrder(section.id, normalizeText(product.name), product.code)}
                                    className="inline-flex items-center justify-center bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                                    aria-label="Lisää tilaukseen"
                                  >
                                    <ShoppingCart className="w-4 h-4" />
                                  </button>
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

      {isOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 sm:p-6 flex items-end sm:items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tilauksesi</h3>
                <p className="text-sm text-gray-500">{orderLineCount} tuotetta, yhteensä {orderTotalQty} kpl</p>
              </div>
              <button
                onClick={() => setIsOrderOpen(false)}
                className="rounded-md p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Sulje tilaus"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-5 py-4">
              {orderLineCount === 0 ? (
                <p className="text-sm text-gray-500">Tilaus on tyhjä. Lisää tuotteita hinnastosta.</p>
              ) : (
                <div className="space-y-3">
                  {orderList.map(item => (
                    <div key={item.key} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{item.code}</p>
                        </div>
                        <button
                          onClick={() => removeOrderItem(item.key)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Poista
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="text-sm text-gray-600">Määrä</label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateOrderQty(item.key, parseInt(e.target.value) || 1)}
                          className="w-20 text-center border border-gray-300 rounded py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <button
                onClick={clearOrder}
                className="text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                disabled={orderLineCount === 0}
              >
                Tyhjennä tilaus
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOrderOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                >
                  Jatka ostoksia
                </button>
                <button
                  onClick={submitOrderRequest}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={orderLineCount === 0}
                >
                  Pyydä tarjous
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
