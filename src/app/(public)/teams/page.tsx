import Link from 'next/link'
import Image from 'next/image'
import { getTeams } from '@/lib/api/public'

export default async function TeamsPage() {
  const teams = await getTeams()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Teams</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((t) => (
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
      </div>
    </div>
  )
}


