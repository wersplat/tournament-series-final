import { getStandings, getTeams } from '@/lib/api/public'
export const revalidate = 60
import Standings5 from '@/components/sports/Standings5'

export default async function StandingsPage() {
  const [standings, teams] = await Promise.all([getStandings(), getTeams()])
  const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name])) as Record<string, string>
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Standings</h1>
      {(['East', 'West'] as const).map((conf) => {
        const rows = standings
          .filter((s) => s.conference === conf)
          .sort((a, b) => b.w - a.w)
          .map((s) => ({
            name: teamName[s.team_id],
            wins: s.w,
            losses: s.l,
            draws: 0,
            points: s.w * 2,
            diff: s.pd ?? 0,
          }))
        return <Standings5 key={conf} title={`${conf} Conference`} rows={rows} />
      })}
    </div>
  )
}


