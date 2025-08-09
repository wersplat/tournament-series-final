import { requireAdmin } from '@/lib/auth'
import { insertPlayer, deletePlayerById, updatePlayerById } from '@/lib/api/supabase-admin'
import { getPlayers, getTeams } from '@/lib/api/public'

export default async function AdminPlayersPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  const [players, teams] = await Promise.all([getPlayers(), getTeams()])
  const teamName: Record<string, string> = Object.fromEntries(teams.map((t) => [t.id, t.name]))

  async function createAction(formData: FormData) {
    'use server'
    const gamertag = String(formData.get('gamertag') || '').trim()
    const team_id = String(formData.get('team_id') || '') || null
    if (!gamertag) return
    await insertPlayer({ gamertag, team_id: team_id || null })
  }

  async function deleteAction(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    await deletePlayerById(id)
  }

  async function updateAction(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    const gamertag = String(formData.get('gamertag') || '').trim()
    const team_id = String(formData.get('team_id') || '') || null
    if (!id || !gamertag) return
    await updatePlayerById(id, { gamertag, team_id: team_id || null })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Players</h1>
      <form action={createAction} className="tile p-4 grid gap-2 max-w-md">
        <input name="gamertag" placeholder="Gamertag" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
        <select name="team_id" className="px-2 py-1 rounded-md bg-background border border-input text-sm">
          <option value="">No team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">Create</button>
      </form>
      <div className="tile p-4">
        <div className="font-medium mb-2">Existing Players</div>
        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="flex-1">{p.gamertag} {p.team_id ? `· ${teamName[p.team_id] ?? p.team_id}` : ''}</span>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={p.id} />
                <button className="h-8 px-2 rounded-md bg-destructive text-destructive-foreground">Delete</button>
              </form>
              <form action={updateAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={p.id} />
                <input name="gamertag" defaultValue={p.gamertag} className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
                <select name="team_id" defaultValue={p.team_id ?? ''} className="px-2 py-1 rounded-md bg-background border border-input text-sm">
                  <option value="">No team</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button className="h-8 px-2 rounded-md bg-secondary text-secondary-foreground">Update</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


