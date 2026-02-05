'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, GripVertical, ExternalLink, Eye, EyeOff } from 'lucide-react'

interface NavItem {
  id: string
  location: string
  label: string
  url: string
  target: string
  icon: string | null
  parentId: string | null
  sortOrder: number
  isVisible: boolean
}

export default function NavigationPage() {
  const [navigation, setNavigation] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<NavItem | null>(null)
  const [editingItem, setEditingItem] = useState<NavItem | null>(null)
  const [selectedLocation, setSelectedLocation] = useState('header')
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    target: '_self',
    icon: '',
    parentId: '',
    sortOrder: 0,
    isVisible: true,
    location: 'header',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNavigation()
  }, [])

  const fetchNavigation = async () => {
    try {
      const res = await fetch('/api/admin/navigation')
      if (res.ok) {
        const data = await res.json()
        setNavigation(data)
      }
    } catch (error) {
      console.error('Error fetching navigation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (item?: NavItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        label: item.label,
        url: item.url,
        target: item.target,
        icon: item.icon || '',
        parentId: item.parentId || '',
        sortOrder: item.sortOrder,
        isVisible: item.isVisible,
        location: item.location,
      })
    } else {
      setEditingItem(null)
      setFormData({
        label: '',
        url: '',
        target: '_self',
        icon: '',
        parentId: '',
        sortOrder: navigation.filter(n => n.location === selectedLocation).length,
        isVisible: true,
        location: selectedLocation,
      })
    }
    setModalOpen(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingItem 
        ? `/api/admin/navigation/${editingItem.id}`
        : '/api/admin/navigation'
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setModalOpen(false)
        fetchNavigation()
      } else {
        const data = await res.json()
        setError(data.error || 'Tallennus epäonnistui')
      }
    } catch (err) {
      setError('Tallennus epäonnistui')
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const res = await fetch(`/api/admin/navigation/${itemToDelete.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setNavigation(navigation.filter(n => n.id !== itemToDelete.id))
        setDeleteModalOpen(false)
        setItemToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting navigation item:', error)
    }
  }

  const toggleVisibility = async (item: NavItem) => {
    try {
      const res = await fetch(`/api/admin/navigation/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isVisible: !item.isVisible }),
      })
      if (res.ok) {
        setNavigation(navigation.map(n => 
          n.id === item.id ? { ...n, isVisible: !n.isVisible } : n
        ))
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const filteredNavigation = navigation.filter(n => n.location === selectedLocation)

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
          <h1 className="text-2xl font-bold text-gray-900">Navigaatio</h1>
          <p className="text-gray-600">
            Hallitse sivuston navigaatioita
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Lisää linkki
        </button>
      </div>

      {/* Location Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['header', 'footer', 'mobile'].map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedLocation === location
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {location === 'header' && 'Ylävalikko'}
                {location === 'footer' && 'Alatunniste'}
                {location === 'mobile' && 'Mobiilivalikko'}
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {navigation.filter(n => n.location === location).length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Navigation Items */}
        <div className="p-6">
          {filteredNavigation.length > 0 ? (
            <div className="space-y-2">
              {filteredNavigation
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      item.isVisible 
                        ? 'bg-white border-gray-200' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="text-gray-400 cursor-grab">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.isVisible ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.label}
                        </span>
                        {item.target === '_blank' && (
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{item.url}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVisibility(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isVisible
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={item.isVisible ? 'Piilota' : 'Näytä'}
                      >
                        {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Muokkaa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item)
                          setDeleteModalOpen(true)
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Poista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Ei navigaatiolinkkejä.</p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-2 text-primary-600 hover:underline"
              >
                Lisää ensimmäinen linkki
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Muokkaa linkkiä' : 'Uusi linkki'}
            </h3>
            
            {error && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sijainti
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="header">Ylävalikko</option>
                  <option value="footer">Alatunniste</option>
                  <option value="mobile">Mobiilivalikko</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Linkin teksti *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Linkin teksti"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="/sivu tai https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avaa
                  </label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value="_self">Samassa ikkunassa</option>
                    <option value="_blank">Uudessa välilehdessä</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Järjestys
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Näkyvissä</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingItem ? 'Tallenna' : 'Lisää'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Poista linkki</h3>
            <p className="text-gray-600 mb-6">
              Haluatko varmasti poistaa linkin "{itemToDelete?.label}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setItemToDelete(null)
                }}
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
