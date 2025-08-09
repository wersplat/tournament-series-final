import { getTeamProfile } from '@/lib/api/public'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function TeamProfilePage({ params }: { params: { id: string } }) {
  const bundle = await getTeamProfile(params.id)
  if (!bundle.team) return <div>Team not found</div>
  const supabase = createServerSupabase()
  const { data: pastMatches } = await supabase
    .from('matches')
    .select('id, scheduled_at, team_a_id, team_b_id, team_a_name, team_b_name, score_a, score_b, winner_id, played_at')
    .or(`team_a_id.eq.${params.id},team_b_id.eq.${params.id}`)
    .order('played_at', { ascending: false })
    .limit(10)
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
            <ul className="text-sm text-muted-foreground grid sm:grid-cols-2 gap-2">
              {bundle.matches.map((m) => (
                <li key={m.id}>
                  {new Date(m.scheduled_at).toLocaleString()} — {m.home_team_name || 'Team A'} vs {m.away_team_name || 'Team B'}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="stats">Stats coming soon.</TabsContent>
        <TabsContent value="history" className="space-y-3">
          <div className="tile p-4">
            <div className="font-medium mb-2">Past Match Results</div>
            <ul className="text-sm text-muted-foreground grid sm:grid-cols-2 gap-2">
              {(pastMatches || []).filter((m: any) => m.played_at).map((m: any) => (
                <li key={m.id}>
                  {new Date(m.played_at).toLocaleString()} — {m.team_a_name || 'Team A'} vs {m.team_b_name || 'Team B'} — {m.score_a ?? 0}:{m.score_b ?? 0} {m.winner_id ? `(W: ${m.winner_id === params.id ? 'This Team' : 'Opponent'})` : ''}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="media">Media coming soon.</TabsContent>
      </Tabs>
    </div>
  )
}


