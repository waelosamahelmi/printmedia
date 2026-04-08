'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Image from '@/components/ui/Image'

export type SparePartProduct = {
  id: string
  slug?: string
  name: string
  shortDesc: string | null
  images?: Array<{ url: string; alt: string | null }>
}

export type SparePartGroup = {
  id: string
  name: string
  products: SparePartProduct[]
}

export type AccessoryProduct = {
  id: string
  slug?: string
  name: string
  shortDesc: string | null
  category: { name: string } | null
  images?: Array<{ url: string; alt: string | null }>
}

type Props = {
  printerGroups: SparePartGroup[]
  cutterGroups: SparePartGroup[]
  accessories: AccessoryProduct[]
}

const SECTIONS = [
  { key: 'printer', label: 'Tulostimien varaosat' },
  { key: 'cutter', label: 'Leikkureiden varaosat' },
  { key: 'accessories', label: 'Tarvikkeet' },
] as const

type SectionKey = (typeof SECTIONS)[number]['key']

const ACCESSORY_GROUPS: { key: string; label: string; match: (name: string) => boolean }[] = [
  {
    key: 'banner',
    label: 'Banner-tarvikkeet',
    match: (name) => /banner|bungee|teippi/i.test(name),
  },
  {
    key: 'turvaviivaimet',
    label: 'Turvaviivaimet',
    match: (name) => /turvaviivain/i.test(name),
  },
  {
    key: 'puhdistus',
    label: 'Puhdistustarvikkeet',
    match: (name) => /puhdistus/i.test(name),
  },
]

