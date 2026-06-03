'use client'
import { useEffect, useRef, useState } from 'react'

export default function QRScanner({ onScan }) {
  const [error, setError] = useState('')
  const scannerRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    let scanner = null

    async function startScanner() {
      const { Html5Qrcode } = await import('html5-qrcode')
      scanner = new Html5Qrcode('qr-reader-container')
      scannerRef.current = scanner

      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (text) => {
            const passId = text.startsWith('PASS:') ? text.slice(5) : text
            if (mountedRef.current) onScan(passId)
          },
          undefined
        )
      } catch {
        if (mountedRef.current) setError('Camera access denied. Use manual entry below.')
      }
    }

    startScanner()

    return () => {
      mountedRef.current = false
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [onScan])

  return (
    <div className="w-full">
      <div id="qr-reader-container" className="w-full rounded-xl overflow-hidden" />
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
    </div>
  )
}
