import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export function GET(req: NextRequest) {
  // Gracefully handle accidental GETs by sending users to the login page
  return NextResponse.redirect(new URL('/login', req.url))
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const email = String(form.get('email') || '')
  const password = String(form.get('password') || '')
  const next = String(form.get('next') || '/')
  const supabase = supabaseServer()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const forwardedHost = req.headers.get('x-forwarded-host')
  const forwardedProto = req.headers.get('x-forwarded-proto')
  const url = new URL(req.url)
  const proto = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : url.protocol.replace(':', ''))
  const host = forwardedHost || url.host
  const origin = `${proto}://${host}`
  return NextResponse.redirect(new URL(next || '/', origin))
}