export default function VaraosatContent({ printerGroups, cutterGroups, accessories }: Props) {
  const nonEmptyPrinter = printerGroups.filter((g) => g.products.length > 0)
  const nonEmptyCutter = cutterGroups.filter((g) => g.products.length > 0)
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section') as SectionKey | null
  const groupParam = searchParams.get('group')

  const accessoryGroups = ACCESSORY_GROUPS.map((group) => ({
    ...group,
    products: accessories.filter((p) => group.match(p.name)),
  })).filter((g) => g.products.length > 0)

  const defaultSection: SectionKey = (() => {
    if (sectionParam && ['printer', 'cutter', 'accessories'].includes(sectionParam)) return sectionParam
    return nonEmptyPrinter.length > 0 ? 'printer' : nonEmptyCutter.length > 0 ? 'cutter' : 'accessories'
  })()

  const defaultGroup = (() => {
    if (groupParam) {
      if (defaultSection === 'printer' && nonEmptyPrinter.some((g) => g.id === groupParam)) return groupParam
      if (defaultSection === 'cutter' && nonEmptyCutter.some((g) => g.id === groupParam)) return groupParam
    }
    return nonEmptyPrinter[0]?.id ?? nonEmptyCutter[0]?.id ?? ''
  })()

  const [section, setSection] = useState<SectionKey>(defaultSection)
  const [activeGroup, setActiveGroup] = useState<string>(defaultGroup)
  const [activeAccessoryGroup, setActiveAccessoryGroup] = useState<string>(
    accessoryGroups[0]?.key ?? ''
  )

  useEffect(() => {
    if (sectionParam && ['printer', 'cutter', 'accessories'].includes(sectionParam)) {
      setSection(sectionParam)
      if (sectionParam === 'printer') {
        const nextGroup = groupParam && nonEmptyPrinter.some((g) => g.id === groupParam)
          ? groupParam
          : (nonEmptyPrinter[0]?.id ?? '')
        setActiveGroup(nextGroup)
      } else if (sectionParam === 'cutter') {
        const nextGroup = groupParam && nonEmptyCutter.some((g) => g.id === groupParam)
          ? groupParam
          : (nonEmptyCutter[0]?.id ?? '')
        setActiveGroup(nextGroup)
      }
      else if (sectionParam === 'accessories') setActiveAccessoryGroup(accessoryGroups[0]?.key ?? '')
    }
  }, [sectionParam, groupParam])

  const handleSectionChange = (key: SectionKey) => {
    setSection(key)
    if (key === 'printer') setActiveGroup(nonEmptyPrinter[0]?.id ?? '')
    else if (key === 'cutter') setActiveGroup(nonEmptyCutter[0]?.id ?? '')
    else if (key === 'accessories') setActiveAccessoryGroup(accessoryGroups[0]?.key ?? '')
  }

  const currentGroups = section === 'printer' ? nonEmptyPrinter : nonEmptyCutter
  const currentGroup = currentGroups.find((g) => g.id === activeGroup)

  const renderCardAction = (slug?: string) => {
    if (!slug) return null

    return (
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link href={`/tuotteet/${slug}`}>
          <Button variant="secondary" size="sm">
            Lisätietoja
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Top section selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleSectionChange(s.key)}
              className={`px-6 py-3 rounded-full text-base font-bold transition-all border-2 shadow-sm ${
                section === s.key
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]'
                  : 'bg-white text-gray-800 border-gray-400 hover:border-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {s.label}
              {s.key === 'cutter' && nonEmptyCutter.length === 0 && (
                <span className="ml-2 text-xs font-normal opacity-60">tulossa</span>
              )}
            </button>
          ))}
      </div>

      {/* Spare parts: sub-category tab bar + product grid */}
      {(section === 'printer' || section === 'cutter') && (
        <>
          {currentGroups.length === 0 ? (
            <p className="text-gray-500 italic">Ei tuotteita vielä saatavilla.</p>
          ) : (
            <>
              {/* Sub-category tabs */}
              <div className="flex flex-wrap gap-2 mb-8 rounded-2xl bg-gray-50 border border-gray-200 p-4">
                {currentGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroup(g.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 shadow-sm ${
                      activeGroup === g.id
                        ? 'bg-primary-600 text-white border-primary-700 shadow-md scale-[1.02]'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50'
                    }`}
                  >
                    {g.name}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                        activeGroup === g.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {g.products.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Products */}
              {currentGroup && (
                <section key={currentGroup.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{currentGroup.name}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentGroup.products.map((product) => (
                      <article
                        key={product.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                      >
                        <div className="h-48 bg-white border-b border-gray-100">
                          <Image
                            src={product.images?.[0]?.url}
                            alt={product.images?.[0]?.alt || product.name}
                            width={800}
                            height={600}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                          {product.name}
                        </h3>
                        {product.shortDesc && (
                          <p className="text-sm text-gray-600 flex-1 mb-4">{product.shortDesc}</p>
                        )}
                        {renderCardAction(product.slug)}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}

      {/* Accessories: sub-category tabs + product grid */}
      {section === 'accessories' && (
        <>
          {accessoryGroups.length === 0 ? (
            <p className="text-gray-500 italic">Tarviketuotteita ei löytynyt vielä.</p>
          ) : (
            <>
              {/* Sub-category tabs */}
              <div className="flex flex-wrap gap-2 mb-8 rounded-2xl bg-gray-50 border border-gray-200 p-4">
                {accessoryGroups.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => setActiveAccessoryGroup(g.key)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 shadow-sm ${
                      activeAccessoryGroup === g.key
                        ? 'bg-primary-600 text-white border-primary-700 shadow-md scale-[1.02]'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50'
                    }`}
                  >
                    {g.label}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                        activeAccessoryGroup === g.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {g.products.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Products */}
              {(() => {
                const currentAccessoryGroup = accessoryGroups.find((g) => g.key === activeAccessoryGroup)
                return currentAccessoryGroup ? (
                  <section key={currentAccessoryGroup.key}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{currentAccessoryGroup.label}</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentAccessoryGroup.products.map((product) => (
                        <article
                          key={product.id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                        >
                          <div className="h-48 bg-white border-b border-gray-100">
                            <Image
                              src={product.images?.[0]?.url}
                              alt={product.images?.[0]?.alt || product.name}
                              width={800}
                              height={600}
                              className="w-full h-full object-contain p-4"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                            {product.name}
                          </h3>
                          {product.shortDesc && (
                            <p className="text-sm text-gray-600 flex-1 mb-4">{product.shortDesc}</p>
                          )}
                          {renderCardAction(product.slug)}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null
              })()}
            </>
          )}
        </>
      )}
    </div>
  )
}
