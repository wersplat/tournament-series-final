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
            color: 'navy',
            variant: 'filled',
          },
          styles: {
            base: {
              initial: {
                textTransform: 'normal',
              },
            },
            variants: {
              filled: {
                blue: {
                  background: 'bg-[#007BFF]',
                  color: 'text-white',
                  '&:hover': {
                    background: 'bg-[#0056CC]',
                  },
                },
                orange: {
                  background: 'bg-[#FF6B00]',
                  color: 'text-white',
                  '&:hover': {
                    background: 'bg-[#E55A00]',
                  },
                },
                red: {
                  background: 'bg-[#A51E2C]',
                  color: 'text-white',
                  '&:hover': {
                    background: 'bg-[#8A1A25]',
                  },
                },
                navy: {
                  background: 'bg-[#0A1A3F]',
                  color: 'text-white',
                  '&:hover': {
                    background: 'bg-[#08152F]',
                  },
                },
              },
              outlined: {
                blue: {
                  border: 'border border-[#007BFF]',
                  color: 'text-[#007BFF]',
                  '&:hover': {
                    background: 'bg-[#007BFF]/10',
                  },
                },
                orange: {
                  border: 'border border-[#FF6B00]',
                  color: 'text-[#FF6B00]',
                  '&:hover': {
                    background: 'bg-[#FF6B00]/10',
                  },
                },
                red: {
                  border: 'border border-[#A51E2C]',
                  color: 'text-[#A51E2C]',
                  '&:hover': {
                    background: 'bg-[#A51E2C]/10',
                  },
                },
                navy: {
                  border: 'border border-[#0A1A3F]',
                  color: 'text-[#0A1A3F]',
                  '&:hover': {
                    background: 'bg-[#0A1A3F]/10',
                  },
                },
              },
            },
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


