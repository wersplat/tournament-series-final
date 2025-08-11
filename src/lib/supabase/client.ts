'use client'

import { createBrowserClient } from '@supabase/ssr'

export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Supabase env not configured')
  return createBrowserClient(url, anon)
}


