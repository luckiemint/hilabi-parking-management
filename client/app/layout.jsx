import './globals.css'

export const metadata = {
  title: 'Hilabi Parking Pass',
  description: 'Parking pass management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-sans" suppressHydrationWarning>{children}</body>
    </html>
  )
}
