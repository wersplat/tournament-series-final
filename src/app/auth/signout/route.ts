import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = supabaseServer()
  await supabase.auth.signOut()
  const forwardedHost = req.headers.get('x-forwarded-host')
  const forwardedProto = req.headers.get('x-forwarded-proto')
  const url = new URL(req.url)
  const proto = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : url.protocol.replace(':', ''))
  const host = forwardedHost || url.host
  const origin = `${proto}://${host}`
  return NextResponse.redirect(new URL('/', origin))
}


