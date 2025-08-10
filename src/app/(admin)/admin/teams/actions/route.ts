import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin, requireLeagueStaff } from '@/lib/auth'
import { insertTeam, updateTeamById, deleteTeamById } from '@/lib/api/supabase-admin'

export async function POST(req: NextRequest) {
  const canAdmin = await requireAdmin()
  const canStaff = await requireLeagueStaff()
  if (!canAdmin.ok && !canStaff.ok) return NextResponse.redirect(new URL('/login', req.url))

  const form = await req.formData()
  const op = String(form.get('op') || 'create')

  try {
    if (op === 'create') {
      const name = String(form.get('name') || '').trim()
      const logo_url = String(form.get('logo_url') || '').trim() || null
      if (name) await insertTeam({ name, logo_url })
    } else if (op === 'update') {
      const id = String(form.get('id') || '')
      const name = String(form.get('name') || '').trim()
      const logo_url = String(form.get('logo_url') || '').trim() || null
      if (id && name) await updateTeamById(id, { name, logo_url })
    } else if (op === 'delete') {
      const id = String(form.get('id') || '')
      if (id) await deleteTeamById(id)
    }
  } catch (e) {
    console.error('admin teams action error', e)
  }

  return NextResponse.redirect(new URL('/admin/teams', req.url))
}


