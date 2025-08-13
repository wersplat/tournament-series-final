import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

function cookieDomain(req: NextRequest) {
  const env = process.env.COOKIE_DOMAIN?.trim()
  if (env) return env
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0]
  if (!host || host === 'localhost' || host.endsWith('.local')) return undefined
  const parts = host.split('.')
  if (parts.length >= 2) return `.${parts.slice(-2).join('.')}`
  return undefined
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''

  // Canonicalize www -> apex per domain to avoid cookie splits
  if (host.startsWith('www.')) {
    const url = new URL(req.url)
    url.host = host.slice(4)
    return NextResponse.redirect(url, 301)
  }

  const res = NextResponse.next()
  if (!req.nextUrl.pathname.startsWith('/admin')) return res

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return res

  const domain = cookieDomain(req)

  const supabase = createServerClient(url, anon, {
    cookies: {
      async get(name: string) {
        return req.cookies.get(name)?.value
      },
      async set(name: string, value: string, options?: CookieOptions) {
        res.cookies.set({ name, value, ...options, ...(domain ? { domain } : {}) })
      },
      async remove(name: string, options?: CookieOptions) {
        res.cookies.set({ name, value: '', ...options, ...(domain ? { domain } : {}), maxAge: 0 })
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
  // Run on all paths so canonical redirect applies site-wide
  matcher: ['/:path*'],
}


