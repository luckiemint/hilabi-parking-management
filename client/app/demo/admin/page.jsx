'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATS = [
  { label: 'Total',       value: 248, color: 'bg-gray-100 text-gray-800' },
  { label: 'Active',      value: 112, color: 'bg-green-100 text-green-700' },
  { label: 'Checked In',  value: 89,  color: 'bg-blue-100 text-blue-700' },
  { label: 'Checked Out', value: 38,  color: 'bg-teal-100 text-teal-700' },
  { label: 'Expired',     value: 6,   color: 'bg-amber-100 text-amber-700' },
  { label: 'Revoked',     value: 3,   color: 'bg-red-100 text-red-600' },
]

const DEPT_STATS = [
  { label: 'Office',        value: 72,  color: 'bg-violet-400' },
  { label: 'Vendor',        value: 61,  color: 'bg-blue-400' },
  { label: 'Participants',  value: 88,  color: 'bg-emerald-400' },
  { label: 'Cab Driver',    value: 19,  color: 'bg-amber-400' },
  { label: 'Tourist Guide', value: 8,   color: 'bg-rose-400' },
]

const MOCK_PASSES = [
  { id: 1,  name: 'Arjun Mehta',    phone: '+91 98765 43210', department: 'Vendor',        valid_until: '2026-06-05', status: 'checked_in',  checked_in_at: '09:14 AM', checked_out_at: '—' },
  { id: 2,  name: 'Priya Sharma',   phone: '+91 87654 32109', department: 'Office',         valid_until: '2026-06-02', status: 'active',       checked_in_at: '—',        checked_out_at: '—' },
  { id: 3,  name: 'Mohammed Rizvi', phone: '+91 76543 21098', department: 'Participants',   valid_until: '2026-06-03', status: 'checked_in',  checked_in_at: '10:02 AM', checked_out_at: '—' },
  { id: 4,  name: 'Sunita Patel',   phone: '+91 65432 10987', department: 'Tourist Guide',  valid_until: '2026-06-04', status: 'active',       checked_in_at: '—',        checked_out_at: '—' },
  { id: 5,  name: 'Rajan Thomas',   phone: '+91 54321 09876', department: 'Cab Driver',     valid_until: '2026-06-02', status: 'revoked',      checked_in_at: '—',        checked_out_at: '—' },
  { id: 6,  name: 'Deepa Nair',     phone: '+91 43210 98765', department: 'Office',         valid_until: '2026-06-07', status: 'active',       checked_in_at: '—',        checked_out_at: '—' },
  { id: 7,  name: 'Vikram Singh',   phone: '+91 32109 87654', department: 'Vendor',         valid_until: '2026-06-02', status: 'checked_in',  checked_in_at: '08:47 AM', checked_out_at: '—' },
  { id: 8,  name: 'Anita Desai',    phone: '+91 21098 76543', department: 'Participants',   valid_until: '2026-06-02', status: 'checked_out', checked_in_at: '07:55 AM', checked_out_at: '11:30 AM' },
  { id: 9,  name: 'Rohit Verma',    phone: '+91 10987 65432', department: 'Office',         valid_until: '2026-05-30', status: 'expired',      checked_in_at: '—',        checked_out_at: '—' },
  { id: 10, name: 'Fatima Sheikh',  phone: '+91 09876 54321', department: 'Cab Driver',     valid_until: '2026-06-02', status: 'checked_out', checked_in_at: '08:30 AM', checked_out_at: '12:15 PM' },
]

