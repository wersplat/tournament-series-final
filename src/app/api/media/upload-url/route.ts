import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { adminFetch } from '@/lib/api'

export async function GET() {
  const supabase = supabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await adminFetch('/media/upload-url', { method: 'POST', body: JSON.stringify({}) })
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status })
  const json = await res.json()
  return NextResponse.json(json)
}


