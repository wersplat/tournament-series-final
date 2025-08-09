import Link from 'next/link'
import { getPlayers } from '@/lib/api/public'

export default async function PlayersPage() {
  const players = await getPlayers()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Players</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {players.map((p) => (
          <Link key={p.id} href={`/players/${p.id}`} className="tile p-4 focus-ring">
            <div className="font-medium">{p.gamertag}</div>
            <div className="text-xs text-muted-foreground">{p.role || '—'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


