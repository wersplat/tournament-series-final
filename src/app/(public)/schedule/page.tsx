import { getSchedule } from '@/lib/api/public'

export default async function SchedulePage() {
  const schedule = await getSchedule()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Schedule</h1>
      <div className="tile p-4">
        <ul className="text-sm text-muted-foreground grid md:grid-cols-2 gap-2">
          {schedule.map((m) => (
            <li key={m.id}>
              {new Date(m.scheduled_at).toLocaleString()} — {m.home_team_id} vs {m.away_team_id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


