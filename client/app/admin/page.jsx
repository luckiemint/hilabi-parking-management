'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'

const DEPT_LABELS = {
  office: 'Office',
  vendor: 'Vendor',
  participants: 'Participants',
  cab_driver: 'Cab Driver',
  tourist_guide: 'Tourist Guide',
}

const STATUS_BADGE = {
  active: 'bg-green-100 text-green-700',
  checked_in: 'bg-blue-100 text-blue-700',
  expired: 'bg-gray-100 text-gray-600',
  revoked: 'bg-red-100 text-red-600',
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [passes, setPasses] = useState([])
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') { router.replace('/login'); return }
    loadData()
  }, [router])

  async function loadData() {
    setLoading(true)
    try {
      const [statsRes, passesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/passes'),
      ])
      setStats(statsRes.data)
      setPasses(passesRes.data)
    } catch {
      router.replace('/login')
    } finally {
      setLoading(false)
    }
  }

  async function loadPasses() {
    const params = {}
    if (search) params.search = search
    if (filterDept) params.department = filterDept
    if (filterStatus) params.status = filterStatus
    const res = await api.get('/admin/passes', { params })
    setPasses(res.data)
  }

  async function revokePass(id) {
    if (!confirm('Revoke this pass? The person will be denied entry immediately.')) return
    setRevoking(id)
    try {
      await api.patch(`/admin/passes/${id}/revoke`)
      loadData()
    } catch {
      alert('Failed to revoke pass')
    } finally {
      setRevoking(null)
    }
  }

  function logout() {
    localStorage.clear()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hilabi Admin</h1>
          <p className="text-gray-500 text-sm">Pass Management Dashboard</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/admin/generate"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Generate Pass
          </a>
          <button onClick={logout} className="text-gray-500 hover:text-gray-700 text-sm">Logout</button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Passes" value={stats.total} color="blue" />
            <StatCard label="Checked In" value={stats.checked_in} color="green" />
            <StatCard label="Active" value={stats.active} color="yellow" />
            <StatCard label="Revoked" value={stats.revoked} color="red" />
          </div>
        )}

        {/* Department breakdown */}
        {stats && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">By Department</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(DEPT_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{stats[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passes table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadPasses()}
              placeholder="Search name or phone..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[180px]"
            />
            <select
              value={filterDept}
              onChange={(e) => { setFilterDept(e.target.value); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {Object.entries(DEPT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="checked_in">Checked In</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
            <button
              onClick={loadPasses}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Search
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
          ) : passes.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No passes found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Department</th>
                    <th className="text-left px-4 py-3">Valid Until</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Checked In</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {passes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{DEPT_LABELS[p.department]}</td>
                      <td className="px-4 py-3 text-gray-600">{p.valid_until}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[p.status] || 'bg-gray-100 text-gray-600'}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {p.checked_in_at ? new Date(p.checked_in_at).toLocaleTimeString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {p.status !== 'revoked' && (
                          <button
                            onClick={() => revokePass(p.id)}
                            disabled={revoking === p.id}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                          >
                            {revoking === p.id ? 'Revoking...' : 'Revoke'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  }
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value ?? '—'}</p>
      <p className="text-sm mt-0.5 opacity-80">{label}</p>
    </div>
  )
}
