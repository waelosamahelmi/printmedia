'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  X,
  Check,
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2,
} from 'lucide-react'

interface PageData {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  metaTitle: string | null
  metaDesc: string | null
  template: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  sections?: Section[]
}

interface Section {
  id: string
  type: string
  title?: string | null
  content?: string | null
  settings: string | null
  sortOrder: number
  isVisible: boolean
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'features', label: 'Features Grid' },
  { value: 'categories', label: 'Categories Grid' },
  { value: 'products', label: 'Products Showcase' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'contact', label: 'Contact Form' },
  { value: 'content', label: 'Rich Content' },
  { value: 'custom_html', label: 'Custom HTML' },
]

export default function SectionBasedEditor() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  const [pageData, setPageData] = useState<PageData | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    fetchPage()
  }, [pageId])

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`)
      if (res.ok) {
        const page: PageData = await res.json()
        setPageData(page)

        // If page has sections, use them
        if (page.sections && page.sections.length > 0) {
          setSections(page.sections)
        }
        // Otherwise, if page has old content field, convert it to a content section
        else if (page.content) {
          setSections([{
            id: `temp-${Date.now()}`,
            type: 'content',
            title: null,
            content: null,
            settings: JSON.stringify({ html: page.content, maxWidth: 'lg' }),
            sortOrder: 0,
            isVisible: true,
          }])
        } else {
          setSections([])
        }
      } else {
        setError('Sivua ei löytynyt')
      }
    } catch (err) {
      setError('Sivun lataus epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!pageData) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          sections: sections.map((section, index) => ({
            ...section,
            sortOrder: index,
          })),
        }),
      })

      if (res.ok) {
        setSuccess('Sivu tallennettu!')
        setTimeout(() => setSuccess(''), 3000)
        fetchPage() // Refresh to get server-generated IDs
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

  const addSection = (afterIndex?: number) => {
    const newSection: Section = {
      id: `temp-${Date.now()}`,
      type: 'content',
      title: null,
      content: null,
      settings: JSON.stringify({ html: '<p>Uusi sisältö</p>' }),
      sortOrder: sections.length,
      isVisible: true,
    }

    if (afterIndex !== undefined) {
      const newSections = [...sections]
      newSections.splice(afterIndex + 1, 0, newSection)
      setSections(newSections)
    } else {
      setSections([...sections, newSection])
    }

    setEditingSection(newSection.id)
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
    )
  }

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    setEditingSection(null)
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    ;[newSections[index - 1], newSections[index]] = [
      newSections[index],
      newSections[index - 1],
    ]
    setSections(newSections)
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    ;[newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ]
    setSections(newSections)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Sivua ei löytynyt</p>
          <Link href="/admin/pages" className="text-primary-600 hover:underline">
            Palaa sivulistaan
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900">{pageData.title}</h1>
            <p className="text-sm text-gray-500">/{pageData.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {success && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <Check className="w-4 h-4" />
              {success}
            </span>
          )}
          {error && <span className="text-red-600 text-sm">{error}</span>}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          <Link
            href={`/${pageData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Esikatsele
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Tallennetaan...' : 'Tallenna'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 flex">
        {/* Editor Area */}
        <div className={`flex-1 p-8 transition-all ${showSettings ? 'mr-80' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <input
                type="text"
                value={pageData.title}
                onChange={(e) =>
                  setPageData((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300"
                placeholder="Sivun otsikko"
              />
              <input
                type="text"
                value={pageData.description || ''}
                onChange={(e) =>
                  setPageData((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="w-full text-xl text-gray-600 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 mt-2"
                placeholder="Sivun kuvaus"
              />
            </div>

            {/* Add Section Button */}
            <div className="mb-4">
              <button
                onClick={() => addSection()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Lisää osio
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    editingSection === section.id
                      ? 'border-primary-500 shadow-lg'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Section Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <select
                        value={section.type}
                        onChange={(e) =>
                          updateSection(section.id, { type: e.target.value })
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      >
                        {sectionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={section.title || ''}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Osion otsikko (valinnainen)"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSectionUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Siirrä ylös"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSectionDown(index)}
                        disabled={index === sections.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Siirrä alas"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          updateSection(section.id, { isVisible: !section.isVisible })
                        }
                        className={`p-1.5 ${
                          section.isVisible
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={section.isVisible ? 'Näkyvissä' : 'Piilotettu'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="p-1.5 text-red-500 hover:text-red-600"
                        title="Poista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asetukset (JSON)
                    </label>
                    <textarea
                      value={section.settings || ''}
                      onChange={(e) =>
                        updateSection(section.id, { settings: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      rows={8}
                      placeholder='{"title": "Example", ...}'
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Muokkaa osion asetuksia JSON-muodossa. Katso dokumentaatiosta
                      esimerkkejä eri osiotyypeille.
                    </p>
                  </div>

                  {/* Add Section After Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => addSection(index)}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Lisää osio tähän väliin
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {sections.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">Sivulla ei ole vielä osioita</p>
                  <button
                    onClick={() => addSection()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Lisää ensimmäinen osio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 overflow-y-auto p-6">
            <h2 className="font-semibold text-gray-900 mb-6">Sivun asetukset</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL-osoite
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    value={pageData.slug}
                    onChange={(e) =>
                      setPageData((prev) => (prev ? { ...prev, slug: e.target.value } : null))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tila
                </label>
                <select
                  value={pageData.status}
                  onChange={(e) =>
                    setPageData((prev) =>
                      prev
                        ? { ...prev, status: e.target.value as PageData['status'] }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
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
                  value={pageData.template}
                  onChange={(e) =>
                    setPageData((prev) =>
                      prev ? { ...prev, template: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                >
                  <option value="default">Oletus</option>
                  <option value="full-width">Täysi leveys</option>
                  <option value="landing">Laskeutumissivu</option>
                </select>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h3 className="font-medium text-gray-900 mb-3">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta-otsikko
                    </label>
                    <input
                      type="text"
                      value={pageData.metaTitle || ''}
                      onChange={(e) =>
                        setPageData((prev) =>
                          prev ? { ...prev, metaTitle: e.target.value } : null
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                      placeholder="SEO-otsikko"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta-kuvaus
                    </label>
                    <textarea
                      value={pageData.metaDesc || ''}
                      onChange={(e) =>
                        setPageData((prev) =>
                          prev ? { ...prev, metaDesc: e.target.value } : null
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                      placeholder="SEO-kuvaus"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
