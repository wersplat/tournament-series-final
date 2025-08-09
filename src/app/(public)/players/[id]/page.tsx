import { getPlayerProfile } from '@/lib/api/public'

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  const bundle = await getPlayerProfile(params.id)
  if (!bundle.player) return <div>Player not found</div>
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{bundle.player.gamertag}</h1>
      <div className="tile p-4 text-sm text-muted-foreground">Role: {bundle.player.role || '—'}</div>
      <div className="tile p-4 text-sm text-muted-foreground">Recent matches: {bundle.matches.length}</div>
    </div>
  )
}


