'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface StockData {
  id: string
  quantity: number
  minQuantity: number
  notes: string | null
  product: {
    id: string
    name: string
    sku: string | null
  }
  location: {
    id: string
    code: string
    name: string
    description: string | null
  } | null
}

export default function ScanPage({ params }: { params: { stockId: string } }) {
  const [stock, setStock] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [adjusting, setAdjusting] = useState(false)
  const [lastChange, setLastChange] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [adjustmentNote, setAdjustmentNote] = useState('')

  const fetchStock = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/inventory/${params.stockId}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Varastoriviiä ei löydy')
      }
      const data = await res.json()
      setStock(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Virhe haettaessa tietoja')
    } finally {
      setLoading(false)
    }
  }, [params.stockId])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  const adjust = async (change: number) => {
    if (!stock || adjusting) return
    setAdjusting(true)
    setError(null)
    setLastChange(null)

    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockId: stock.id,
          change,
          note: adjustmentNote.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Muutos epäonnistui')

      setStock((prev) => (prev ? { ...prev, quantity: data.quantityAfter ?? data.quantity } : prev))
      setLastChange(change)
      setAdjustmentNote('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Muutos epäonnistui')
    } finally {
      setAdjusting(false)
    }
  }

  const handleCustomAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(customAmount)
    if (isNaN(amount) || amount === 0) return
    await adjust(amount)
    setCustomAmount('')
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-gray-500">Ladataan...</div>
      </div>
    )
  }

  if (!stock) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-red-600">{error || 'Varastoriviiä ei löydy'}</div>
        <Link href="/admin/inventory" className="text-sm text-blue-600 underline">
          Takaisin varastoon
        </Link>
      </div>
    )
  }

  const isLow = stock.quantity > 0 && stock.quantity <= stock.minQuantity
  const isOut = stock.quantity === 0

  return (
    <div className="mx-auto max-w-sm space-y-5 py-2">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/inventory"
          className="rounded-xl border border-gray-300 p-2.5 hover:bg-gray-100 active:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold leading-tight text-gray-900">
            {stock.product.name}
          </h1>
          {stock.product.sku && (
            <p className="text-sm text-gray-500">{stock.product.sku}</p>
          )}
        </div>
        <button
          type="button"
          onClick={fetchStock}
          disabled={loading}
          className="rounded-xl border border-gray-300 p-2.5 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
          title="Päivitä"
        >
          <RotateCcw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Location badge */}
      {stock.location && (
        <div className="rounded-2xl bg-gray-100 px-4 py-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Varastopaikka
          </div>
          <div className="mt-1 text-3xl font-black text-gray-900">{stock.location.code}</div>
          <div className="text-sm text-gray-600">{stock.location.name}</div>
        </div>
      )}

      {/* Big quantity display */}
      <div
        className={`rounded-2xl p-8 text-center ${
          isOut ? 'bg-red-50' : isLow ? 'bg-amber-50' : 'bg-green-50'
        }`}
      >
        <div className="text-sm font-medium text-gray-500">Saldo</div>
        <div
          className={`mt-1 text-8xl font-black tabular-nums leading-none ${
            isOut ? 'text-red-700' : isLow ? 'text-amber-700' : 'text-green-700'
          }`}
        >
          {adjusting ? '…' : stock.quantity}
        </div>
        <div className="mt-2 text-sm text-gray-500">kpl &nbsp;·&nbsp; minimi {stock.minQuantity}</div>
        {(isOut || isLow) && (
          <div
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
              isOut ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isOut ? '⚠ Tuote loppu' : '⚠ Alhainen saldo'}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="adjustment-note" className="block text-sm font-medium text-gray-700">
          Muistiinpano muutoksesta
        </label>
        <textarea
          id="adjustment-note"
          value={adjustmentNote}
          onChange={(e) => setAdjustmentNote(e.target.value)}
          rows={3}
          placeholder="Esim. pakattiin messuille, saapui uusi erä tai poistettiin vialliset kappaleet"
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Large +/- buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => adjust(-1)}
          disabled={adjusting || stock.quantity === 0}
          className="h-24 rounded-2xl border-2 border-gray-300 bg-white text-4xl font-black text-gray-700 transition-colors active:bg-gray-100 disabled:opacity-30"
        >
          −1
        </button>
        <button
          type="button"
          onClick={() => adjust(1)}
          disabled={adjusting}
          className="h-24 rounded-2xl bg-primary-600 text-4xl font-black text-white transition-colors active:bg-primary-700 disabled:opacity-30"
        >
          +1
        </button>
      </div>

      {/* Feedback */}
      {lastChange !== null && !error && (
        <div
          className={`rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all ${
            lastChange > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {lastChange > 0 ? `+${lastChange} lisätty ✓` : `${lastChange} vähennetty ✓`}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Custom amount form */}
      <form onSubmit={handleCustomAdjust} className="flex gap-3">
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Muu muutos (esim. -5 tai +10)"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={adjusting || !customAmount}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors active:bg-black disabled:bg-gray-300"
        >
          OK
        </button>
      </form>

      {/* Notes */}
      {stock.notes && (
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <span className="font-semibold">Huomio: </span>
          {stock.notes}
        </div>
      )}
    </div>
  )
}
