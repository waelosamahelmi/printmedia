'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Image as ImageIcon, Loader, Check, Search, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  caption: string | null
  isPrimary: boolean
  sortOrder: number
}

interface Product {
  id: string
  name: string
  slug: string
  category: { name: string } | null
  images: ProductImage[]
}

export default function GalleriesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin-login')
  }, [status, router])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products')
      if (!res.ok) throw new Error('Tuotteiden haku epÃ¤onnistui')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Virhe')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (productId: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }

  const notify = (msg: string, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }
  }

  const handleUpload = useCallback(async (productId: string, files: FileList) => {
    if (!files.length) return
    setUploading(productId)

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('alt', '')

        const res = await fetch(`/api/admin/products/${productId}/images`, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Lataus epÃ¤onnistui')
        }
      }

      await fetchProducts()
      // Auto-expand after upload
      setExpanded(prev => new Set(prev).add(productId))
      notify(`${files.length} kuva${files.length > 1 ? 'a' : ''} ladattu!`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Virhe', true)
    } finally {
      setUploading(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, productId: string) => {
    e.preventDefault()
    setDragOver(null)
    if (e.dataTransfer.files.length) handleUpload(productId, e.dataTransfer.files)
  }, [handleUpload])

  const handleDelete = async (productId: string, imageId: string) => {
    if (!confirm('Poistetaanko kuva?')) return
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Poisto epÃ¤onnistui')
      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, images: p.images.filter(img => img.id !== imageId) }
          : p
      ))
      notify('Kuva poistettu')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Virhe', true)
    }
  }

  const handleSetPrimary = async (productId: string, imageId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('EpÃ¤onnistui')
      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, images: p.images.map(img => ({ ...img, isPrimary: img.id === imageId })) }
          : p
      ))
      notify('PÃ¤Ã¤kuva asetettu')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Virhe', true)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6 space-y-4">

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tuotekuvat</h1>
              <p className="text-gray-600 text-sm mt-1">
                Lataa ja hallinnoi tuotekuvia. PÃ¤Ã¤kuva nÃ¤kyy tuotelistauksissa.
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Hae tuotetta tai kategoriaa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
              />
            </div>

            {/* Products list */}
            <div className="space-y-2">
              {filteredProducts.map(product => {
                const isExpanded = expanded.has(product.id)
                const isUploading = uploading === product.id
                const isDragTarget = dragOver === product.id

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl border-2 transition-colors ${
                      isDragTarget ? 'border-primary-400 bg-primary-50' : 'border-gray-200'
                    }`}
                    onDragOver={e => { e.preventDefault(); setDragOver(product.id) }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => handleDrop(e, product.id)}
                  >
                    {/* Product header row */}
                    <div className="flex items-center gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {product.images.length > 0 ? (
                          <img
                            src={product.images.find(i => i.isPrimary)?.url || product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Name & info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.category?.name || 'â€”'} &middot;{' '}
                          {product.images.length === 0
                            ? <span className="text-orange-500">Ei kuvia</span>
                            : <span className="text-green-600">{product.images.length} kuva{product.images.length !== 1 ? 'a' : ''}</span>
                          }
                        </p>
                      </div>

                      {/* Upload button */}
                      <div>
                        <input
                          ref={el => { fileInputRefs.current[product.id] = el }}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={e => e.target.files && handleUpload(product.id, e.target.files)}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRefs.current[product.id]?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isUploading
                            ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Ladataan...</>
                            : <><Upload className="w-3.5 h-3.5" /> Lataa</>
                          }
                        </button>
                      </div>

                      {/* Expand toggle */}
                      {product.images.length > 0 && (
                        <button
                          onClick={() => toggleExpand(product.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {/* Drag hint */}
                    {isDragTarget && (
                      <div className="px-4 pb-3 text-sm text-primary-600 font-medium">
                        Pudota kuvat tÃ¤hÃ¤n...
                      </div>
                    )}

                    {/* Expanded images */}
                    {isExpanded && product.images.length > 0 && (
                      <div className="border-t border-gray-100 p-4">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                          {product.images
                            .slice()
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map(image => (
                              <div
                                key={image.id}
                                className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                              >
                                <img
                                  src={image.url}
                                  alt={image.alt || product.name}
                                  className="w-full h-full object-cover"
                                />

                                {/* Primary badge */}
                                {image.isPrimary && (
                                  <div className="absolute top-1 left-1 bg-primary-600 text-white rounded p-0.5">
                                    <Star className="w-3 h-3 fill-white" />
                                  </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                  {!image.isPrimary && (
                                    <button
                                      onClick={() => handleSetPrimary(product.id, image.id)}
                                      title="Aseta pÃ¤Ã¤kuvaksi"
                                      className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded transition-colors"
                                    >
                                      <Star className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(product.id, image.id)}
                                    title="Poista"
                                    className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredProducts.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <ImageIcon className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Ei tuotteita hakusanalla "{search}"</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

