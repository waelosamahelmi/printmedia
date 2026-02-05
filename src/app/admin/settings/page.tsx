'use client'

import { useState, useEffect } from 'react'
import { Save, Settings, Globe, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

interface Setting {
  id: string
  key: string
  value: string
  type: string
  label: string
  group: string
  description: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeGroup, setActiveGroup] = useState('general')
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  // Default settings structure
  const defaultSettings = [
    { key: 'site_name', label: 'Sivuston nimi', type: 'text', group: 'general', value: '' },
    { key: 'site_description', label: 'Sivuston kuvaus', type: 'textarea', group: 'general', value: '' },
    { key: 'site_logo', label: 'Logo URL', type: 'text', group: 'general', value: '' },
    { key: 'contact_email', label: 'Yhteyssähköposti', type: 'email', group: 'contact', value: '' },
    { key: 'contact_phone', label: 'Puhelinnumero', type: 'text', group: 'contact', value: '' },
    { key: 'contact_address', label: 'Osoite', type: 'textarea', group: 'contact', value: '' },
    { key: 'business_id', label: 'Y-tunnus', type: 'text', group: 'contact', value: '' },
    { key: 'facebook_url', label: 'Facebook', type: 'url', group: 'social', value: '' },
    { key: 'instagram_url', label: 'Instagram', type: 'url', group: 'social', value: '' },
    { key: 'linkedin_url', label: 'LinkedIn', type: 'url', group: 'social', value: '' },
    { key: 'twitter_url', label: 'Twitter/X', type: 'url', group: 'social', value: '' },
    { key: 'meta_title', label: 'Meta otsikko', type: 'text', group: 'seo', value: '' },
    { key: 'meta_description', label: 'Meta kuvaus', type: 'textarea', group: 'seo', value: '' },
    { key: 'meta_keywords', label: 'Meta avainsanat', type: 'text', group: 'seo', value: '' },
    { key: 'google_analytics', label: 'Google Analytics ID', type: 'text', group: 'seo', value: '' },
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        
        // Merge with defaults
        const values: Record<string, string> = {}
        defaultSettings.forEach(setting => {
          const existing = data.find((s: Setting) => s.key === setting.key)
          values[setting.key] = existing?.value || ''
        })
        setFormValues(values)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Save each setting
      const promises = Object.entries(formValues).map(async ([key, value]) => {
        const settingDef = defaultSettings.find(s => s.key === key)
        if (!settingDef) return

        return fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            value,
            type: settingDef.type,
            label: settingDef.label,
            group: settingDef.group,
          }),
        })
      })

      await Promise.all(promises)
      setMessage({ type: 'success', text: 'Asetukset tallennettu onnistuneesti!' })
      fetchSettings()
    } catch (error) {
      setMessage({ type: 'error', text: 'Asetusten tallennus epäonnistui' })
    } finally {
      setSaving(false)
    }
  }

  const groups = [
    { id: 'general', label: 'Yleiset', icon: Settings },
    { id: 'contact', label: 'Yhteystiedot', icon: Mail },
    { id: 'social', label: 'Sosiaalinen media', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Globe },
  ]

  const currentGroupSettings = defaultSettings.filter(s => s.group === activeGroup)

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
          <h1 className="text-2xl font-bold text-gray-900">Asetukset</h1>
          <p className="text-gray-600">
            Hallitse sivuston asetuksia ja tietoja
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Tallennetaan...' : 'Tallenna asetukset'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {groups.map((group) => {
              const Icon = group.icon
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeGroup === group.id
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {group.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Form */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {groups.find(g => g.id === activeGroup)?.label}
            </h2>

            <div className="space-y-6">
              {currentGroupSettings.map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.label}
                  </label>
                  {setting.type === 'textarea' ? (
                    <textarea
                      value={formValues[setting.key] || ''}
                      onChange={(e) => setFormValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  ) : (
                    <input
                      type={setting.type}
                      value={formValues[setting.key] || ''}
                      onChange={(e) => setFormValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
