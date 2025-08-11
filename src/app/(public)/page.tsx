import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSchedule, getMedia, getTeams } from '@/lib/api/public'
import MatchSchedule6 from '@/components/sports/MatchSchedule6'
import TeamCard6 from '@/components/sports/TeamCard6'

export default async function LandingPage() {
  const [schedule, media, teams] = await Promise.all([getSchedule(), getMedia(), getTeams()])
  const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name])) as Record<string, string>
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          2K26 Tournament Series
        </h1>
        <p className="text-muted-foreground">Compete. Rank up. Make history.</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/login">Register / Login</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-6">
            <Link href="/schedule">View Schedule</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Featured Teams</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.slice(0, 8).map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`} className="focus-ring">
              <TeamCard6
                name={team.name}
                region={team.region}
                logoUrl={team.logo_url || undefined}
                stats={{ 
                  wins: (team as any).wins ?? null, 
                  losses: (team as any).losses ?? null, 
                  games: (team as any).games_played ?? null 
                }}
              />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Upcoming Matches</h2>
        <MatchSchedule6 
          matches={schedule.map((m) => ({
            id: m.id,
            date: new Date(m.scheduled_at),
            teamA: { name: m.home_team_name || teamName[m.home_team_id] || m.home_team_id },
            teamB: { name: m.away_team_name || teamName[m.away_team_id] || m.away_team_id },
            league: m.status,
            timeLabel: new Date(m.scheduled_at).toLocaleTimeString(),
          }))} 
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Media</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {media.map((it) => (
            <Card key={it.id}>
              <CardHeader>
                <CardTitle>{it.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{it.type}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}


