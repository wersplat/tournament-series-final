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
    <div className="rounded-2xl bg-card border border-border/50 p-5 text-foreground">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={gamertag} width={72} height={72} className="rounded-full border border-white/10 object-cover" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full border border-white/10 bg-white/5" />
        )}
        <div>
          <div className="text-2xl font-extrabold text-foreground">{gamertag}</div>
          {username ? <div className="text-sm text-foreground/80">{username}</div> : null}
        </div>
      </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-secondary p-4 text-foreground">
            <div className="text-xs text-foreground/70">PTS</div>
            <div className="text-lg font-semibold text-foreground">{avg.points.toFixed(1)}</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-foreground">
            <div className="text-xs text-foreground/70">AST</div>
            <div className="text-lg font-semibold text-foreground">{avg.assists.toFixed(1)}</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-foreground">
            <div className="text-xs text-foreground/70">REB</div>
            <div className="text-lg font-semibold text-foreground">{avg.rebounds.toFixed(1)}</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-foreground">
            <div className="text-xs text-foreground/70">STL</div>
            <div className="text-lg font-semibold text-foreground">{avg.steals.toFixed(1)}</div>
          </div>
      </div>

      <div className="mt-4 rounded-xl bg-secondary p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">Level {starsLevel}</div>
          <div className="text-muted-foreground">{Intl.NumberFormat().format(starsPoints)} Points</div>
        </div>
        <div className="mt-2 h-2 rounded-full bg-border" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} aria-label={`Level ${starsLevel} progress`}>
          <div className="h-2 rounded-full bg-primary" style={{ width: '40%' }} />
        </div>
        <p className="sr-only">Level {starsLevel} progress: 40% complete</p>
      </div>
    </div>
  )
}


