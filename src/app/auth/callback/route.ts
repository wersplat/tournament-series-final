import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const { searchParams } = url
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) next = '/'

  if (code) {
    const supabase = createServerSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = req.headers.get('x-forwarded-host')
      const rawSite = process.env.NEXT_PUBLIC_SITE_URL || ''
      const siteUrl = rawSite ? (rawSite.startsWith('http') ? rawSite : `https://${rawSite}`) : null
      if (forwardedHost && process.env.NODE_ENV === 'production') {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      }
      if (siteUrl) {
        return NextResponse.redirect(new URL(next, siteUrl))
      }
      return NextResponse.redirect(`${url.origin}${next}`)
    }
  }

  // Fallback: send home on error
  return NextResponse.redirect(`${url.origin}/`)
}
