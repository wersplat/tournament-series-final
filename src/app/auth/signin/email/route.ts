import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const email = String(form.get('email') || '')
  const supabase = supabaseServer()
  const rawSite = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteUrl = rawSite.startsWith('http') ? rawSite : `https://${rawSite}`
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${siteUrl}/` } })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/?sent=1', siteUrl))
}


