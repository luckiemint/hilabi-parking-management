'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

const DEPARTMENTS = [
  { value: 'office',        label: 'Office',        emoji: '🏢', color: 'border-violet-300 bg-violet-50 text-violet-700', active: 'border-violet-600 bg-violet-600 text-white' },
  { value: 'vendor',        label: 'Vendor',        emoji: '🛒', color: 'border-blue-300 bg-blue-50 text-blue-700',       active: 'border-blue-600 bg-blue-600 text-white' },
  { value: 'participants',  label: 'Participants',  emoji: '👥', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', active: 'border-emerald-600 bg-emerald-600 text-white' },
  { value: 'cab_driver',    label: 'Cab Driver',    emoji: '🚕', color: 'border-amber-300 bg-amber-50 text-amber-700',    active: 'border-amber-500 bg-amber-500 text-white' },
  { value: 'tourist_guide', label: 'Tourist Guide', emoji: '🗺️', color: 'border-rose-300 bg-rose-50 text-rose-700',       active: 'border-rose-600 bg-rose-600 text-white' },
  { value: 'vip',           label: 'VIP',           emoji: '⭐', color: 'border-yellow-300 bg-yellow-50 text-yellow-700', active: 'border-yellow-500 bg-yellow-500 text-white' },
]

const QUICK_DURATION = [
  { label: '1 Day',   days: 0 },
  { label: '3 Days',  days: 2 },
  { label: '1 Week',  days: 6 },
  { label: '10 Days', days: 9 },
]

function addDays(n) {
  const d = new Date('2026-06-02')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function makeId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const DEPT_BADGE = {
  office:        'bg-violet-100 text-violet-700',
  vendor:        'bg-blue-100 text-blue-700',
  participants:  'bg-emerald-100 text-emerald-700',
  cab_driver:    'bg-amber-100 text-amber-700',
  tourist_guide: 'bg-rose-100 text-rose-700',
}

export default function DemoGeneratePage() {
  const router = useRouter()
  const [department, setDepartment] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [quickIdx, setQuickIdx] = useState(0)
  const [validFrom, setValidFrom] = useState('2026-06-02')
  const [validUntil, setValidUntil] = useState('2026-06-02')
  const [generated, setGenerated] = useState(null)
  const [generating, setGenerating] = useState(false)

  function applyQuick(days, i) {
    setQuickIdx(i)
    setValidUntil(addDays(days))
  }

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerated({ passes: Array.from({ length: quantity }, (_, i) => ({ id: makeId(), serial: i + 1 })), validFrom })
      setGenerating(false)
    }, 900)
  }

  const dept = DEPARTMENTS.find((d) => d.value === department)

  if (generated) {
    return <GeneratedView passes={generated.passes} department={department} dept={dept} validFrom={generated.validFrom} validUntil={validUntil} onReset={() => setGenerated(null)} onBack={() => router.push('/demo/admin')} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/demo/admin')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Generate Passes</h1>
            <p className="text-gray-400 text-xs">Create QR passes by department</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-8 space-y-5">

        {/* Department */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">Select Department</p>
          <DeptDropdown value={department} onChange={setDepartment} />
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">Number of Passes</p>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 text-2xl font-bold flex items-center justify-center active:bg-gray-200"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                if (!isNaN(v) && v >= 1) setQuantity(Math.min(500, v))
              }}
              className="flex-1 text-center text-3xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl py-2.5 focus:outline-none focus:border-gray-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQuantity((q) => Math.min(500, q + 1))}
              className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 text-2xl font-bold flex items-center justify-center active:bg-gray-200"
            >
              +
            </button>
          </div>
          <div className="flex gap-2">
            {[5, 10, 20, 50].map((n) => (
              <button
                key={n}
                onClick={() => setQuantity(n)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition
                  ${quantity === n ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">Pass Duration</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {QUICK_DURATION.map((q, i) => (
              <button
                key={q.label}
                onClick={() => applyQuick(q.days, i)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition
                  ${quickIdx === i ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600'}`}
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1 px-1">Valid From</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => { setQuickIdx(null); setValidFrom(e.target.value) }}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 px-1">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                min={validFrom}
                onChange={(e) => { setQuickIdx(null); setValidUntil(e.target.value) }}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Generate button */}
        {department ? (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform disabled:opacity-50"
          >
            {generating ? 'Generating...' : `Generate ${quantity} ${dept?.label} Pass${quantity > 1 ? 'es' : ''}`}
          </button>
        ) : (
          <p className="text-center text-gray-400 text-sm py-2">Select a department to continue</p>
        )}
      </div>
    </div>
  )
}

function DeptDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = DEPARTMENTS.find((d) => d.value === value)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:border-gray-400 transition"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? `${selected.emoji}  ${selected.label}` : 'Choose a department'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          {DEPARTMENTS.map((d, i) => (
            <button
              key={d.value}
              type="button"
              onClick={() => { onChange(d.value); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left transition hover:bg-gray-50
                ${value === d.value ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}
                ${i !== DEPARTMENTS.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <span className="text-lg">{d.emoji}</span>
              <span>{d.label}</span>
              {value === d.value && (
                <svg className="w-4 h-4 text-gray-900 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GeneratedView({ passes, department, dept, validFrom, validUntil, onReset, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const QRCode = (await import('qrcode')).default
      const qrDataUrls = await Promise.all(
        passes.map((p) => QRCode.toDataURL(`PASS:${p.id}`, { width: 180, margin: 2 }))
      )

      const cards = passes.map((p, i) => `
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-align:center;page-break-inside:avoid">
          <p style="font-size:11px;color:#9ca3af;margin:0 0 8px">#${String(p.serial).padStart(2, '0')} · ${dept?.label}</p>
          <img src="${qrDataUrls[i]}" style="width:150px;height:150px" />
          <p style="font-size:11px;color:#6b7280;margin:8px 0 0">${validFrom} → ${validUntil}</p>
        </div>
      `).join('')

      const html = `<!DOCTYPE html><html><head><title>Hilabi ${dept?.label} Passes</title>
        <style>body{font-family:sans-serif;padding:24px}h2{margin:0 0 16px;font-size:18px}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media print{.no-print{display:none}}</style></head>
        <body>
          <h2>${dept?.label} Passes — ${passes.length} codes · ${validFrom} → ${validUntil}</h2>
          <div class="grid">${cards}</div>
          <br><button class="no-print" onclick="window.print()" style="padding:10px 24px;background:#111;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">🖨️ Print / Save as PDF</button>
        </body></html>`

      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{passes.length} Passes Ready</h1>
            <p className="text-gray-400 text-xs">{dept?.label} · {validFrom} → {validUntil}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-28 space-y-3">
        {/* Success */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0 text-white text-lg">✓</div>
          <div>
            <p className="text-sm font-bold text-green-800">{passes.length} unique QR codes generated</p>
            <p className="text-xs text-green-600 mt-0.5">Tap any pass to view its QR code</p>
          </div>
        </div>

        {/* Pass list */}
        {passes.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500">
                  #{String(p.serial).padStart(2, '0')}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{dept?.label} Pass</p>
                  <p className="text-xs text-gray-400 font-mono">{p.id.slice(0, 12)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DEPT_BADGE[department]}`}>{dept?.label}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded === p.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expanded === p.id && (
              <div className="border-t border-gray-50 px-4 py-4 flex flex-col items-center gap-3">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <QRCodeSVG value={`PASS:${p.id}`} size={180} />
                </div>
                <p className="text-xs text-gray-400 font-mono text-center break-all">{p.id}</p>
                <p className="text-xs text-gray-400">{validFrom} → {validUntil}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl text-sm active:scale-95 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? 'Preparing...' : 'Download All'}
        </button>
      </div>
    </div>
  )
}
