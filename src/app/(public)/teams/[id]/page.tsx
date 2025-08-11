import { getTeamProfile } from '@/lib/api/public'
import TeamStats1 from '@/components/sports/TeamStats1'
import TeamRoster5 from '@/components/sports/TeamRoster5'
import MatchSchedule1 from '@/components/sports/MatchSchedule1'

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

      <MatchSchedule1 />
    </div>
  )
}


