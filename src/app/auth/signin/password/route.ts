import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export function GET(req: NextRequest) {
  // Gracefully handle accidental GETs by sending users to the login page
  return NextResponse.redirect(new URL('/login', req.url))
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const email = String(form.get('email') || '')
  const password = String(form.get('password') || '')
  const next = String(form.get('next') || '/')
  const supabase = createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const rawSite = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteUrl = rawSite.startsWith('http') ? rawSite : `https://${rawSite}`
  return NextResponse.redirect(new URL(next || '/', siteUrl))
}


