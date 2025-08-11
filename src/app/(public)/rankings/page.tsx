import { DataTable } from '@/components/core/DataTable'
import { apiFetch } from '@/lib/api'
export const revalidate = 60

export default async function RankingsPage() {
  const res = await apiFetch('/api/views/player-performance?limit=100', {}, { tags: ['rankings'], revalidate: 60 })
  if (!res.ok) throw new Error('Failed to load rankings')
  const json = await res.json()
  const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
  const rows = (list || []).map((p: any) => ({
    Player: p.gamertag,
    Team: p.team_name ?? '—',
    PTS: Number(p.avg_points ?? 0).toFixed(1),
    AST: Number(p.avg_assists ?? 0).toFixed(1),
    REB: Number(p.avg_rebounds ?? 0).toFixed(1),
    STL: Number(p.avg_steals ?? 0).toFixed(1),
    Score: Number(p.avg_performance_score ?? 0).toFixed(2),
  }))
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Player Rankings</h1>
      <DataTable
        data={rows}
        columns={[
          { key: 'Player', header: 'Player' },
          { key: 'Team', header: 'Team' },
          { key: 'PTS', header: 'PTS' },
          { key: 'AST', header: 'AST' },
          { key: 'REB', header: 'REB' },
          { key: 'STL', header: 'STL' },
          { key: 'Score', header: 'Score' },
        ]}
      />
    </div>
  )
}


