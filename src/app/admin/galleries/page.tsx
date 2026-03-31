'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Image as ImageIcon, Loader, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

interface ProductImage {
  id: string
  url: string
  alt?: string
  caption?: string
  isPrimary: boolean
  sortOrder: number
}

interface Product {
  id: string
  name: string
  slug: string
  images: ProductImage[]
}

export default function GalleriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-login')
    }
  }, [status, router])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      
      const data = await res.json()
      // Filter to show only products with images
      const withImages = data.filter((p: Product) => p.images?.length > 0)
      setProducts(withImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (productId: string, files: FileList) => {
    if (files.length === 0) return

    try {
      setUploading(productId)
      setError('')

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', '')

        const res = await fetch(`/api/admin/products/${productId}/images`, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Upload failed')
        }
      }

      // Refresh products
      await fetchProducts()
      setSuccess(`${files.length} kuva(t) ladattu onnistuksella!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteImage = async (productId: string, imageId: string) => {
    if (!confirm('Poista kuva?')) return

    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      setProducts(products.map(p =>
        p.id === productId
          ? { ...p, images: p.images.filter(img => img.id !== imageId) }
          : p
      ))
      setSuccess('Kuva poistettu')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleSetPrimary = async (productId: string, imageId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed')

      setProducts(products.map(p =>
        p.id === productId
          ? {
              ...p,
              images: p.images.map(img =>
                img.id === imageId
                  ? { ...img, isPrimary: true }
                  : { ...img, isPrimary: false }
              ),
            }
          : p
      ))
      setSuccess('Pääkuva asetettu')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    }
  }

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
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                {success}
              </div>
            )}

            {products.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Ei tuotteita kuvilla</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Product header */}
                    <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.images.length} kuva(a)</p>
                      </div>
                      <input
                        id={`file-input-${product.id}`}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageUpload(product.id, e.target.files)}
                        disabled={uploading === product.id}
                        className="hidden"
                      />
                      <Button
                        variant="primary"
                        disabled={uploading === product.id}
                        onClick={() => document.getElementById(`file-input-${product.id}`)?.click()}
                        className={uploading === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      >
                        {uploading === product.id ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Ladataan...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Lataa kuvia
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Images grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-6">
                      {product.images.sort((a, b) => a.sortOrder - b.sortOrder).map(image => (
                        <div
                          key={image.id}
                          className="relative group rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-primary-600 transition-all"
                        >
                          <img
                            src={image.url}
                            alt={image.alt || 'Product'}
                            className="w-full h-40 object-cover"
                          />

                          {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Pää
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!image.isPrimary && (
                              <button
                                onClick={() => handleSetPrimary(product.id, image.id)}
                                title="Aseta pääkuvaksi"
                                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors"
                              >
                                <ImageIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteImage(product.id, image.id)}
                              title="Poista kuva"
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
