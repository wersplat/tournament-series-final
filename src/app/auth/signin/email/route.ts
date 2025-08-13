import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const email = String(form.get('email') || '')
  const supabase = supabaseServer()
  const forwardedHost = req.headers.get('x-forwarded-host')
  const forwardedProto = req.headers.get('x-forwarded-proto')
  const url = new URL(req.url)
  const proto = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : url.protocol.replace(':', ''))
  const host = forwardedHost || url.host
  const origin = `${proto}://${host}`
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/` } })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/?sent=1', origin))
}


