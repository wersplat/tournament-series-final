import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const provider = String(form.get('provider') || '') as 'google' | 'discord' | 'twitter'

  const supabase = createServerSupabase()
  const rawSite = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteUrl = rawSite.startsWith('http') ? rawSite : `https://${rawSite}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl}/auth/callback` }
  })
  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message ?? 'No auth URL' }, { status: 400 })
  }

  // Force POST -> GET for the external authorize URL
  return NextResponse.redirect(data.url, 303)
}