import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (!req.nextUrl.pathname.startsWith('/admin')) return res

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return res

  const supabase = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number }) {
        res.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: { path?: string }) {
        res.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if ((data as { role?: string } | null)?.role !== 'admin') {
    // If a logged-in non-admin hits /admin, send them home (not back to login with next=/admin which loops)
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}


