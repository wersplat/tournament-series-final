import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerSupabase()
  await supabase.auth.signOut()
  const rawSite = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteUrl = rawSite.startsWith('http') ? rawSite : `https://${rawSite}`
  return NextResponse.redirect(new URL('/', siteUrl))
}


