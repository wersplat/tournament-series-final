import Link from 'next/link'
import { getPlayers } from '@/lib/api/public'
import { Input } from '@/components/ui/input'
import PlayerCard5 from '@/components/sports/PlayerCard5'
export const revalidate = 120

export default async function PlayersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const players = await getPlayers()
  const query = (q || '').toLowerCase().trim()
  const filtered = query
    ? players.filter((p) =>
        [p.gamertag, (p.role || ''), (p.id || '')].some((v) => String(v).toLowerCase().includes(query)),
      )
    : players
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Players</h1>
      <form action="" className="flex gap-2">
        <Input name="q" defaultValue={q || ''} placeholder="Search players…" className="max-w-md" />
      </form>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <Link key={p.id} href={`/players/${p.id}`} className="focus-ring block">
            <PlayerCard5
              gamertag={p.gamertag}
              role={p.role}
              avatarUrl={p.avatar_url || undefined}
              stats={{
                ppg: (p as any).avg_points ?? null,
                fgPct: (p as any).field_goal_pct ?? null,
                threePct: (p as any).three_point_pct ?? null,
              }}
              footer={{
                gamesPlayed: (p as any).games_played ?? null,
                avgPerformance: (p as any).avg_performance_score ?? null,
                rankScore: (p as any).player_rank_score ?? null,
              }}
            />
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">No players match your search.</div>
        )}
      </div>
    </div>
  )
}


