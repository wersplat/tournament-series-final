import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const provider = String(form.get('provider') || '') as 'google' | 'discord' | 'twitter'

  const supabase = supabaseServer()

  const forwardedHost = req.headers.get('x-forwarded-host')
  const forwardedProto = req.headers.get('x-forwarded-proto')
  const url = new URL(req.url)
  const proto = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : url.protocol.replace(':', ''))
  const host = forwardedHost || url.host
  const origin = `${proto}://${host}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` }
  })
  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message ?? 'No auth URL' }, { status: 400 })
  }

  // Force POST -> GET for the external authorize URL
  return NextResponse.redirect(data.url, 303)
}