import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Gorantla Multi Speciality Dental Clinic | Vizianagaram",
  description: "Advanced multi-speciality dental care in Vizianagaram. Located at Satya Sai Complex, Raja Bazaar / A.G. Road. Call +91 89222 31777.",
  icons: {
    icon: '/images/dr-anand-logo.jpg',
    apple: '/images/dr-anand-logo.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF8F6',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
