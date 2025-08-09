import { DataTable } from '@/components/core/DataTable'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function RankingsPage() {
  const supabase = createServerSupabase()
  const { data } = await supabase
    .from('player_performance_view')
    .select('gamertag, team_name, avg_points, avg_assists, avg_rebounds, avg_steals, avg_performance_score')
    .order('avg_performance_score', { ascending: false })
    .limit(100)
  const rows = (data || []).map((p: any) => ({
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


