import Image from 'next/image'

interface Props {
  gamertag: string
  username?: string | null
  avatarUrl?: string | null
  averages?: { points: number; assists: number; rebounds: number; steals: number }
  starsLevel?: number
  starsPoints?: number
}

export function PlayStationProfile({ gamertag, username, avatarUrl, averages, starsLevel = 1, starsPoints = 0 }: Props) {
  const avg = averages || { points: 0, assists: 0, rebounds: 0, steals: 0 }
  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={gamertag} width={72} height={72} className="rounded-full border border-white/10 object-cover" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full border border-white/10 bg-white/5" />
        )}
        <div>
          <div className="text-2xl font-extrabold">{gamertag}</div>
          {username ? <div className="text-sm text-muted-foreground">{username}</div> : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-secondary p-4">
          <div className="text-xs text-muted-foreground">PTS</div>
          <div className="text-lg font-semibold">{avg.points.toFixed(1)}</div>
        </div>
        <div className="rounded-xl bg-secondary p-4">
          <div className="text-xs text-muted-foreground">AST</div>
          <div className="text-lg font-semibold">{avg.assists.toFixed(1)}</div>
        </div>
        <div className="rounded-xl bg-secondary p-4">
          <div className="text-xs text-muted-foreground">REB</div>
          <div className="text-lg font-semibold">{avg.rebounds.toFixed(1)}</div>
        </div>
        <div className="rounded-xl bg-secondary p-4">
          <div className="text-xs text-muted-foreground">STL</div>
          <div className="text-lg font-semibold">{avg.steals.toFixed(1)}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-secondary p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">Level {starsLevel}</div>
          <div className="text-muted-foreground">{Intl.NumberFormat().format(starsPoints)} Points</div>
        </div>
        <div className="mt-2 h-2 rounded-full bg-border">
          <div className="h-2 rounded-full bg-primary" style={{ width: '40%' }} />
        </div>
      </div>
    </div>
  )
}


