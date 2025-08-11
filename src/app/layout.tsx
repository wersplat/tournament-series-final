import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import SiteHeader from '@/components/core/SiteHeader'
import SiteFooter from '@/components/core/SiteFooter'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '2K26 Tournament Series',
  description: 'Tournament Series — Schedule, Rankings, Teams, Players, Media',
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <a href="#content" className="sr-only focus:not-sr-only focus:ring-2 focus:ring-ring">
            Skip to content
          </a>
          <SiteHeader />
          <main id="content" className="container py-6">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}


