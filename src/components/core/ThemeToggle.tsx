'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [mode, setMode] = useState<'xbox' | 'playstation'>('xbox')
  const [mounted, setMounted] = useState(false)

  // Load persisted theme on mount to avoid SSR/CSR text mismatch
  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'xbox' | 'playstation' | null) : null)
    if (saved) setMode(saved)
    setMounted(true)
  }, [])

  // Reflect theme to DOM and persist after mount
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'playstation') root.setAttribute('data-theme', 'playstation')
    else root.removeAttribute('data-theme')
    if (mounted) localStorage.setItem('theme', mode)
  }, [mode, mounted])
  return (
    <Button variant="outline" size="sm" onClick={() => setMode(mode === 'xbox' ? 'playstation' : 'xbox')}>
      {mode === 'xbox' ? 'Xbox' : 'PlayStation'}
    </Button>
  )
}


