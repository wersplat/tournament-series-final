"use client"
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const MTThemeProvider = dynamic(() => import('@material-tailwind/react').then(m => m.ThemeProvider), { ssr: false })

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MTThemeProvider
      value={{
        button: {
          defaultProps: {
            className:
              'rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            color: 'green',
            variant: 'filled',
          },
        },
        card: {
          defaultProps: {
            className:
              'rounded-2xl bg-card text-foreground border border-border ring-1 ring-transparent dark:ring-white/10',
          },
        },
        tabs: {
          defaultProps: {
            className: 'rounded-2xl',
          },
        },
      }}
    >
      {children}
    </MTThemeProvider>
  )
}


