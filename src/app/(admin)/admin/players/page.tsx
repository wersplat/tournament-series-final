import { requireAdmin } from '@/lib/auth'
// CRUD handled by route handler at /admin/players/actions to avoid Server Action key mismatches
import { getPlayers, getTeams } from '@/lib/api/public'
import { Card, CardContent } from '@/components/ui/card'

export default async function AdminPlayersPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  const [players, teams] = await Promise.all([getPlayers(), getTeams()])
  const teamName: Record<string, string> = Object.fromEntries(teams.map((t) => [t.id, t.name]))

  // Route-handler backed forms to avoid Server Action key mismatches across deployments
  const createAction = '/admin/players/actions'

  const deleteAction = '/admin/players/actions'

  const updateAction = '/admin/players/actions'

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Players</h1>
      <Card className="max-w-md">
        <CardContent>
          <form action={createAction} method="post" className="grid gap-2">
            <input type="hidden" name="op" value="create" />
            <input name="gamertag" placeholder="Gamertag" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
            <select name="current_team_id" className="px-2 py-1 rounded-md bg-background border border-input text-sm">
              <option value="">No team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">Create</button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="font-medium mb-2">Existing Players</div>
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span className="flex-1">{p.gamertag} {p.current_team_id ? `· ${teamName[p.current_team_id] ?? p.current_team_id}` : ''}</span>
                <form action={deleteAction} method="post">
                  <input type="hidden" name="op" value="delete" />
                  <input type="hidden" name="id" value={p.id} />
                  <button className="h-8 px-2 rounded-md bg-destructive text-destructive-foreground">Delete</button>
                </form>
                <form action={updateAction} method="post" className="flex items-center gap-2">
                  <input type="hidden" name="op" value="update" />
                  <input type="hidden" name="id" value={p.id} />
                  <input name="gamertag" defaultValue={p.gamertag} className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
                  <select name="current_team_id" defaultValue={p.current_team_id ?? ''} className="px-2 py-1 rounded-md bg-background border border-input text-sm">
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
        </CardContent>
      </Card>
    </div>
  )
}


