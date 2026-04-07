'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Image from '@/components/ui/Image'

export type MaterialProduct = {
  id: string
  slug?: string
  name: string
  shortDesc: string | null
  description: string | null
  images: Array<{
    url: string
    alt: string | null
  }>
}

export type MaterialGroup = {
  key: string
  description: string
  products: MaterialProduct[]
}

export default function TulostusmateriaalitContent({ groups }: { groups: MaterialGroup[] }) {
  const [active, setActive] = useState(groups[0]?.key ?? '')

  const current = groups.find((g) => g.key === active)

  return (
    <div>
      {/* Category buttons */}
      <div className="flex flex-wrap gap-3 mb-10 rounded-2xl bg-gray-50 border border-gray-200 p-4 sm:p-5">
        {groups.map((g) => (
          <button
            key={g.key}
            onClick={() => setActive(g.key)}
            className={`px-5 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all border-2 shadow-sm ${
              active === g.key
                ? 'bg-primary-600 text-white border-primary-700 shadow-md scale-[1.02]'
                : 'bg-white text-gray-800 border-gray-300 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50'
            }`}
          >
            {g.key}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                active === g.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {g.products.length}
            </span>
          </button>
        ))}
      </div>

      {/* Active group */}
      {current && (
        <section key={current.key}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{current.key}</h2>
            <p className="text-gray-600">{current.description}</p>
          </div>
          {current.products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.products.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Product image */}
                  {product.images && product.images.length > 0 ? (
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  
                  {/* Text content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                      {product.name}
                    </h3>
                    {product.shortDesc && (
                      <p className="text-sm text-gray-600 flex-1 mb-4">{product.shortDesc}</p>
                    )}
                    {product.slug && (
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <Link href={`/tuotteet/${product.slug}`}>
                          <Button variant="secondary" size="sm">
                            Lisätietoja
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              Taman kategorian tuotteet paivittyvat tuotantoon pian. Rakenne vastaa localhost-versiota ja sisalto lisaantyy seuraavaksi tahan osioon.
            </div>
          )}
        </section>
      )}
    </div>
  )
}
