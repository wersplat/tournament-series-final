import { getTeamProfile } from '@/lib/api/public'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table'

export default async function TeamProfilePage({ params }: { params: { id: string } }) {
  const bundle = await getTeamProfile(params.id)
  if (!bundle.team) return <div>Team not found</div>
  const pastMatches = (bundle as any).pastMatches || []
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {bundle.team.logo_url ? (
            <Image
              src={bundle.team.logo_url}
              alt={`${bundle.team.name} logo`}
              width={56}
              height={56}
              className="rounded-md border border-border bg-muted/30 object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-md border border-border bg-muted/30" />
          )}
          <h1 className="text-2xl font-semibold">{bundle.team.name}</h1>
        </div>
        {bundle.team.region ? (
          <div className="text-xs text-muted-foreground">{bundle.team.region}</div>
        ) : null}
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-3">
          <div className="tile p-4">
            <div className="font-medium mb-2">Roster</div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {bundle.players.map((p) => (
                <li key={p.id} className="text-sm text-muted-foreground">
                  {p.gamertag} {p.role ? `· ${p.role}` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="tile p-4">
            <div className="font-medium mb-2">Recent Matches</div>
            {Array.isArray((bundle as any).recentStats) && (bundle as any).recentStats.length > 0 ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th className="w-36">Date</Th>
                    <Th>Opponent</Th>
                    <Th className="w-16 text-center">Home</Th>
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
                  {(bundle as any).recentStats.slice(0, 10).map((r: any) => (
                    <Tr key={r.match_id}>
                      <Td className="text-muted-foreground">{r.played_at ? new Date(r.played_at).toLocaleDateString() : ''}</Td>
                      <Td>{r.opponent_name || 'Opponent'}</Td>
                      <Td className="text-center">{r.is_home === null ? '—' : r.is_home ? 'H' : 'A'}</Td>
                      <Td className="text-center">{r.is_winner === null ? '—' : r.is_winner ? 'W' : 'L'}</Td>
                      <Td className="text-right">{r.points ?? 0}</Td>
                      <Td className="text-right">{r.assists ?? 0}</Td>
                      <Td className="text-right">{r.rebounds ?? 0}</Td>
                      <Td className="text-right">{r.steals ?? 0}</Td>
                      <Td className="text-right">{r.fgm ?? 0}/{r.fga ?? 0}</Td>
                      <Td className="text-right">{r.three_points_made ?? 0}/{r.three_points_attempted ?? 0}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <div className="text-sm text-muted-foreground">No recent matches.</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="stats" className="space-y-3">
          <div className="tile p-4">
            <div className="font-medium mb-2">Recent Team Stats</div>
            {Array.isArray((bundle as any).recentStats) && (bundle as any).recentStats.length > 0 ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th className="w-36">Date</Th>
                    <Th>Opponent</Th>
                    <Th className="w-16 text-center">Home</Th>
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
                  {(bundle as any).recentStats.slice(0, 10).map((r: any) => (
                    <Tr key={r.match_id}>
                      <Td className="text-muted-foreground">{r.played_at ? new Date(r.played_at).toLocaleDateString() : ''}</Td>
                      <Td>{r.opponent_name || 'Opponent'}</Td>
                      <Td className="text-center">{r.is_home === null ? '—' : r.is_home ? 'H' : 'A'}</Td>
                      <Td className="text-center">{r.is_winner === null ? '—' : r.is_winner ? 'W' : 'L'}</Td>
                      <Td className="text-right">{r.points ?? 0}</Td>
                      <Td className="text-right">{r.assists ?? 0}</Td>
                      <Td className="text-right">{r.rebounds ?? 0}</Td>
                      <Td className="text-right">{r.steals ?? 0}</Td>
                      <Td className="text-right">{r.fgm ?? 0}/{r.fga ?? 0}</Td>
                      <Td className="text-right">{r.three_points_made ?? 0}/{r.three_points_attempted ?? 0}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <div className="text-sm text-muted-foreground">No team stats yet.</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-3">
          <div className="tile p-4">
            <div className="font-medium mb-2">Past Match Results</div>
            {pastMatches.length > 0 ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th className="w-36">Date</Th>
                    <Th>Match</Th>
                    <Th className="w-16 text-right">Score</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pastMatches.filter((m: any) => m.played_at).slice(0, 10).map((m: any) => (
                    <Tr key={m.id}>
                      <Td className="text-muted-foreground">{new Date(m.played_at).toLocaleString()}</Td>
                      <Td>{m.team_a_name || 'Team A'} vs {m.team_b_name || 'Team B'}</Td>
                      <Td className="text-right">{m.score_a ?? 0}:{m.score_b ?? 0}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <div className="text-sm text-muted-foreground">No past matches.</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="media">Media coming soon.</TabsContent>
      </Tabs>
    </div>
  )
}


