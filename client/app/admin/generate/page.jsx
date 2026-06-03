'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import api from '../../../lib/api'

const DEPARTMENTS = [
  { value: 'office', label: 'Office' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'participants', label: 'Participants' },
  { value: 'cab_driver', label: 'Cab Driver' },
  { value: 'tourist_guide', label: 'Tourist Guide' },
]

function today() {
  return new Date().toISOString().split('T')[0]
}

function addDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const QUICK_DURATIONS = [
  { label: '1 Day', days: 0 },
  { label: '3 Days', days: 2 },
  { label: '1 Week', days: 6 },
  { label: '1 Month', days: 29 },
]

export default function GeneratePassPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: '',
    valid_from: today(),
    valid_until: today(),
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passData, setPassData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') router.replace('/login')
  }, [router])

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function applyQuickDuration(days) {
    setForm((f) => ({ ...f, valid_from: today(), valid_until: addDays(days) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || !form.department || !form.valid_from || !form.valid_until) {
      return setError('All fields are required')
    }
    if (form.valid_from > form.valid_until) {
      return setError('Valid From must be before Valid Until')
    }
    setLoading(true)
    try {
      const res = await api.post('/admin/passes', form)
      setPassData({ ...res.data, ...form })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate pass')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setPassData(null)
    setForm({ name: '', phone: '', department: '', valid_from: today(), valid_until: today() })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <a href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">← Back</a>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Generate Pass</h1>
          <p className="text-gray-500 text-xs">Create a pass with custom duration</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {!passData ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>

                <div className="flex gap-2 mb-3 flex-wrap">
                  {QUICK_DURATIONS.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => applyQuickDuration(q.days)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition
                        ${form.valid_until === addDays(q.days) && form.valid_from === today()
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Valid From</label>
                    <input
                      type="date"
                      name="valid_from"
                      value={form.valid_from}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Valid Until</label>
                    <input
                      type="date"
                      name="valid_until"
                      value={form.valid_until}
                      onChange={handleChange}
                      min={form.valid_from}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Pass'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">Pass Generated</h2>
            </div>

            <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
              <QRCodeSVG value={`PASS:${passData.passId}`} size={200} />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <Row label="Name" value={passData.name} />
              <Row label="Phone" value={passData.phone} />
              <Row label="Department" value={passData.department.replace('_', ' ')} />
              <Row label="Valid From" value={passData.valid_from} />
              <Row label="Valid Until" value={passData.valid_until} />
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Generate Another
              </button>
              <a
                href="/admin"
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium text-center hover:bg-blue-700"
              >
                Back to Dashboard
              </a>
            </div>
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
      <span className="font-medium capitalize">{value}</span>
    </div>
  )
}
