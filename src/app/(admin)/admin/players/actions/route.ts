import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin, requireLeagueStaff } from '@/lib/auth'
import { insertPlayer, updatePlayerById, deletePlayerById } from '@/lib/api/supabase-admin'

export async function POST(req: NextRequest) {
  const canAdmin = await requireAdmin()
  if (!canAdmin.ok) return NextResponse.redirect(new URL('/login', req.url))
  const canLeagueStaff = await requireLeagueStaff()
  if (!canLeagueStaff.ok) return NextResponse.redirect(new URL('/login', req.url))

  const form = await req.formData()
  const op = String(form.get('op') || 'create')

  try {
    if (op === 'create') {
      const gamertag = String(form.get('gamertag') || '').trim()
      const current_team_id = String(form.get('current_team_id') || '') || null
      if (gamertag) await insertPlayer({ gamertag, current_team_id: current_team_id || null })
    } else if (op === 'update') {
      const id = String(form.get('id') || '')
      const gamertag = String(form.get('gamertag') || '').trim()
      const current_team_id = String(form.get('current_team_id') || '') || null
      if (id && gamertag) await updatePlayerById(id, { gamertag, current_team_id: current_team_id || null })
    } else if (op === 'delete') {
      const id = String(form.get('id') || '')
      if (id) await deletePlayerById(id)
    }
  } catch (e) {
    console.error('admin players action error', e)
  }

  // Always return to the listing
  return NextResponse.redirect(new URL('/admin/players', req.url))
}


