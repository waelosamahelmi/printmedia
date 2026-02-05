'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Settings,
  Type,
  ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  X,
  Upload,
  Check
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
}

interface Section {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'link'
  content: string
  level?: number // for headings
  src?: string // for images
  alt?: string // for images
  href?: string // for links
  items?: string[] // for lists
}

export default function VisualPageEditor() {
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
  
  // Parse HTML content into sections
  const parseContentToSections = (html: string): Section[] => {
    if (!html) return []
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const elements = doc.body.children
    const parsedSections: Section[] = []
    
    Array.from(elements).forEach((el, index) => {
      const tagName = el.tagName.toLowerCase()
      
      if (tagName.match(/^h[1-6]$/)) {
        parsedSections.push({
          id: `section-${index}`,
          type: 'heading',
          content: el.textContent || '',
          level: parseInt(tagName[1])
        })
      } else if (tagName === 'p') {
        parsedSections.push({
          id: `section-${index}`,
          type: 'paragraph',
          content: el.innerHTML || ''
        })
      } else if (tagName === 'img') {
        parsedSections.push({
          id: `section-${index}`,
          type: 'image',
          content: '',
          src: (el as HTMLImageElement).src,
          alt: (el as HTMLImageElement).alt
        })
      } else if (tagName === 'ul' || tagName === 'ol') {
        const items = Array.from(el.querySelectorAll('li')).map(li => li.textContent || '')
        parsedSections.push({
          id: `section-${index}`,
          type: 'list',
          content: '',
          items
        })
      } else if (tagName === 'a') {
        parsedSections.push({
          id: `section-${index}`,
          type: 'link',
          content: el.textContent || '',
          href: (el as HTMLAnchorElement).href
        })
      } else {
        // Generic content
        parsedSections.push({
          id: `section-${index}`,
          type: 'paragraph',
          content: el.innerHTML || el.textContent || ''
        })
      }
    })
    
    return parsedSections.length > 0 ? parsedSections : [{
      id: 'section-0',
      type: 'paragraph',
      content: html
    }]
  }
  
  // Convert sections back to HTML
  const sectionsToHtml = (sections: Section[]): string => {
    return sections.map(section => {
      switch (section.type) {
        case 'heading':
          return `<h${section.level || 2}>${section.content}</h${section.level || 2}>`
        case 'paragraph':
          return `<p>${section.content}</p>`
        case 'image':
          return `<img src="${section.src}" alt="${section.alt || ''}" />`
        case 'list':
          const items = section.items?.map(item => `<li>${item}</li>`).join('') || ''
          return `<ul>${items}</ul>`
        case 'link':
          return `<a href="${section.href}">${section.content}</a>`
        default:
          return `<p>${section.content}</p>`
      }
    }).join('\n')
  }

  useEffect(() => {
    fetchPage()
  }, [pageId])

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`)
      if (res.ok) {
        const page: PageData = await res.json()
        setPageData(page)
        setSections(parseContentToSections(page.content || ''))
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
      const content = sectionsToHtml(sections)
      
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          content
        }),
      })

      if (res.ok) {
        setSuccess('Sivu tallennettu!')
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

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ))
  }

  const addSection = (type: Section['type'], afterId?: string) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      content: type === 'heading' ? 'Uusi otsikko' : 'Uusi kappale',
      level: type === 'heading' ? 2 : undefined,
      items: type === 'list' ? ['Kohta 1', 'Kohta 2'] : undefined
    }
    
    if (afterId) {
      const index = sections.findIndex(s => s.id === afterId)
      setSections(prev => [
        ...prev.slice(0, index + 1),
        newSection,
        ...prev.slice(index + 1)
      ])
    } else {
      setSections(prev => [...prev, newSection])
    }
    
    setEditingSection(newSection.id)
  }

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId))
    setEditingSection(null)
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
          {error && (
            <span className="text-red-600 text-sm">{error}</span>
          )}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
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
                onChange={(e) => setPageData(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300"
                placeholder="Sivun otsikko"
              />
              <input
                type="text"
                value={pageData.description || ''}
                onChange={(e) => setPageData(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full text-xl text-gray-600 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 mt-2"
                placeholder="Sivun kuvaus"
              />
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`group relative bg-white rounded-lg border-2 transition-all ${
                    editingSection === section.id 
                      ? 'border-primary-500 shadow-lg' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  {/* Section Controls */}
                  <div className={`absolute -left-12 top-2 flex flex-col gap-1 transition-opacity ${
                    editingSection === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      title="Poista"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section Content */}
                  <div 
                    className="p-4 cursor-text"
                    onClick={() => setEditingSection(section.id)}
                  >
                    {section.type === 'heading' && (
                      <input
                        type="text"
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        className={`w-full bg-transparent border-none outline-none focus:ring-0 font-bold ${
                          section.level === 1 ? 'text-4xl' :
                          section.level === 2 ? 'text-3xl' :
                          section.level === 3 ? 'text-2xl' :
                          'text-xl'
                        }`}
                        placeholder="Otsikko"
                      />
                    )}
                    
                    {section.type === 'paragraph' && (
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        className="w-full bg-transparent border-none outline-none focus:ring-0 resize-none text-gray-700"
                        placeholder="Kirjoita tekstiä..."
                        rows={Math.max(3, section.content.split('\n').length)}
                      />
                    )}
                    
                    {section.type === 'image' && (
                      <div className="text-center">
                        {section.src ? (
                          <div className="relative inline-block">
                            <img 
                              src={section.src} 
                              alt={section.alt || ''} 
                              className="max-w-full h-auto rounded-lg"
                            />
                            <input
                              type="text"
                              value={section.alt || ''}
                              onChange={(e) => updateSection(section.id, { alt: e.target.value })}
                              className="mt-2 w-full text-center text-sm text-gray-500 bg-transparent border-none outline-none"
                              placeholder="Kuvan kuvaus (alt)"
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Lisää kuvan URL</p>
                            <input
                              type="text"
                              value={section.src || ''}
                              onChange={(e) => updateSection(section.id, { src: e.target.value })}
                              className="mt-2 w-full text-center bg-gray-50 border border-gray-300 rounded px-3 py-2"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {section.type === 'list' && (
                      <ul className="space-y-2">
                        {section.items?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(section.items || [])]
                                newItems[i] = e.target.value
                                updateSection(section.id, { items: newItems })
                              }}
                              className="flex-1 bg-transparent border-none outline-none focus:ring-0"
                              placeholder="Lista-kohta"
                            />
                          </li>
                        ))}
                        <button
                          onClick={() => updateSection(section.id, { 
                            items: [...(section.items || []), ''] 
                          })}
                          className="text-primary-600 text-sm hover:underline"
                        >
                          + Lisää kohta
                        </button>
                      </ul>
                    )}

                    {section.type === 'link' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={section.content}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          className="w-full bg-transparent border-none outline-none focus:ring-0 text-primary-600"
                          placeholder="Linkin teksti"
                        />
                        <input
                          type="text"
                          value={section.href || ''}
                          onChange={(e) => updateSection(section.id, { href: e.target.value })}
                          className="w-full text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Add Section Button */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-sm px-2 py-1">
                      <button
                        onClick={() => addSection('paragraph', section.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Lisää teksti"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addSection('heading', section.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Lisää otsikko"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addSection('image', section.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Lisää kuva"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addSection('list', section.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Lisää lista"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addSection('link', section.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Lisää linkki"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add First Section if empty */}
              {sections.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Sivulla ei ole vielä sisältöä</p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => addSection('paragraph')}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Type className="w-4 h-4" />
                      Lisää teksti
                    </button>
                    <button
                      onClick={() => addSection('heading')}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Bold className="w-4 h-4" />
                      Lisää otsikko
                    </button>
                  </div>
                </div>
              )}

              {/* Add Section at end */}
              {sections.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4 opacity-50 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => addSection('paragraph')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Lisää teksti"
                  >
                    <Type className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => addSection('heading')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Lisää otsikko"
                  >
                    <Bold className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => addSection('image')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Lisää kuva"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => addSection('list')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Lisää lista"
                  >
                    <List className="w-5 h-5" />
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
                    onChange={(e) => setPageData(prev => prev ? { ...prev, slug: e.target.value } : null)}
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
                  onChange={(e) => setPageData(prev => prev ? { ...prev, status: e.target.value as PageData['status'] } : null)}
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
                  onChange={(e) => setPageData(prev => prev ? { ...prev, template: e.target.value } : null)}
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
                      onChange={(e) => setPageData(prev => prev ? { ...prev, metaTitle: e.target.value } : null)}
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
                      onChange={(e) => setPageData(prev => prev ? { ...prev, metaDesc: e.target.value } : null)}
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
