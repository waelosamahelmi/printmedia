'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, MapPin, Package, Plus, Printer, QrCode, RefreshCcw, Search, Trash2, X } from 'lucide-react'
import QRCode from 'react-qr-code'

interface InventoryLocation {
  id: string
  code: string
  name: string
  description: string | null
  isActive: boolean
}

interface InventoryProduct {
  id: string
  name: string
  sku: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  inventory?: { id: string } | null
}

interface InventoryStock {
  id: string
  quantity: number
  minQuantity: number
  notes: string | null
  updatedAt: string
  product: {
    id: string
    name: string
    sku: string | null
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    category: {
      id: string
      name: string
    } | null
  }
  location: InventoryLocation | null
}

interface InventoryTransaction {
  id: string
  type: 'ADJUSTMENT' | 'RECEIVE' | 'REMOVE'
  quantityChange: number
  quantityAfter: number
  note: string | null
  createdAt: string
  stock: {
    product: {
      name: string
      sku: string | null
    }
    location: {
      code: string
      name: string
    } | null
  }
  user: {
    name: string | null
    email: string | null
  } | null
}

const emptyStockForm = {
  productId: '',
  locationId: '',
  quantity: '0',
  minQuantity: '0',
  notes: '',
}

const emptyLocationForm = {
  code: '',
  name: '',
  description: '',
}

