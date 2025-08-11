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

  // Honor roles from app metadata when present; avoid direct DB reads here
  let dbRole: string | null = null
  const meta: any = (user as any).raw_app_meta_data || (user as any).app_metadata || {}
  const roles: string[] = Array.isArray(meta.roles) ? meta.roles.map((r: any) => String(r)) : []
  const isAdmin = dbRole === 'admin' || roles.includes('admin') || roles.includes('league_staff')
  const isLeagueStaff = dbRole === 'league_staff' || roles.includes('league_staff')
  if (!isAdmin && !isLeagueStaff) {
    // If a logged-in non-admin hits /admin, send them home (not back to login with next=/admin which loops)
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}


