import 'server-only'
import { supabaseServer } from '@/lib/supabase/server'

type FetchOpts = { tags?: string[]; revalidate?: number }
type FetchInit = any

export async function apiFetch(path: string, init: FetchInit = {}, opts?: FetchOpts) {
  const supabase = supabaseServer()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const url = path.startsWith('http')
    ? path
    : `${process.env.NEXT_PUBLIC_PUBLIC_API_URL}${path}`

  return fetch(url, {
    ...(init as any),
    headers: {
      ...((init as any).headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: {
      revalidate: opts?.revalidate ?? 60,
      tags: opts?.tags,
    },
  })
}

export async function adminFetch(path: string, init: FetchInit = {}) {
  const supabase = supabaseServer()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Not authenticated')

  const url = path.startsWith('http')
    ? path
    : `${process.env.NEXT_PUBLIC_ADMIN_API_URL}${path}`

  return fetch(url, {
    ...(init as any),
    headers: {
      'Content-Type': 'application/json',
      ...((init as any).headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })
}


