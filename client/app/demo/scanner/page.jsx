'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'check_in',  label: 'Check-In',  color: 'bg-green-500' },
  { key: 'check_out', label: 'Check-Out', color: 'bg-blue-500' },
  { key: 'expired',   label: 'Expired',   color: 'bg-amber-500' },
  { key: 'revoked',   label: 'Revoked',   color: 'bg-red-500' },
]

// Each tab has two sample passes to cycle through
const PASSES = {
  check_in: [
    { name: 'Arjun Mehta',    phone: '+91 98765 43210', department: 'Vendor',       valid_until: '2026-06-05', state: 'active' },
    { name: 'Priya Sharma',   phone: '+91 87654 32109', department: 'Office',       valid_until: '2026-06-03', state: 'already_inside' },
  ],
  check_out: [
    { name: 'Mohammed Rizvi', phone: '+91 76543 21098', department: 'Participants', valid_until: '2026-06-03', state: 'checked_in' },
    { name: 'Anita Desai',    phone: '+91 21098 76543', department: 'Participants', valid_until: '2026-06-02', state: 'checked_in' },
  ],
  expired: [
    { name: 'Rohit Verma',    phone: '+91 10987 65432', department: 'Office',       valid_until: '2026-05-30', state: 'expired' },
  ],
  revoked: [
    { name: 'Rajan Thomas',   phone: '+91 54321 09876', department: 'Cab Driver',   valid_until: '2026-06-02', state: 'revoked' },
  ],
}

export default function DemoScannerPage() {
  const router = useRouter()
  const [tab, setTab] = useState('check_in')
  const [scanning, setScanning] = useState(false)
  const [scanIdx, setScanIdx] = useState(0)
  const [result, setResult] = useState(null)   // { pass, state }
  const [confirmed, setConfirmed] = useState(false)

  function handleTabChange(key) {
    setTab(key)
    setResult(null)
    setConfirmed(false)
    setScanIdx(0)
  }

  function simulateScan() {
    setScanning(true)
    setResult(null)
    setConfirmed(false)
    setTimeout(() => {
      const pool = PASSES[tab]
      const pass = pool[scanIdx % pool.length]
      setScanIdx((i) => i + 1)
      setResult(pass)
      setScanning(false)
    }, 1000)
  }

  function handleConfirm() {
    setConfirmed(true)
  }

  const activeTab = TABS.find((t) => t.key === tab)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Gate Scanner</p>
            <h1 className="text-white text-xl font-bold">Hilabi Parking</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-900 text-blue-300 px-2.5 py-1 rounded-full font-semibold">Employee</span>
            <button onClick={() => router.push('/')} className="w-8 h-8 flex items-center justify-center text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* 4-option tab toggle */}
        <div className="flex bg-gray-900 rounded-2xl p-1 gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition
                ${tab === t.key ? `${t.color} text-white` : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 pb-6 flex flex-col gap-4">

        {/* Confirmed success flash */}
        {confirmed && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl shadow-lg
              ${tab === 'check_in' ? 'bg-green-500' : 'bg-blue-500'}`}>
              ✓
            </div>
            <p className="text-white text-2xl font-bold">
              {tab === 'check_in' ? 'Checked In!' : 'Checked Out!'}
            </p>
            <p className="text-gray-400 text-sm">Access granted</p>
            <button
              onClick={() => { setConfirmed(false); setResult(null) }}
              className="mt-4 w-full bg-white text-gray-900 font-bold py-4 rounded-2xl text-base active:scale-95 transition-all"
            >
              Scan Next →
            </button>
          </div>
        )}

        {/* No result yet — viewfinder */}
        {!result && !confirmed && (
          <>
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden flex-1 min-h-[280px] flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-white/20 rounded-tl-xl" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-white/20 rounded-tr-xl" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-white/20 rounded-bl-xl" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-white/20 rounded-br-xl" />

              {/* Mode badge */}
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${activeTab.color}/20 text-white/60`}>
                ● {activeTab.label.toUpperCase()} MODE
              </div>

              {scanning ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Reading pass...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center px-8">
                  <svg className="w-14 h-14 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0h14m0 0h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2M5 8h14" />
                  </svg>
                  <p className="text-gray-500 text-sm">Point camera at visitor's QR pass</p>
                </div>
              )}
            </div>

            <button
              onClick={simulateScan}
              disabled={scanning}
              className={`w-full py-5 rounded-2xl text-base font-bold active:scale-95 transition-all disabled:opacity-40 ${activeTab.color} text-white`}
            >
              {scanning ? 'Scanning...' : '⚡  Simulate Scan'}
            </button>
          </>
        )}

        {/* Result */}
        {result && !confirmed && (
          <ResultCard
            pass={result}
            tab={tab}
            onConfirm={handleConfirm}
            onReset={() => setResult(null)}
          />
        )}
      </div>
    </div>
  )
}

