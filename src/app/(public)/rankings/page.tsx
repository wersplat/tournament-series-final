import { DataTable } from '@/components/core/DataTable'
import { getStandings, getTeams } from '@/lib/api/public'

export default async function RankingsPage() {
  const [standings, teams] = await Promise.all([getStandings(), getTeams()])
  const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name])) as Record<string, string>
  const rows = standings.map((s) => ({ Team: teamName[s.team_id], Conference: s.conference, W: s.w, L: s.l, PD: s.pd ?? 0 }))
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Rankings</h1>
      <DataTable data={rows} columns={[{ key: 'Team', header: 'Team' }, { key: 'Conference', header: 'Conf' }, { key: 'W', header: 'W' }, { key: 'L', header: 'L' }, { key: 'PD', header: 'PD' }]} />
    </div>
  )
}


