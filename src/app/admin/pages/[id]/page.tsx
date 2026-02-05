'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'

interface Page {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  metaTitle: string | null
  metaDesc: string | null
  template: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  updatedAt: string
}

export default function EditPagePage() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    metaTitle: '',
    metaDesc: '',
    template: 'default',
    status: 'DRAFT',
  })

  useEffect(() => {
    fetchPage()
  }, [pageId])

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`)
      if (res.ok) {
        const page: Page = await res.json()
        setFormData({
          title: page.title,
          slug: page.slug,
          description: page.description || '',
          content: page.content || '',
          metaTitle: page.metaTitle || '',
          metaDesc: page.metaDesc || '',
          template: page.template,
          status: page.status,
        })
      } else {
        setError('Sivua ei löytynyt')
      }
    } catch (err) {
      setError('Sivun lataus epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: publish ? 'PUBLISHED' : formData.status,
        }),
      })

      if (res.ok) {
        setSuccess('Sivu tallennettu!')
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
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/pages')
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
            href="/admin/pages"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Muokkaa sivua</h1>
            <p className="text-gray-600">{formData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Poista sivu"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <Link
            href={`/${formData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Esikatsele
          </Link>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving || !formData.title || !formData.slug}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Tallennetaan...' : 'Tallenna'}
          </button>
          {formData.status !== 'PUBLISHED' && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving || !formData.title || !formData.slug}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Otsikko *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Sivun otsikko"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL-osoite (slug) *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                    printmedia.fi/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="sivun-osoite"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuvaus
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Lyhyt kuvaus sivusta"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sisältö</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sivun sisältö (HTML/Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
                placeholder="Kirjoita sivun sisältö..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Asetukset</h2>
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
                  <option value="ARCHIVED">Arkistoitu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sivupohja
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="default">Oletus</option>
                  <option value="full-width">Täysi leveys</option>
                  <option value="sidebar">Sivupalkilla</option>
                  <option value="landing">Laskeutumissivu</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta-otsikko
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="SEO-otsikko"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 merkkiä
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta-kuvaus
                </label>
                <textarea
                  value={formData.metaDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDesc: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="SEO-kuvaus hakukoneille"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDesc.length}/160 merkkiä
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Poista sivu</h3>
            <p className="text-gray-600 mb-6">
              Haluatko varmasti poistaa sivun "{formData.title}"? Tätä toimintoa ei voi peruuttaa.
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
