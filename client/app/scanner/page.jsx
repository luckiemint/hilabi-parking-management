'use client'
import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'

const QRScanner = dynamic(() => import('../../components/QRScanner'), { ssr: false })

const STATUS_CONFIG = {
  checked_in: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '✓',
    iconBg: 'bg-green-500',
    title: 'Checked In',
    titleColor: 'text-green-700',
  },
  checked_out: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: '↑',
    iconBg: 'bg-blue-500',
    title: 'Checked Out',
    titleColor: 'text-blue-700',
  },
  already_checked_in: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '✗',
    iconBg: 'bg-red-500',
    title: 'Already Checked In',
    titleColor: 'text-red-700',
  },
  not_checked_in: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: '!',
    iconBg: 'bg-yellow-500',
    title: 'Not Checked In',
    titleColor: 'text-yellow-700',
  },
  expired: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: '✗',
    iconBg: 'bg-gray-500',
    title: 'Pass Expired',
    titleColor: 'text-gray-700',
  },
  revoked: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '✗',
    iconBg: 'bg-red-500',
    title: 'Pass Revoked',
    titleColor: 'text-red-700',
  },
  invalid: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '✗',
    iconBg: 'bg-red-500',
    title: 'Invalid Pass',
    titleColor: 'text-red-700',
  },
}

const DEPT_LABELS = {
  office: 'Office',
  vendor: 'Vendor',
  participants: 'Participants',
  cab_driver: 'Cab Driver',
  tourist_guide: 'Tourist Guide',
}

export default function ScannerPage() {
  const router = useRouter()
  const [mode, setMode] = useState('check_in')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [manualId, setManualId] = useState('')
  const [scanKey, setScanKey] = useState(0)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || !['admin', 'scanner'].includes(role)) router.replace('/login')
    setUsername(localStorage.getItem('username') || 'Scanner')
  }, [router])

  const processScan = useCallback(async (passId) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await api.post('/scans', { passId, action: mode })
      setResult(res.data)
    } catch {
      setResult({ status: 'invalid', message: 'Failed to process scan' })
    } finally {
      setLoading(false)
    }
  }, [loading, mode])

  function handleManualSubmit(e) {
    e.preventDefault()
    if (manualId.trim()) {
      processScan(manualId.trim())
      setManualId('')
    }
  }

  function resetScanner() {
    setResult(null)
    setScanKey((k) => k + 1)
  }

  function logout() {
    localStorage.clear()
    router.replace('/login')
  }

  const cfg = result ? STATUS_CONFIG[result.status] || STATUS_CONFIG.invalid : null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div>
          <h1 className="font-bold text-lg">Hilabi Scanner</h1>
          <p className="text-gray-400 text-xs">{username}</p>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Logout</button>
      </div>

      {/* Mode toggle */}
      <div className="px-4 py-3">
        <div className="flex rounded-xl overflow-hidden border border-gray-700 w-full">
          <button
            onClick={() => { setMode('check_in'); resetScanner() }}
            className={`flex-1 py-2.5 text-sm font-medium transition ${mode === 'check_in' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            Entry (Check In)
          </button>
          <button
            onClick={() => { setMode('check_out'); resetScanner() }}
            className={`flex-1 py-2.5 text-sm font-medium transition ${mode === 'check_out' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            Exit (Check Out)
          </button>
        </div>
      </div>

      {/* Scanner or Result */}
      <div className="px-4">
        {!result ? (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-gray-800">
              <QRScanner key={scanKey} onScan={processScan} />
            </div>

            {loading && (
              <div className="text-center text-gray-400 text-sm">Processing...</div>
            )}

            {/* Manual entry fallback */}
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Enter pass ID manually"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Go
              </button>
            </form>
          </div>
        ) : (
          <div className={`rounded-2xl border ${cfg.bg} ${cfg.border} p-6 text-gray-900`}>
            <div className="text-center mb-4">
              <div className={`w-14 h-14 ${cfg.iconBg} rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold`}>
                {cfg.icon}
              </div>
              <h2 className={`text-xl font-bold mt-2 ${cfg.titleColor}`}>{cfg.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{result.message}</p>
            </div>

            {result.pass && (
              <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
                <Row label="Name" value={result.pass.name} />
                <Row label="Phone" value={result.pass.phone} />
                <Row label="Department" value={DEPT_LABELS[result.pass.department] || result.pass.department} />
                <Row label="Valid Until" value={result.pass.valid_until} />
              </div>
            )}

            {result.status === 'already_checked_in' && (
              <p className="text-center text-red-600 text-sm font-medium mt-3">
                Direct this person to purchase a new pass.
              </p>
            )}

            <button
              onClick={resetScanner}
              className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800"
            >
              Scan Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
