'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [mode, setMode] = useState<'xbox' | 'playstation'>(() => {
    if (typeof window === 'undefined') return 'xbox'
    return (localStorage.getItem('theme') as 'xbox' | 'playstation') || 'xbox'
  })
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'playstation') root.setAttribute('data-theme', 'playstation')
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', mode)
  }, [mode])
  return (
    <Button variant="outline" size="sm" onClick={() => setMode(mode === 'xbox' ? 'playstation' : 'xbox')}>
      {mode === 'xbox' ? 'Xbox' : 'PlayStation'}
    </Button>
  )
}