export default function InventoryAdminPage() {
  const [stocks, setStocks] = useState<InventoryStock[]>([])
  const [locations, setLocations] = useState<InventoryLocation[]>([])
  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [creatingLocation, setCreatingLocation] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all')
  const [stockForm, setStockForm] = useState(emptyStockForm)
  const [locationForm, setLocationForm] = useState(emptyLocationForm)
  const [adjustingId, setAdjustingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [qrStock, setQrStock] = useState<InventoryStock | null>(null)
  const [qrOrigin, setQrOrigin] = useState('')
  const qrRef = useRef<HTMLDivElement>(null)
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null)
  const [customAdjustments, setCustomAdjustments] = useState<Record<string, string>>({})

  useEffect(() => {
    setQrOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/inventory')
      if (!res.ok) {
        throw new Error('Varastotietojen haku epäonnistui')
      }

      const data = await res.json()
      setStocks(data.stocks || [])
      setLocations(data.locations || [])
      setProducts(data.products || [])
      setTransactions(data.recentTransactions || [])
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Varastotietojen haku epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const filteredStocks = useMemo(() => {
    const q = search.toLowerCase().trim()
    return stocks.filter((stock) => {
      const matchesSearch = !q ||
        stock.product.name.toLowerCase().includes(q) ||
        (stock.product.sku || '').toLowerCase().includes(q) ||
        (stock.location?.code || '').toLowerCase().includes(q) ||
        (stock.location?.name || '').toLowerCase().includes(q)

      const isLow = stock.quantity <= stock.minQuantity && stock.quantity > 0
      const isOut = stock.quantity === 0

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'low' && isLow) ||
        (statusFilter === 'out' && isOut)

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, stocks])

  const untrackedProducts = useMemo(
    () => products.filter((product) => !product.inventory),
    [products]
  )

  const inventoryStats = useMemo(() => {
    const tracked = stocks.length
    const low = stocks.filter((stock) => stock.quantity <= stock.minQuantity && stock.quantity > 0).length
    const out = stocks.filter((stock) => stock.quantity === 0).length
    const totalUnits = stocks.reduce((sum, stock) => sum + stock.quantity, 0)

    return { tracked, low, out, totalUnits }
  }, [stocks])

  const resetMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()
    setCreatingLocation(true)

    try {
      const res = await fetch('/api/admin/inventory/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationForm),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Varastopaikan luonti epäonnistui')
      }

      setLocations((prev) => [...prev, data].sort((a, b) => a.code.localeCompare(b.code, 'fi')))
      setLocationForm(emptyLocationForm)
      setSuccess('Varastopaikka lisätty')
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Varastopaikan luonti epäonnistui')
    } finally {
      setCreatingLocation(false)
    }
  }

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...stockForm,
          locationId: stockForm.locationId || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Varastotiedon tallennus epäonnistui')
      }

      setStockForm(emptyStockForm)
      setSuccess('Varastotiedot tallennettu')
      await fetchInventory()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Varastotiedon tallennus epäonnistui')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLocation = async (location: InventoryLocation) => {
    const confirmed = window.confirm(`Poistetaanko varastopaikka ${location.code} - ${location.name}?`)
    if (!confirmed) {
      return
    }

    resetMessages()
    setDeletingLocationId(location.id)

    try {
      const res = await fetch(`/api/admin/inventory/locations?id=${location.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Varastopaikan poisto epäonnistui')
      }

      setLocations((prev) => prev.filter((item) => item.id !== location.id))
      setSuccess('Varastopaikka poistettu')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Varastopaikan poisto epäonnistui')
    } finally {
      setDeletingLocationId(null)
    }
  }

  const printQrLabel = () => {
    if (!qrStock || !qrRef.current) return
    const svgEl = qrRef.current.querySelector('svg')
    if (!svgEl) return
    const svgContent = new XMLSerializer().serializeToString(svgEl)
    const productName = qrStock.product.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const locationCode = qrStock.location?.code ?? ''
    const locationName = qrStock.location?.name ?? ''
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>QR-tarra</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
.label { text-align: center; padding: 14px; border: 2px solid #000; display: inline-block; width: 200px; }
.label h2 { font-size: 12px; font-weight: 700; margin-top: 8px; word-break: break-word; line-height: 1.3; }
.label .code { font-size: 22px; font-weight: 900; margin-top: 6px; }
.label .loc { font-size: 10px; color: #555; margin-top: 2px; }
</style></head><body>
<div class="label">
${svgContent}
<h2>${productName}</h2>
${locationCode ? `<div class="code">${locationCode}</div>` : ''}
${locationName ? `<div class="loc">${locationName}</div>` : ''}
</div>
<script>window.onload = function() { window.print(); }<\/script>
</body></html>`
    const w = window.open('', '_blank', 'width=320,height=420')
    if (w) {
      w.document.write(html)
      w.document.close()
    }
  }

  const handleEditStock = (stock: InventoryStock) => {
    resetMessages()
    setStockForm({
      productId: stock.product.id,
      locationId: stock.location?.id || '',
      quantity: String(stock.quantity),
      minQuantity: String(stock.minQuantity),
      notes: stock.notes || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const adjustStock = async (stockId: string, change: number) => {
    resetMessages()
    setAdjustingId(stockId)

    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockId, change }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Varastosaldon muutos epäonnistui')
      }

      const confirmedQty = data.quantityAfter ?? data.quantity ?? null
      if (confirmedQty !== null) {
        setStocks((prev) =>
          prev.map((s) => s.id === stockId ? { ...s, quantity: confirmedQty } : s)
        )
      }
      setSuccess(change > 0 ? `Saldoa lisätty ${change} kpl` : `Saldoa vähennetty ${Math.abs(change)} kpl`)
      return true
    } catch (adjustError) {
      setError(adjustError instanceof Error ? adjustError.message : 'Varastosaldon muutos epäonnistui')
      return false
    } finally {
      setAdjustingId(null)
    }
  }

  const handleCustomAdjustment = async (stockId: string) => {
    resetMessages()
    const rawValue = customAdjustments[stockId]?.trim() || ''
    const change = Number(rawValue)

    if (!rawValue || !Number.isInteger(change) || change === 0) {
      setError('Anna kokonaisluku, esimerkiksi 10 tai -5.')
      return
    }

    const success = await adjustStock(stockId, change)
    if (success) {
      setCustomAdjustments((prev) => ({
        ...prev,
        [stockId]: '',
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Varasto</h1>
          <p className="text-gray-600">Hallinnoi tuotteiden saldoja, lokeropaikkoja ja varastotapahtumia.</p>
        </div>
        <button
          type="button"
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Päivitä
        </button>
      </div>

      {(error || success) && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
          {error || success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500">Seurannassa</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{inventoryStats.tracked}</div>
          <div className="mt-1 text-sm text-gray-600">tuotetta</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500">Yksiköt yhteensä</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{inventoryStats.totalUnits}</div>
          <div className="mt-1 text-sm text-gray-600">kpl varastossa</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="text-sm text-amber-700">Alhaiset saldot</div>
          <div className="mt-2 text-3xl font-bold text-amber-900">{inventoryStats.low}</div>
          <div className="mt-1 text-sm text-amber-700">tuotetta lähellä rajaa</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="text-sm text-red-700">Loppuneet</div>
          <div className="mt-2 text-3xl font-bold text-red-900">{inventoryStats.out}</div>
          <div className="mt-1 text-sm text-red-700">tuotetta nollassa</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSaveStock} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lisää tai päivitä varastotuote</h2>
            <p className="mt-1 text-sm text-gray-600">Valitse tuote, lokeropaikka ja tämänhetkinen saldo.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tuote</label>
              <select
                value={stockForm.productId}
                onChange={(e) => setStockForm((prev) => ({ ...prev, productId: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              >
                <option value="">Valitse tuote</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}{product.sku ? ` (${product.sku})` : ''}
                  </option>
                ))}
              </select>
              {untrackedProducts.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">{untrackedProducts.length} tuotetta ilman varastoriviä.</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Varastopaikka</label>
              <select
                value={stockForm.locationId}
                onChange={(e) => setStockForm((prev) => ({ ...prev, locationId: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Ei määritelty</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.code} - {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Saldo</label>
              <input
                type="number"
                min="0"
                value={stockForm.quantity}
                onChange={(e) => setStockForm((prev) => ({ ...prev, quantity: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Minimisaldo</label>
              <input
                type="number"
                min="0"
                value={stockForm.minQuantity}
                onChange={(e) => setStockForm((prev) => ({ ...prev, minQuantity: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Muistiinpanot</label>
            <textarea
              value={stockForm.notes}
              onChange={(e) => setStockForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Esim. sama tuote löytyy myös huoltotilasta"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:bg-gray-300"
            >
              <Package className="h-4 w-4" />
              {saving ? 'Tallennetaan...' : 'Tallenna varastotiedot'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStockForm(emptyStockForm)
                resetMessages()
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Tyhjennä
            </button>
          </div>
        </form>

        <form onSubmit={handleCreateLocation} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lisää varastopaikka</h2>
            <p className="mt-1 text-sm text-gray-600">Esim. lokero, hylly tai laatikko jota voit käyttää QR-tarroissa myöhemmin.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Koodi</label>
            <input
              type="text"
              value={locationForm.code}
              onChange={(e) => setLocationForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="A-01"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nimi</label>
            <input
              type="text"
              value={locationForm.name}
              onChange={(e) => setLocationForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Hylly A / lokero 1"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kuvaus</label>
            <textarea
              value={locationForm.description}
              onChange={(e) => setLocationForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Esim. huoltopöydän takana oleva laatikosto"
            />
          </div>

          <button
            type="submit"
            disabled={creatingLocation}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
            {creatingLocation ? 'Lisätään...' : 'Lisää varastopaikka'}
          </button>

          {locations.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-3 text-sm font-semibold text-gray-900">Nykyiset varastopaikat</div>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {location.code} - {location.name}
                      </div>
                      {location.description && (
                        <div className="mt-1 text-xs text-gray-500">{location.description}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(location)}
                      disabled={deletingLocationId === location.id}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingLocationId === location.id ? 'Poistetaan...' : 'Poista'}
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Käytössä olevaa varastopaikkaa ei voi poistaa ennen kuin tuotteet on siirretty muualle.
              </p>
            </div>
          )}
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hae tuotetta, SKU:ta tai lokerokoodia"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'low' | 'out')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">Kaikki</option>
            <option value="low">Alhaiset saldot</option>
            <option value="out">Loppuneet</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Tuote</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Varastopaikka</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Saldo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Tila</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Toiminnot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">Ladataan varastoa...</td>
                </tr>
              ) : filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">Ei varastorivejä nykyisellä haulla.</td>
                </tr>
              ) : (
                filteredStocks.map((stock) => {
                  const isOut = stock.quantity === 0
                  const isLow = stock.quantity <= stock.minQuantity && stock.quantity > 0

                  return (
                    <tr key={stock.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-gray-900">{stock.product.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {stock.product.sku || 'Ei SKU:ta'}
                          {stock.product.category ? ` · ${stock.product.category.name}` : ''}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {stock.location ? (
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                              <MapPin className="h-3.5 w-3.5" />
                              {stock.location.code}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">{stock.location.name}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Ei määritelty</span>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="text-lg font-bold text-gray-900">{stock.quantity}</div>
                        <div className="text-xs text-gray-500">Minimi {stock.minQuantity}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Loppu
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Alhainen
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => adjustStock(stock.id, -1)}
                              disabled={adjustingId === stock.id || stock.quantity === 0}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustStock(stock.id, 1)}
                              disabled={adjustingId === stock.id}
                              className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:bg-gray-300"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => setQrStock(stock)}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1"
                              title="Näytä QR-koodi"
                            >
                              <QrCode className="h-3.5 w-3.5" />
                              QR
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditStock(stock)}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Muokkaa
                            </button>
                          </div>

                          <div className="flex w-full max-w-[230px] items-center justify-end gap-2">
                            <input
                              type="number"
                              inputMode="numeric"
                              value={customAdjustments[stock.id] || ''}
                              onChange={(e) => setCustomAdjustments((prev) => ({
                                ...prev,
                                [stock.id]: e.target.value,
                              }))}
                              placeholder="Esim. 10 tai -5"
                              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => handleCustomAdjustment(stock.id)}
                              disabled={adjustingId === stock.id}
                              className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              Tee muutos
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Viimeisimmät varastotapahtumat</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Aika</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Tuote</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Muutos</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Saldo jälkeen</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Muistiinpano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Ei tapahtumia vielä.</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 text-gray-500">{new Date(transaction.createdAt).toLocaleString('fi-FI')}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{transaction.stock.product.name}</div>
                      <div className="text-xs text-gray-500">
                        {transaction.stock.product.sku || 'Ei SKU:ta'}
                        {transaction.stock.location ? ` · ${transaction.stock.location.code}` : ''}
                      </div>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${transaction.quantityChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.quantityChange >= 0 ? '+' : ''}{transaction.quantityChange}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{transaction.quantityAfter}</td>
                    <td className="px-4 py-3 text-gray-500">{transaction.note || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* QR code modal */}
      {qrStock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setQrStock(null) }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="min-w-0 pr-4">
                <h2 className="truncate font-bold text-gray-900">{qrStock.product.name}</h2>
                {qrStock.location && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    {qrStock.location.code} · {qrStock.location.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setQrStock(null)}
                className="shrink-0 rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 p-6">
              {qrOrigin && (
                <div ref={qrRef} className="rounded-xl bg-white p-3 shadow-inner ring-1 ring-gray-200">
                  <QRCode
                    value={`${qrOrigin}/admin/inventory/scan/${qrStock.id}`}
                    size={192}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              )}
              <p className="text-center text-xs text-gray-400 break-all">
                {qrOrigin}/admin/inventory/scan/{qrStock.id}
              </p>
            </div>

            <div className="flex justify-center gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={printQrLabel}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                <Printer className="h-4 w-4" />
                Tulosta tarra
              </button>
              <button
                type="button"
                onClick={() => setQrStock(null)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sulje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
