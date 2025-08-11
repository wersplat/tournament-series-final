import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/core/ThemeToggle'
import { Button } from '@/components/ui/button'
import { supabaseServer } from '@/lib/supabase/server'

export default async function SiteHeader() {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/60 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 focus-ring">
            <Image src="/brand/logo.svg" alt="2K26" width={28} height={28} />
            <span className="text-sm font-semibold">2K26 Tournament Series</span>
          </Link>
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link href="/schedule" className="hover:underline">Schedule</Link>
            <Link href="/rankings" className="hover:underline">Rankings</Link>
            <Link href="/events" className="hover:underline">Events</Link>
            <Link href="/teams" className="hover:underline">Teams</Link>
            <Link href="/players" className="hover:underline">Players</Link>
            <Link href="/media" className="hover:underline">Media</Link>
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
        </div>
      </div>
    </header>
  )
}


