import PlayerStats5 from '@/components/sports/PlayerStats5'
import PlayerMatchHistory from '@/components/sports/PlayerMatchHistory'
import { getPlayerProfile } from '@/lib/api/public'
import { PlayStationProfile } from '@/components/profile/PlayStationProfile'
import { XboxProfile } from '@/components/profile/XboxProfile'

type Params = Promise<{ id: string }>

export default async function PlayerProfilePage({ params }: { params: Params }) {
  const { id } = await params
  const bundle = await getPlayerProfile(id)
  if (!bundle.player) return <div>Player not found</div>
  const averages = bundle.performance
    ? {
        points: Number(bundle.performance.avg_points ?? 0),
        assists: Number(bundle.performance.avg_assists ?? 0),
        rebounds: Number(bundle.performance.avg_rebounds ?? 0),
        steals: Number(bundle.performance.avg_steals ?? 0),
      }
    : { points: 0, assists: 0, rebounds: 0, steals: 0 }
  const statRows = [
    { label: 'PTS', value: averages.points },
    { label: 'AST', value: averages.assists },
    { label: 'REB', value: averages.rebounds },
    { label: 'STL', value: averages.steals },
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <PlayStationProfile gamertag={bundle.player.gamertag} username={bundle.player.id} averages={averages} />
        <XboxProfile gamertag={bundle.player.gamertag} username={bundle.player.id} />
      </div>
      <PlayerStats5 stats={statRows} />
      <PlayerMatchHistory matches={(bundle as any).pastMatches || []} />
    </div>
  )
}


