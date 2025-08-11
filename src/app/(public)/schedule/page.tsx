import { getSchedule, getTeams } from '@/lib/api/public'
import MatchSchedule6 from '@/components/sports/MatchSchedule6'
export const revalidate = 60

export default async function SchedulePage() {
  const [schedule, teams] = await Promise.all([getSchedule(), getTeams()])
  const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name])) as Record<string, string>
  const cards = schedule.map((m) => ({
    id: m.id,
    date: new Date(m.scheduled_at),
    teamA: { name: m.home_team_name || teamName[m.home_team_id] || m.home_team_id },
    teamB: { name: m.away_team_name || teamName[m.away_team_id] || m.away_team_id },
    league: '',
    timeLabel: new Date(m.scheduled_at).toLocaleTimeString(),
  }))
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Schedule</h1>
      <MatchSchedule6 matches={cards} />
    </div>
  )
}


