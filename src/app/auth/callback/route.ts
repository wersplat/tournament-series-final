import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) next = '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // In production behind a proxy, prefer x-forwarded-host when present
      const forwardedHost = req.headers.get('x-forwarded-host')
      if (process.env.NODE_ENV !== 'development' && forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else if (process.env.NODE_ENV === 'development') {
        return NextResponse.redirect(`http://localhost:3000${next}`)
      } else {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback: send home on error
  return NextResponse.redirect(`${origin}${next}`)
}


