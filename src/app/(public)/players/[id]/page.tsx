import { getPlayerProfile } from '@/lib/api/public'
import { PlayStationProfile } from '@/components/profile/PlayStationProfile'
import { XboxProfile } from '@/components/profile/XboxProfile'

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  const bundle = await getPlayerProfile(params.id)
  if (!bundle.player) return <div>Player not found</div>
  const averages = bundle.performance
    ? {
        points: Number(bundle.performance.avg_points ?? 0),
        assists: Number(bundle.performance.avg_assists ?? 0),
        rebounds: Number(bundle.performance.avg_rebounds ?? 0),
        steals: Number(bundle.performance.avg_steals ?? 0),
      }
    : { points: 0, assists: 0, rebounds: 0, steals: 0 }
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <PlayStationProfile gamertag={bundle.player.gamertag} username={bundle.player.id} averages={averages} />
        <XboxProfile gamertag={bundle.player.gamertag} username={bundle.player.id} />
      </div>
      <div className="tile p-4 text-sm text-muted-foreground">Role: {bundle.player.role || '—'}</div>
      <div className="tile p-4">
        <div className="font-medium mb-2">Recent matches</div>
        {Array.isArray((bundle as any).pastMatches) && (bundle as any).pastMatches.length > 0 ? (
          <ul className="text-sm text-muted-foreground grid sm:grid-cols-2 gap-2">
            {(bundle as any).pastMatches.slice(0, 6).map((m: any) => (
              <li key={m.match_id} className="flex items-center justify-between gap-2">
                <span>
                  {m.played_at ? new Date(m.played_at).toLocaleDateString() : ''} — {m.team_a_name || 'Team A'} vs {m.team_b_name || 'Team B'}
                </span>
                <span className="text-foreground/90 font-medium">
                  {m.score_a ?? 0}:{m.score_b ?? 0}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  PTS {m.points ?? 0} · AST {m.assists ?? 0} · REB {m.rebounds ?? 0} · STL {m.steals ?? 0}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">No recent matches.</div>
        )}
      </div>
    </div>
  )
}


