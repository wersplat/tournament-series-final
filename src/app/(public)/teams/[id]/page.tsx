import { getTeamProfile } from '@/lib/api/public'
import TeamStats1 from '@/components/sports/TeamStats1'
import TeamRoster5 from '@/components/sports/TeamRoster5'
import MatchSchedule6 from '@/components/sports/MatchSchedule6'
import LatestResults5 from '@/components/sports/LatestResults5'


type Params = Promise<{ id: string }>

export default async function TeamProfilePage({ params }: { params: Params }) {
  const { id } = await params
  const bundle = await getTeamProfile(id)
  if (!bundle.team) return <div>Team not found</div>

  return (
    <div className="space-y-6">
      <TeamStats1 teamName={bundle.team.name} region={bundle.team.region ?? undefined} />

      <TeamRoster5
        title="Roster"
        players={bundle.players.map((p: any) => ({
          id: p.id,
          number: undefined,
          position: p.role ?? null,
          firstName: p.gamertag,
          lastName: "",
          img: null,
          status: "active",
        }))}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Results</h2>
          <LatestResults5 
            results={bundle.matches?.slice(0, 5).map((m: any) => ({
              date: new Date(m.played_at || m.scheduled_at).toLocaleDateString(),
              team1: { name: m.team_a_name || 'Team A' },
              team2: { name: m.team_b_name || 'Team B' },
              score: m.status === 'completed' ? `${m.team_a_score || 0} - ${m.team_b_score || 0}` : 'TBD',
              competition: m.status,
            })) || []} 
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Matches</h2>
          <MatchSchedule6 
            matches={bundle.matches?.slice(0, 5).map((m: any) => ({
              id: m.id,
              date: new Date(m.scheduled_at),
              teamA: { name: m.team_a_name || 'Team A' },
              teamB: { name: m.team_b_name || 'Team B' },
              league: m.status,
              timeLabel: new Date(m.scheduled_at).toLocaleTimeString(),
            })) || []} 
          />
        </div>
      </div>
    </div>
  )
}


