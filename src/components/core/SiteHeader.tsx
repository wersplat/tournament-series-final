"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ThemeToggle } from '@/components/core/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface SiteHeaderProps {
  user: any
}

export default function SiteHeader({ user }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationLinks = [
    { href: '/schedule', label: 'Schedule' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/events', label: 'Events' },
    { href: '/teams', label: 'Teams' },
    { href: '/players', label: 'Players' },
    { href: '/media', label: 'Media' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/60 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 focus-ring">
            <Image src="/brand/logo.svg" alt="2K26" width={28} height={28} />
            <span className="text-sm font-semibold">2K26 Tournament Series</span>
          </Link>
          <nav className="hidden md:flex items-center gap-3 text-sm">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/auth/signout" prefetch={false}>
              <Button size="sm" variant="outline">Sign out</Button>
            </Link>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="container py-4 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}


