import { getPlayerProfile } from '@/lib/api/public'
import { PlayStationProfile } from '@/components/profile/PlayStationProfile'
import { XboxProfile } from '@/components/profile/XboxProfile'

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  const bundle = await getPlayerProfile(params.id)
  if (!bundle.player) return <div>Player not found</div>
  // Basic averages derived from available match data in this mock; can be replaced with player_stats view later
  const averages = { points: 0, assists: 0, rebounds: 0, steals: 0 }
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <PlayStationProfile gamertag={bundle.player.gamertag} username={bundle.player.id} averages={averages} />
        <XboxProfile gamertag={bundle.player.gamertag} username={bundle.player.id} />
      </div>
      <div className="tile p-4 text-sm text-muted-foreground">Role: {bundle.player.role || '—'}</div>
      <div className="tile p-4 text-sm text-muted-foreground">Recent matches: {bundle.matches.length}</div>
    </div>
  )
}


