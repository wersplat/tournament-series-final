import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const { searchParams } = url
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) next = '/'

  if (code) {
    const supabase = supabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = req.headers.get('x-forwarded-host') || url.host
      const forwardedProto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')
      const origin = `${forwardedProto}://${forwardedHost}`
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback: send home on error
  return NextResponse.redirect(`${url.origin}/`)
}