function ResultCard({ pass, tab, onConfirm, onReset }) {
  const { state } = pass

  // Determine what to show based on state
  const isAlreadyInside  = state === 'already_inside'
  const isExpired        = state === 'expired'
  const isRevoked        = state === 'revoked'
  const canCheckIn       = state === 'active'       && tab === 'check_in'
  const canCheckOut      = state === 'checked_in'   && tab === 'check_out'
  const isDenied         = isAlreadyInside || isExpired || isRevoked

  const cfg = {
    already_inside: {
      iconBg: 'bg-red-500',   icon: '✗', bg: 'bg-red-50',
      title: 'Already Inside',
      message: 'This pass is already checked in. The visitor must purchase a new pass to re-enter.',
      messageCls: 'text-red-700',
      bannerCls: 'bg-red-100 border-red-200 text-red-700',
    },
    expired: {
      iconBg: 'bg-amber-500', icon: '!', bg: 'bg-amber-50',
      title: 'Pass Expired',
      message: 'This pass has expired and is no longer valid for entry.',
      messageCls: 'text-amber-700',
      bannerCls: 'bg-amber-100 border-amber-200 text-amber-700',
    },
    revoked: {
      iconBg: 'bg-red-600',   icon: '✗', bg: 'bg-red-50',
      title: 'Pass Revoked',
      message: 'This pass has been revoked by the admin. Entry is not permitted.',
      messageCls: 'text-red-700',
      bannerCls: 'bg-red-100 border-red-200 text-red-700',
    },
    active: {
      iconBg: 'bg-green-500', icon: '✓', bg: 'bg-green-50',
      title: 'Pass Valid',
      message: 'Verify the visitor and tap Check In to grant entry.',
      messageCls: 'text-green-700',
      bannerCls: null,
    },
    checked_in: {
      iconBg: 'bg-blue-500',  icon: '↑', bg: 'bg-blue-50',
      title: 'Currently Inside',
      message: 'Tap Check Out to record their exit.',
      messageCls: 'text-blue-700',
      bannerCls: null,
    },
  }[state] || {}

  return (
    <div className={`${cfg.bg} rounded-3xl p-5 flex flex-col gap-4 flex-1`}>
      {/* Status icon + title */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className={`w-16 h-16 ${cfg.iconBg} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md`}>
          {cfg.icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{cfg.title}</h2>
        <p className={`text-sm ${cfg.messageCls}`}>{cfg.message}</p>
      </div>

      {/* Pass details */}
      <div className="bg-white rounded-2xl divide-y divide-gray-50">
        <DetailRow label="Name"       value={pass.name} />
        <DetailRow label="Phone"      value={pass.phone} />
        <DetailRow label="Department" value={pass.department} />
        <DetailRow label="Valid Until" value={pass.valid_until} />
      </div>

      {/* Already inside banner */}
      {isAlreadyInside && (
        <div className="bg-red-100 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-700 font-bold text-sm">Direct this person to purchase a new pass</p>
        </div>
      )}

      {/* Expired / revoked — no action */}
      {(isExpired || isRevoked) && (
        <div className={`border rounded-2xl p-4 text-center ${cfg.bannerCls}`}>
          <p className="font-bold text-sm">Entry denied — do not allow access</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-auto">
        {(canCheckIn || canCheckOut) ? (
          <>
            <button
              onClick={onReset}
              className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl text-base active:scale-95 transition-all"
            >
              Cancel
            </button>
            {canCheckIn && (
              <button
                onClick={onConfirm}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-all"
              >
                ✓  Check In
              </button>
            )}
            {canCheckOut && (
              <button
                onClick={onConfirm}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-all"
              >
                ↑  Check Out
              </button>
            )}
          </>
        ) : (
          <button
            onClick={onReset}
            className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-2xl text-sm active:scale-95 transition-all"
          >
            Scan Next →
          </button>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-gray-900 font-semibold text-sm">{value}</span>
    </div>
  )
}
