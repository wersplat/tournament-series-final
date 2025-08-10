import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { insertPlayer, updatePlayerById, deletePlayerById } from '@/lib/api/supabase-admin'

export async function POST(req: NextRequest) {
  const can = await requireAdmin()
  if (!can.ok) return NextResponse.redirect(new URL('/login', req.url))

  const form = await req.formData()
  const op = String(form.get('op') || 'create')

  try {
    if (op === 'create') {
      const gamertag = String(form.get('gamertag') || '').trim()
      const team_id = String(form.get('team_id') || '') || null
      if (gamertag) await insertPlayer({ gamertag, team_id: team_id || null })
    } else if (op === 'update') {
      const id = String(form.get('id') || '')
      const gamertag = String(form.get('gamertag') || '').trim()
      const team_id = String(form.get('team_id') || '') || null
      if (id && gamertag) await updatePlayerById(id, { gamertag, team_id: team_id || null })
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


