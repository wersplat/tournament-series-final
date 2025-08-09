import Link from 'next/link'
import { getTeams } from '@/lib/api/public'

export default async function TeamsPage() {
  const teams = await getTeams()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Teams</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((t) => (
          <Link key={t.id} href={`/teams/${t.id}`} className="tile p-4 focus-ring">
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.region || '—'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


