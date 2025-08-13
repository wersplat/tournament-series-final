import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Supabase env not configured')

  // Wrap next/headers cookies to match expected interface
  const cookieMethods = {
    async get(name: string) {
      const store = await cookies()
      return store.get(name)?.value
    },
    async set(name: string, value: string, options?: CookieOptions & { name?: string }) {
      try {
        const store = await cookies()
        store.set({ name, value, ...options })
      } catch {
        // ignore during RSC render
      }
    },
    async remove(name: string, options?: CookieOptions & { name?: string }) {
      try {
        const store = await cookies()
        store.set({ name, value: '', ...options, maxAge: 0 })
      } catch {
        // ignore during RSC render
      }
    },
  }

  return createServerClient(url, anon, { cookies: cookieMethods as any })
}


