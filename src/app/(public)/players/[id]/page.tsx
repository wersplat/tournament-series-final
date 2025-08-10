      import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table'
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
          <Table>
            <Thead>
              <Tr>
                <Th className="w-28">Date</Th>
                <Th>Team</Th>
                <Th className="w-16 text-center">W/L</Th>
                <Th className="w-16 text-right">PTS</Th>
                <Th className="w-16 text-right">AST</Th>
                <Th className="w-16 text-right">REB</Th>
                <Th className="w-16 text-right">STL</Th>
                <Th className="w-20 text-right">FGM/FGA</Th>
                <Th className="w-20 text-right">3PM/3PA</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(bundle as any).pastMatches.slice(0, 10).map((m: any) => (
                <Tr key={m.match_id}>
                  <Td className="text-muted-foreground">{m.played_at ? new Date(m.played_at).toLocaleDateString() : ''}</Td>
                  <Td>{m.team_name || 'Team'}</Td>
                  <Td className="text-center">{m.is_winner === null ? '—' : m.is_winner ? 'W' : 'L'}</Td>
                  <Td className="text-right">{m.points ?? 0}</Td>
                  <Td className="text-right">{m.assists ?? 0}</Td>
                  <Td className="text-right">{m.rebounds ?? 0}</Td>
                  <Td className="text-right">{m.steals ?? 0}</Td>
                  <Td className="text-right">{m.fgm ?? 0}/{m.fga ?? 0}</Td>
                  <Td className="text-right">{m.three_points_made ?? 0}/{m.three_points_attempted ?? 0}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <div className="text-sm text-muted-foreground">No recent matches.</div>
        )}
      </div>
    </div>
  )
}


