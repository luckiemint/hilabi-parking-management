'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

const DEPARTMENTS = [
  { value: 'office',        label: 'Office',        emoji: '🏢' },
  { value: 'vendor',        label: 'Vendor',        emoji: '🛒' },
  { value: 'participants',  label: 'Participants',  emoji: '👥' },
  { value: 'cab_driver',    label: 'Cab Driver',    emoji: '🚕' },
  { value: 'tourist_guide', label: 'Tourist Guide', emoji: '🗺️' },
]

const FAKE_PASS_ID = 'b7e1d3c9-2f4a-4b8c-a5d6-3e7f890a1b2c'

export default function DemoRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState('details')
  const [form, setForm] = useState({ name: '', phone: '' })
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [otpSent, setOtpSent] = useState(false)

  function handleOtpChange(val, i) {
    const next = [...otp]
    next[i] = val.replace(/\D/, '').slice(-1)
    setOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }

  const otpFilled = otp.every(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => step === 'details' ? router.push('/') : setStep('details')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Get Your Pass</h1>
            <p className="text-gray-400 text-xs">Hilabi Parking · Visitor Registration</p>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2 mt-4">
          {['details', 'otp', 'pass'].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                step === s ? 'bg-emerald-500' :
                ['details', 'otp', 'pass'].indexOf(step) > i ? 'bg-emerald-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-8">

        {/* Step 1: Details */}
        {step === 'details' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Details</h2>
              <p className="text-gray-400 text-sm mt-1">Enter your name and phone to get a QR pass</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <div className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-500 bg-gray-50 font-semibold">+91</div>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="XXXXX XXXXX"
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-emerald-500"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('otp')}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform mt-4"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verify Phone</h2>
              <p className="text-gray-400 text-sm mt-1">
                We'll confirm your number <span className="font-semibold text-gray-600">+91 {form.phone}</span>
              </p>
            </div>

            {/* Person card */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-lg font-bold text-emerald-700">
                {form.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{form.name || 'Visitor'}</p>
                <p className="text-sm text-gray-400">+91 {form.phone}</p>
              </div>
            </div>

            {!otpSent ? (
              <button
                onClick={() => setOtpSent(true)}
                className="w-full border-2 border-emerald-500 text-emerald-600 font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform"
              >
                Send OTP
              </button>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Enter 6-digit OTP</p>
                  <div className="flex gap-2 justify-center">
                    {otp.map((v, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        maxLength={1}
                        value={v}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => { if (e.key === 'Backspace' && !v && i > 0) document.getElementById(`otp-${i - 1}`)?.focus() }}
                        inputMode="numeric"
                        className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-emerald-500 transition"
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-2">Demo: any 6 digits work</p>
                </div>

                <button
                  onClick={() => setStep('pass')}
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform"
                >
                  Verify & Get Pass
                </button>
              </div>
            )}

            <button onClick={() => setStep('details')} className="w-full text-gray-400 text-sm py-2">← Back</button>
          </div>
        )}

        {/* Step 3: Pass */}
        {step === 'pass' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-3xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-gray-900">Pass Ready!</h2>
              <p className="text-gray-400 text-sm mt-1">Show this QR at the gate</p>
            </div>

            {/* QR card */}
            <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-4 shadow-sm border border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-4">
                <QRCodeSVG value={`PASS:${FAKE_PASS_ID}`} size={200} />
              </div>
              <p className="text-xs text-gray-400 font-mono text-center">{FAKE_PASS_ID}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl divide-y divide-gray-50 border border-gray-100">
              <DetailRow label="Name"  value={form.name || 'Priya Sharma'} />
              <DetailRow label="Phone" value={`+91 ${form.phone || '87654 32109'}`} />
              <DetailRow label="Valid" value="Today · 2026-06-02" />
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <p className="text-amber-700 text-sm font-medium">
                Screenshot this QR. Each pass can only be used once — sharing it will block your entry.
              </p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="font-semibold text-gray-900 text-sm">{value}</span>
    </div>
  )
}