const STATUS_CFG = {
  active:      { cls: 'bg-green-100 text-green-700',  dot: 'bg-green-500',  label: 'Active' },
  checked_in:  { cls: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500',   label: 'Checked In' },
  checked_out: { cls: 'bg-teal-100 text-teal-700',    dot: 'bg-teal-500',   label: 'Checked Out' },
  expired:     { cls: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-400',  label: 'Expired' },
  revoked:     { cls: 'bg-red-100 text-red-600',      dot: 'bg-red-500',    label: 'Revoked' },
}

const NAV = [
  { key: 'Overview', icon: '📊', label: 'Overview' },
  { key: 'Passes',   icon: '🎫', label: 'Passes' },
]

export default function DemoAdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('Overview')
  const [passes, setPasses] = useState(MOCK_PASSES)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [revoking, setRevoking] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  function handleRevoke(id) {
    setRevoking(id)
    setTimeout(() => {
      setPasses((prev) => prev.map((p) => p.id === id ? { ...p, status: 'revoked' } : p))
      setRevoking(null)
    }, 700)
  }

  const filtered = passes.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const sw = sidebarCollapsed ? 'md:w-16' : 'md:w-56 lg:w-64'
  const ml = sidebarCollapsed ? 'md:ml-16' : 'md:ml-56 lg:ml-64'

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── SIDEBAR (tablet/desktop only) ─────────────────────── */}
      <aside className={`hidden md:flex flex-col ${sw} bg-gray-900 min-h-screen fixed left-0 top-0 bottom-0 z-20 transition-all duration-200`}>
        {/* Logo */}
        <div className={`border-b border-gray-800 ${sidebarCollapsed ? 'px-3 py-5 flex justify-center' : 'px-5 py-5'}`}>
          {sidebarCollapsed ? (
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0">
              <IcoPark />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0">
                <IcoPark />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Hilabi Parking</p>
                <p className="text-gray-500 text-xs">Admin Panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {[
            { key: 'Overview', label: 'Overview', icon: <IcoGrid /> },
            { key: 'Passes',   label: 'Passes',   icon: <IcoCard /> },
          ].map((n) => (
            <button key={n.key} onClick={() => setTab(n.key)}
              title={sidebarCollapsed ? n.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${sidebarCollapsed ? 'justify-center' : ''}
                ${tab === n.key ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <span className="w-5 h-5 shrink-0">{n.icon}</span>
              {!sidebarCollapsed && n.label}
            </button>
          ))}
          <button onClick={() => router.push('/demo/admin/generate')}
            title={sidebarCollapsed ? 'Generate Pass' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition
              ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <span className="w-5 h-5 shrink-0"><IcoPlus /></span>
            {!sidebarCollapsed && 'Generate Pass'}
          </button>
        </nav>

        {/* Collapse toggle + logout */}
        <div className="px-2 py-4 border-t border-gray-800 space-y-1">
          <button onClick={() => router.push('/')}
            title={sidebarCollapsed ? 'Back to Home' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition
              ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <span className="w-5 h-5 shrink-0"><IcoLogout /></span>
            {!sidebarCollapsed && 'Back to Home'}
          </button>
          <button onClick={() => setSidebarCollapsed((c) => !c)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition
              ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <span className={`w-5 h-5 shrink-0 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}>
              <IcoChevronLeft />
            </span>
            {!sidebarCollapsed && 'Collapse'}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className={`flex-1 ${ml} flex flex-col min-h-screen transition-all duration-200`}>

        {/* ── DESKTOP/TABLET HEADER ── */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{tab}</h1>
            <p className="text-gray-400 text-xs">Hilabi Parking Pass Management</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-violet-100 text-violet-600 px-3 py-1.5 rounded-full font-semibold">Admin</span>
            <button
              onClick={() => router.push('/demo/admin/generate')}
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              + Generate Pass
            </button>
          </div>
        </header>

        {/* ── MOBILE HEADER ── */}
        <div className="md:hidden bg-white px-4 pt-5 pb-4 border-b border-gray-100 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium tracking-wide">ADMIN PANEL</p>
              <h1 className="text-xl font-bold text-gray-900">Hilabi Parking</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full font-semibold">Admin</span>
              <button onClick={() => router.push('/')} className="w-8 h-8 flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── PAGE BODY ── */}
        {/* Mobile wrapper */}
        <div className="md:hidden flex-1 overflow-y-auto pb-28 px-4 py-5 space-y-4 max-w-md mx-auto w-full">
          <MobileContent tab={tab} filtered={filtered} search={search} setSearch={setSearch} filterStatus={filterStatus} setFilterStatus={setFilterStatus} handleRevoke={handleRevoke} revoking={revoking} />
        </div>

        {/* Desktop/tablet wrapper */}
        <div className="hidden md:block flex-1 p-6 space-y-6">
          <DesktopContent tab={tab} filtered={filtered} search={search} setSearch={setSearch} filterStatus={filterStatus} setFilterStatus={setFilterStatus} handleRevoke={handleRevoke} revoking={revoking} router={router} />
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-around z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <button onClick={() => setTab('Overview')}
            className={`flex flex-col items-center gap-1 px-6 transition-colors ${tab === 'Overview' ? 'text-gray-900' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={tab === 'Overview' ? 2.5 : 1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs font-medium">Overview</span>
          </button>

          <button onClick={() => router.push('/demo/admin/generate')}
            className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg -mt-6 active:scale-95 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button onClick={() => setTab('Passes')}
            className={`flex flex-col items-center gap-1 px-6 transition-colors ${tab === 'Passes' ? 'text-gray-900' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={tab === 'Passes' ? 2.5 : 1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-xs font-medium">Passes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const STATUS_FILTERS = [
  { value: '',            label: 'All' },
  { value: 'active',      label: 'Active' },
  { value: 'checked_in',  label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'expired',     label: 'Expired' },
  { value: 'revoked',     label: 'Revoked' },
]

/* ── MOBILE CONTENT ────────────────────────────────────────── */
function MobileContent({ tab, filtered, search, setSearch, filterStatus, setFilterStatus, handleRevoke, revoking }) {
  if (tab === 'Overview') return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-3`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-800">By Department</p>
        {DEPT_STATS.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-24 shrink-0">{d.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className={`${d.color} h-2 rounded-full`} style={{ width: `${(d.value / 248) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-gray-700 w-5 text-right">{d.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">Recent Activity</p>
        <div className="space-y-3">
          {filtered.slice(0, 4).map((p) => {
            const s = STATUS_CFG[p.status]
            return (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.department}</p>
                </div>
                <StatusBadge s={s} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  const [filterOpen, setFilterOpen] = useState(false)
  const activeFilter = STATUS_FILTERS.find((f) => f.value === filterStatus)

  return (
    <>
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
        </div>

        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`h-full px-3.5 rounded-2xl border shadow-sm flex items-center gap-1.5 text-sm font-medium transition
              ${filterStatus ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-100 text-gray-600'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {filterStatus ? activeFilter?.label : 'Filter'}
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-30">
              {STATUS_FILTERS.map((f, i) => (
                <button
                  key={f.value}
                  onClick={() => { setFilterStatus(f.value); setFilterOpen(false) }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition hover:bg-gray-50
                    ${filterStatus === f.value ? 'font-semibold text-gray-900' : 'text-gray-600'}
                    ${i !== STATUS_FILTERS.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  {f.label}
                  {filterStatus === f.value && (
                    <svg className="w-3.5 h-3.5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => {
          const s = STATUS_CFG[p.status]
          return (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </div>
                </div>
                <StatusBadge s={s} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoCell label="Department"  value={p.department} />
                <InfoCell label="Valid Until"  value={p.valid_until} />
                <InfoCell label="Checked In"  value={p.checked_in_at} />
                <InfoCell label="Checked Out" value={p.checked_out_at} />
              </div>
              {p.status !== 'revoked' && (
                <button onClick={() => handleRevoke(p.id)} disabled={revoking === p.id}
                  className="mt-3 w-full py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 disabled:opacity-40 transition">
                  {revoking === p.id ? 'Revoking...' : 'Revoke Pass'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── DESKTOP CONTENT ───────────────────────────────────────── */
function DesktopContent({ tab, filtered, search, setSearch, filterStatus, setFilterStatus, handleRevoke, revoking, router }) {
  if (tab === 'Overview') return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-1 opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department chart */}
        <div className="bg-white rounded-2xl p-5 space-y-3 lg:col-span-1">
          <p className="text-sm font-semibold text-gray-800">By Department</p>
          {DEPT_STATS.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-28 shrink-0">{d.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className={`${d.color} h-2.5 rounded-full`} style={{ width: `${(d.value / 248) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-700 w-6 text-right">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Recent Activity</p>
            <button onClick={() => {}} className="text-xs text-blue-600 font-medium">View all passes →</button>
          </div>
          <div className="space-y-3">
            {filtered.slice(0, 6).map((p) => {
              const s = STATUS_CFG[p.status]
              return (
                <div key={p.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <Avatar name={p.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.phone} · {p.department}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge s={s} />
                    <p className="text-xs text-gray-400 mt-1">Until {p.valid_until}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  // Passes tab — full table on desktop
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>

        <button onClick={() => router.push('/demo/admin/generate')}
          className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition ml-auto">
          + Generate Pass
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-semibold">Name</th>
              <th className="text-left px-5 py-3 font-semibold">Phone</th>
              <th className="text-left px-5 py-3 font-semibold">Department</th>
              <th className="text-left px-5 py-3 font-semibold">Valid Until</th>
              <th className="text-left px-5 py-3 font-semibold">Status</th>
              <th className="text-left px-5 py-3 font-semibold">Checked In</th>
              <th className="text-left px-5 py-3 font-semibold">Checked Out</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => {
              const s = STATUS_CFG[p.status]
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} />
                      <span className="font-semibold text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.phone}</td>
                  <td className="px-5 py-3.5 text-gray-600">{p.department}</td>
                  <td className="px-5 py-3.5 text-gray-600">{p.valid_until}</td>
                  <td className="px-5 py-3.5"><StatusBadge s={s} /></td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{p.checked_in_at}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{p.checked_out_at}</td>
                  <td className="px-5 py-3.5">
                    {p.status !== 'revoked' && (
                      <button onClick={() => handleRevoke(p.id)} disabled={revoking === p.id}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold disabled:opacity-40">
                        {revoking === p.id ? 'Revoking...' : 'Revoke'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── SHARED COMPONENTS ─────────────────────────────────────── */
function Avatar({ name, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'
  return (
    <div className={`${sz} bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 shrink-0`}>
      {name[0]}
    </div>
  )
}

function StatusBadge({ s }) {
  if (!s) return null
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function InfoCell({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold text-gray-700 mt-0.5">{value}</p>
    </div>
  )
}

/* ── SIDEBAR ICONS ─────────────────────────────────────────── */
function IcoPark() {
  return (
    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
function IcoGrid() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}
function IcoCard() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  )
}
function IcoPlus() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
    </svg>
  )
}
function IcoLogout() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
function IcoChevronLeft() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
    </svg>
  )
}
