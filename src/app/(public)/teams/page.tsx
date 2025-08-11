import Link from 'next/link'
import Image from 'next/image'
import { getTeams } from '@/lib/api/public'
import { Input } from '@/components/ui/input'
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
        <Input name="q" defaultValue={q || ''} placeholder="Search teams…" className="max-w-md" />
      </form>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t) => (
          <Link key={t.id} href={`/teams/${t.id}`} className="tile p-4 focus-ring flex items-center gap-3">
            {t.logo_url ? (
              <Image
                src={t.logo_url}
                alt={`${t.name} logo`}
                width={40}
                height={40}
                className="rounded-md border border-border bg-muted/30 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-md border border-border bg-muted/30" />
            )}
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.region || '—'}</div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">No teams match your search.</div>
        )}
      </div>
    </div>
  )
}


