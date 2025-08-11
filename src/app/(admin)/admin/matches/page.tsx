import { requireAdmin } from '@/lib/auth'
import { insertMatch, deleteMatchById } from '@/lib/api/supabase-admin'
import { getTeams, getSchedule } from '@/lib/api/public'
import { revalidateTag } from 'next/cache'
import { Card, CardContent } from '@/components/ui/card'

export default async function AdminMatchesPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  const [teams, schedule] = await Promise.all([getTeams(), getSchedule()])

  async function createAction(formData: FormData) {
    'use server'
    const event_id = String(formData.get('event_id') || '')
    const team_a_id = String(formData.get('team_a_id') || '')
    const team_b_id = String(formData.get('team_b_id') || '')
    if (!event_id || !team_a_id || !team_b_id) return
    const team_a = teams.find((t) => t.id === team_a_id)
    const team_b = teams.find((t) => t.id === team_b_id)
    await insertMatch({
      event_id,
      team_a_id,
      team_b_id,
      team_a_name: team_a?.name ?? null,
      team_b_name: team_b?.name ?? null,
    })
    revalidateTag('schedule')
    revalidateTag('rankings')
  }

  async function deleteAction(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    await deleteMatchById(id)
    revalidateTag('schedule')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Matches</h1>
      <Card className="max-w-xl">
        <CardContent>
          <form action={createAction} className="grid gap-2">
            <input name="event_id" placeholder="Event ID" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
            <div className="grid gap-2 sm:grid-cols-2">
              <select name="team_a_id" className="px-2 py-1 rounded-md bg-background border border-input text-sm">
                <option value="">Team A</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <select name="team_b_id" className="px-2 py-1 rounded-md bg-background border border-input text-sm">
                <option value="">Team B</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">Create</button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="font-medium mb-2">Scheduled</div>
          <ul className="space-y-2 text-sm">
            {schedule.map((m) => (
              <li key={m.id} className="flex items-center gap-2">
                <span className="flex-1">{m.id} · {new Date(m.scheduled_at).toLocaleString()}</span>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="h-8 px-2 rounded-md bg-destructive text-destructive-foreground">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}


