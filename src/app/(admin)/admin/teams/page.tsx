import { requireAdmin } from '@/lib/auth'
// CRUD handled by /admin/teams/actions
import { getTeams } from '@/lib/api/public'
import { Card, CardContent } from '@/components/ui/card'

export default async function AdminTeamsPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  const teams = await getTeams()

  const createAction = '/admin/teams/actions'

  const deleteAction = '/admin/teams/actions'

  const updateAction = '/admin/teams/actions'

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Teams</h1>
      <Card className="max-w-md">
        <CardContent>
          <form action={createAction} method="post" className="grid gap-2">
            <input type="hidden" name="op" value="create" />
            <input name="name" placeholder="Team name" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
            <input name="logo_url" placeholder="Logo URL" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
            <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">Create</button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="font-medium mb-2">Existing Teams</div>
          <ul className="space-y-2">
            {teams.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <span className="flex-1">{t.name}</span>
                <form action={deleteAction} method="post">
                  <input type="hidden" name="op" value="delete" />
                  <input type="hidden" name="id" value={t.id} />
                  <button className="h-8 px-2 rounded-md bg-destructive text-destructive-foreground">Delete</button>
                </form>
                <form action={updateAction} method="post" className="flex items-center gap-2">
                  <input type="hidden" name="op" value="update" />
                  <input type="hidden" name="id" value={t.id} />
                  <input name="name" defaultValue={t.name} className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
                  <input name="logo_url" defaultValue={t.logo_url ?? ''} className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
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


