"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type PlayerMatchStat = {
  match_id: string
  played_at: string | null
  team_name: string | null
  is_winner: boolean | null
  points: number | null
  assists: number | null
  rebounds: number | null
  steals: number | null
  fgm: number | null
  fga: number | null
  three_points_made: number | null
  three_points_attempted: number | null
}

export default function PlayerMatchHistory({ matches, title = "Recent Matches" }: { matches: PlayerMatchStat[], title?: string }) {
  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">No recent matches.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full table-auto border-collapse border-spacing-px">
              <thead className="text-xs font-bold text-foreground uppercase">
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-start">Date</th>
                  <th className="py-3 px-4 text-start">Team</th>
                  <th className="py-3 px-4 text-center">W/L</th>
                  <th className="py-3 px-4 text-right">PTS</th>
                  <th className="py-3 px-4 text-right">AST</th>
                  <th className="py-3 px-4 text-right">REB</th>
                  <th className="py-3 px-4 text-right">STL</th>
                  <th className="py-3 px-4 text-right">FGM/FGA</th>
                  <th className="py-3 px-4 text-right">3PM/3PA</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {matches.slice(0, 10).map((match) => (
                  <tr key={match.match_id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-muted-foreground">
                      {match.played_at ? new Date(match.played_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {match.team_name || 'Team'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {match.is_winner === null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : match.is_winner ? (
                        <span className="inline-flex items-center rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success">
                          W
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-error/20 px-2 py-1 text-xs font-medium text-error">
                          L
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {match.points ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {match.assists ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {match.rebounds ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {match.steals ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {match.fgm ?? 0}/{match.fga ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {match.three_points_made ?? 0}/{match.three_points_attempted ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
