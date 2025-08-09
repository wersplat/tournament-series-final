import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/core/SiteHeader'
import SiteFooter from '@/components/core/SiteFooter'

export const metadata: Metadata = {
  title: 'Unified Pro-Am 2K26',
  description: 'Tournament Series — Schedule, Rankings, Teams, Players, Media',
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <a href="#content" className="sr-only focus:not-sr-only focus:ring-2 focus:ring-ring">
          Skip to content
        </a>
        {/* header */}
        {/* @ts-expect-error Async Server Component */}
        <SiteHeader />
        <main id="content" className="container py-6">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}


