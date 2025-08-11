import PlayerStats5 from '@/components/sports/PlayerStats5'
import PlayerMatchHistory from '@/components/sports/PlayerMatchHistory'
import MatchSchedule6 from '@/components/sports/MatchSchedule6'
import PlayerProfile from '@/components/sports/PlayerProfile'
import { getPlayerProfile } from '@/lib/api/public'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="space-y-6">
      {/* Hero Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{bundle.player.gamertag}</h1>
            <p className="text-muted-foreground">
              {bundle.player.role ? `${bundle.player.role} • ` : ''}
              {bundle.performance?.games_played || 0} games played
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Avg: {averages.points.toFixed(1)} PTS</span>
              <span>•</span>
              <span>{averages.assists.toFixed(1)} AST</span>
              <span>•</span>
              <span>{averages.rebounds.toFixed(1)} REB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Profile */}
      <PlayerProfile 
        gamertag={bundle.player.gamertag} 
        username={bundle.player.id} 
        averages={averages} 
      />

      {/* Stats and Schedule */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PlayerStats5 stats={statRows} />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Matches</h2>
          <MatchSchedule6 
            matches={bundle.matches.slice(0, 5).map((m: any) => ({
              id: m.id,
              date: new Date(m.scheduled_at),
              teamA: { name: m.home_team_name || 'Home Team' },
              teamB: { name: m.away_team_name || 'Away Team' },
              league: m.status,
              timeLabel: new Date(m.scheduled_at).toLocaleTimeString(),
            }))} 
          />
        </div>
      </div>

      {/* Recent Match History */}
      <PlayerMatchHistory matches={(bundle as any).pastMatches || []} />
    </div>
  )
}


