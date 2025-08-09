import 'server-only'
import { createServerSupabase } from '@/lib/supabase/server'

export async function getSession() {
  const supabase = createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUserRole() {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  return (data as { role?: string } | null)?.role ?? null
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) return { ok: false as const, reason: 'no-session' as const }
  const role = await getUserRole()
  return { ok: role === 'admin' }
}


