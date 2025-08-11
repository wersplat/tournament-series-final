import Link from 'next/link'
import { getTeams } from '@/lib/api/public'
import { Input } from '@/components/ui/input'
import TeamCard6 from '@/components/sports/TeamCard6'
export const revalidate = 300

export default async function TeamsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const teams = await getTeams()
  const query = (q || '').toLowerCase().trim()
  const filtered = query
    ? teams.filter((t) => [t.name, (t.region || '')].some((v) => String(v).toLowerCase().includes(query)))
    : teams
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Teams</h1>
      <form action="" className="flex gap-2">
        <div className="flex-1 max-w-md">
          <label htmlFor="team-search" className="sr-only">
            Search teams
          </label>
          <Input 
            id="team-search"
            name="q" 
            defaultValue={q || ''} 
            placeholder="Search teams…" 
            className="w-full"
            aria-describedby="team-search-help"
          />
          <p id="team-search-help" className="sr-only">
            Enter team name or region to filter the list
          </p>
        </div>
      </form>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t) => (
          <Link key={t.id} href={`/teams/${t.id}`} className="focus-ring block">
            <TeamCard6
              name={t.name}
              region={t.region}
              logoUrl={t.logo_url || String(t.logo_url)}
              stats={{ wins: (t as any).wins ?? null, losses: (t as any).losses ?? null, games: (t as any).games_played ?? null }}
            />
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">No teams match your search.</div>
        )}
      </div>
    </div>
  )
}


