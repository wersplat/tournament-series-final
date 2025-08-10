import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createServerSupabase() {
  const cookieStorePromise = cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Supabase env not configured')
  return createServerClient(url, anon, {
    cookies: {
      async get(name: string) {
        const store = await cookieStorePromise
        return store.get(name)?.value
      },
      async set(name: string, value: string, options: { path?: string; maxAge?: number }) {
        try {
          const store = await cookieStorePromise
          store.set({ name, value, ...options })
        } catch {
          // In React Server Components render phase, Next.js disallows cookie writes.
          // Ignore writes here; route handlers will set cookies during auth flows.
        }
      },
      async remove(name: string, options: { path?: string }) {
        try {
          const store = await cookieStorePromise
          store.set({ name, value: '', ...options })
        } catch {
          // See above note – ignore during RSC render.
        }
      },
    },
  })
}


