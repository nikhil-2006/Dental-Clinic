import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Dr. Anand's Dental Clinic | Vizianagaram",
  description: "Modern, thoughtful dental care in Vizianagaram. 5.0 Star rated clinic in Ayya Koneru with 24/7 availability.",
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
