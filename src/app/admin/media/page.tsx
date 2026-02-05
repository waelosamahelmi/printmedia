'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Image as ImageIcon, File, Trash2, X, Search, FolderOpen, Copy, Check } from 'lucide-react'

interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  mimeType: string
  fileSize: number
  width: number | null
  height: number | null
  alt: string | null
  caption: string | null
  folder: string
  createdAt: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [folderFilter, setFolderFilter] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        fetchMedia()
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async () => {
    if (!selectedMedia) return

    try {
      const res = await fetch(`/api/admin/media/${selectedMedia.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMedia(media.filter(m => m.id !== selectedMedia.id))
        setDeleteModalOpen(false)
        setSelectedMedia(null)
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredMedia = media.filter(m => {
    const matchesSearch = m.originalName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = !folderFilter || m.folder === folderFilter
    return matchesSearch && matchesFolder
  })

  const folders = Array.from(new Set(media.map(m => m.folder)))

  const isImage = (mimeType: string) => mimeType.startsWith('image/')

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media</h1>
          <p className="text-gray-600">
            Hallitse mediatiedostoja ({media.length} kpl)
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            {uploading ? 'Ladataan...' : 'Lataa tiedostoja'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Hae tiedostoja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">Kaikki kansiot</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.length > 0 ? (
          filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className={`relative group bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                selectedMedia?.id === item.id
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {isImage(item.mimeType) ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <p className="text-xs text-gray-400">
                  {formatFileSize(item.fileSize)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            {searchQuery || folderFilter ? (
              'Ei tuloksia hakuehdoilla.'
            ) : (
              <div>
                <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>Ei mediatiedostoja.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-primary-600 hover:underline"
                >
                  Lataa ensimmäinen tiedosto
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Details Sidebar */}
      {selectedMedia && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tiedoston tiedot</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              {isImage(selectedMedia.mimeType) ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || selectedMedia.originalName}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <File className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tiedostonimi</label>
                <p className="text-gray-900">{selectedMedia.originalName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedMedia.url}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                  />
                  <button
                    onClick={() => copyUrl(selectedMedia.url)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="Kopioi URL"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tyyppi</label>
                  <p className="text-gray-900">{selectedMedia.mimeType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Koko</label>
                  <p className="text-gray-900">{formatFileSize(selectedMedia.fileSize)}</p>
                </div>
              </div>
              {selectedMedia.width && selectedMedia.height && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Mitat</label>
                  <p className="text-gray-900">{selectedMedia.width} × {selectedMedia.height} px</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Kansio</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <FolderOpen className="w-4 h-4" />
                  {selectedMedia.folder}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Ladattu</label>
                <p className="text-gray-900">
                  {new Date(selectedMedia.createdAt).toLocaleDateString('fi-FI', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Poista tiedosto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Poista tiedosto</h3>
            <p className="text-gray-600 mb-6">
              Haluatko varmasti poistaa tiedoston "{selectedMedia?.originalName}"? Tätä toimintoa ei voi peruuttaa.
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
