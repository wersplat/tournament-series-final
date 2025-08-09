import { requireAdmin } from '@/lib/auth'
import { insertTeam, deleteTeamById, updateTeamById } from '@/lib/api/supabase-admin'
import { getTeams } from '@/lib/api/public'

export default async function AdminTeamsPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  const teams = await getTeams()

  async function createAction(formData: FormData) {
    'use server'
    const name = String(formData.get('name') || '').trim()
    const logo_url = String(formData.get('logo_url') || '').trim() || null
    if (!name) return
    await insertTeam({ name, logo_url })
  }

  async function deleteAction(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    await deleteTeamById(id)
  }

  async function updateAction(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    const name = String(formData.get('name') || '').trim()
    const logo_url = String(formData.get('logo_url') || '').trim() || null
    if (!id || !name) return
    await updateTeamById(id, { name, logo_url })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Teams</h1>
      <form action={createAction} className="tile p-4 grid gap-2 max-w-md">
        <input name="name" placeholder="Team name" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
        <input name="logo_url" placeholder="Logo URL" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
        <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">Create</button>
      </form>
      <div className="tile p-4">
        <div className="font-medium mb-2">Existing Teams</div>
        <ul className="space-y-2">
          {teams.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <span className="flex-1">{t.name}</span>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={t.id} />
                <button className="h-8 px-2 rounded-md bg-destructive text-destructive-foreground">Delete</button>
              </form>
              <form action={updateAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={t.id} />
                <input name="name" defaultValue={t.name} className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
                <input name="logo_url" defaultValue={t.logo_url ?? ''} className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
                <button className="h-8 px-2 rounded-md bg-secondary text-secondary-foreground">Update</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


