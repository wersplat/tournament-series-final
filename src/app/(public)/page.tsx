import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSchedule, getMedia, getTeams } from '@/lib/api/public'

export default async function LandingPage() {
  const [schedule, media, teams] = await Promise.all([getSchedule(), getMedia(), getTeams()])
  const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name])) as Record<string, string>
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Unified Pro-Am: 2K26 Tournament Series
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

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {([
          { href: '/schedule', title: 'Schedule' },
          { href: '/rankings', title: 'Rankings' },
          { href: '/events', title: 'Events' },
          { href: '/teams', title: 'Teams' },
          { href: '/players', title: 'Players' },
          { href: '/standings', title: 'Standings' },
          { href: '/media', title: 'Media' },
        ] as const).map((t) => (
          <Link key={t.href} href={t.href as any} className="tile p-6 focus-ring">
            <div className="text-xl font-semibold">{t.title}</div>
            <div className="text-xs text-muted-foreground">Explore {t.title.toLowerCase()}</div>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Upcoming</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {schedule.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>
                  {(m.home_team_name || teamName[m.home_team_id] || m.home_team_id)} vs {(m.away_team_name || teamName[m.away_team_id] || m.away_team_id)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {new Date(m.scheduled_at).toLocaleString()} — {m.status}
              </CardContent>
            </Card>
          ))}
        </div>
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


