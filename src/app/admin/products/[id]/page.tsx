'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Trash2, Plus, X, Upload } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  slug: string
  sku: string | null
  name: string
  shortDesc: string | null
  description: string | null
  features: string | null
  specs: string | null
  price: number | null
  priceType: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured: boolean
  categoryId: string | null
  images: { id: string; url: string; alt: string | null; isPrimary: boolean }[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    shortDesc: '',
    description: '',
    features: [''],
    specs: {} as Record<string, string>,
    price: '',
    priceType: 'quote',
    status: 'DRAFT',
    isFeatured: false,
    categoryId: '',
  })
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  useEffect(() => {
    fetchData()
  }, [productId])

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/products/${productId}`),
        fetch('/api/admin/categories'),
      ])
      
      if (productRes.ok) {
        const product: Product = await productRes.json()
        let features = ['']
        let specs = {}
        
        try {
          if (product.features) features = JSON.parse(product.features)
          if (product.specs) specs = JSON.parse(product.specs)
        } catch {}
        
        setFormData({
          name: product.name,
          slug: product.slug,
          sku: product.sku || '',
          shortDesc: product.shortDesc || '',
          description: product.description || '',
          features: features.length > 0 ? features : [''],
          specs,
          price: product.price?.toString() || '',
          priceType: product.priceType || 'quote',
          status: product.status,
          isFeatured: product.isFeatured,
          categoryId: product.categoryId || '',
        })
      } else {
        setError('Tuotetta ei löytynyt')
      }
      
      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        setCategories(data)
      }
    } catch (err) {
      setError('Tuotteen lataus epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setFormData(prev => ({
        ...prev,
        specs: { ...prev.specs, [newSpecKey]: newSpecValue },
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpec = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specs }
      delete newSpecs[key]
      return { ...prev, specs: newSpecs }
    })
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim()),
          status: publish ? 'PUBLISHED' : formData.status,
        }),
      })

      if (res.ok) {
        setSuccess('Tuote tallennettu!')
        if (publish) {
          setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))
        }
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Tallennus epäonnistui')
      }
    } catch (err) {
      setError('Tallennus epäonnistui')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/products')
      } else {
        setError('Poisto epäonnistui')
      }
    } catch (err) {
      setError('Poisto epäonnistui')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Muokkaa tuotetta</h1>
            <p className="text-gray-600">{formData.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Poista tuote"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving || !formData.name || !formData.slug}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Tallennetaan...' : 'Tallenna'}
          </button>
          {formData.status !== 'PUBLISHED' && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving || !formData.name || !formData.slug}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              Julkaise
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Perustiedot</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuotteen nimi *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Tuotteen nimi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Tuotekoodi"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL-osoite (slug) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="tuotteen-osoite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lyhyt kuvaus
                </label>
                <textarea
                  value={formData.shortDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Lyhyt kuvaus tuotteesta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pitkä kuvaus
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Tuotteen yksityiskohtainen kuvaus..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ominaisuudet</h2>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Ominaisuus"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Lisää ominaisuus
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tekniset tiedot</h2>
            <div className="space-y-3">
              {Object.entries(formData.specs).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                  <button
                    type="button"
                    onClick={() => removeSpec(key)}
                    className="ml-auto p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Nimi (esim. Leveys)"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Arvo (esim. 1600mm)"
                />
                <button
                  type="button"
                  onClick={addSpec}
                  className="px-4 py-2 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Julkaisu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tila
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="DRAFT">Luonnos</option>
                  <option value="PUBLISHED">Julkaistu</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Nostettu tuote</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategoria</h2>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">Valitse kategoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hinnoittelu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hintatyyppi
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="quote">Kysy hinta</option>
                  <option value="fixed">Kiinteä hinta</option>
                  <option value="call">Soita meille</option>
                </select>
              </div>
              {formData.priceType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hinta (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Poista tuote</h3>
            <p className="text-gray-600 mb-6">
              Haluatko varmasti poistaa tuotteen "{formData.name}"? Tätä toimintoa ei voi peruuttaa.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Peruuta
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Poista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
