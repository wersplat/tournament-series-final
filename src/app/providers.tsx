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
          styles: {
            base: {
              initial: {
                textTransform: 'normal',
              },
            },
            variants: {
              filled: {
                green: {
                  background: 'bg-[#9BF00B]',
                  color: 'text-black',
                  '&:hover': {
                    background: 'bg-[#8AE00A]',
                  },
                },
                blue: {
                  background: 'bg-[#00E0FF]',
                  color: 'text-black',
                  '&:hover': {
                    background: 'bg-[#00C8E6]',
                  },
                },
              },
              outlined: {
                green: {
                  border: 'border border-[#9BF00B]',
                  color: 'text-[#9BF00B]',
                  '&:hover': {
                    background: 'bg-[#9BF00B]/10',
                  },
                },
                blue: {
                  border: 'border border-[#00E0FF]',
                  color: 'text-[#00E0FF]',
                  '&:hover': {
                    background: 'bg-[#00E0FF]/10',
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


