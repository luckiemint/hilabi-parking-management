'use client'
import { useRouter } from 'next/navigation'

const ROLES = [
  {
    title: 'Admin',
    sub: 'Manage passes & view stats',
    icon: '🛡️',
    bg: 'bg-violet-600',
    route: '/demo/admin',
    cta: 'Login as Admin',
  },
  {
    title: 'Employee',
    sub: 'Scan QR at entry & exit gate',
    icon: '📷',
    bg: 'bg-blue-600',
    route: '/demo/scanner',
    cta: 'Login as Employee',
  },
  {
    title: 'Visitor',
    sub: 'Register and get your QR pass',
    icon: '🎫',
    bg: 'bg-emerald-600',
    route: '/demo/register',
    cta: 'Register & Get Pass',
  },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          
          <h1 className="text-2xl font-bold text-white">Hilabi Parking</h1>
          <p className="text-gray-400 text-sm mt-1">QR-based pass management</p>
        </div>

        {/* Role cards */}
        <div className="space-y-3">
          {ROLES.map((role) => (
            <button
              key={role.title}
              onClick={() => router.push(role.route)}
              className={`w-full ${role.bg} rounded-2xl p-4 flex items-center gap-4 text-left active:scale-95 transition-transform`}
            >
              <span className="text-3xl">{role.icon}</span>
              <div className="flex-1">
                <p className="text-white font-semibold text-base">{role.title}</p>
                <p className="text-white/70 text-xs mt-0.5">{role.sub}</p>
              </div>
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">Demo mode · No login required</p>
      </div>
    </div>
  )
}
