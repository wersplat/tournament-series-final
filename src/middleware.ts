import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      const url = new URL('/login', req.url)
      url.searchParams.set('next', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    if ((data as { role?: string } | null)?.role !== 'admin') {
      const url = new URL('/login', req.url)
      url.searchParams.set('next', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}


