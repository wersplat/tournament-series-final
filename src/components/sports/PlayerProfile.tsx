"use client"
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  gamertag: string
  username?: string | null
  avatarUrl?: string | null
  averages?: { points: number; assists: number; rebounds: number; steals: number }
  starsLevel?: number
  starsPoints?: number
}

export function PlayerProfile({ gamertag, username, avatarUrl, averages, starsLevel = 1, starsPoints = 0 }: Props) {
  const avg = averages || { points: 0, assists: 0, rebounds: 0, steals: 0 }
  
  return (
    <Card className="overflow-hidden">
      <div className="relative isolate overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-6">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={`${gamertag} avatar`} 
              width={72} 
              height={72} 
              className="rounded-full border-2 border-white/20 object-cover shadow-lg" 
            />
          ) : (
            <div className="h-[72px] w-[72px] rounded-full border-2 border-white/20 bg-white/10 shadow-lg" />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-foreground">{gamertag}</h2>
            {username && (
              <p className="text-sm text-muted-foreground">@{username}</p>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Performance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-secondary/10 p-4 text-center">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">PTS</div>
            <div className="text-lg font-bold text-foreground">{avg.points.toFixed(1)}</div>
          </div>
          <div className="rounded-xl bg-secondary/10 p-4 text-center">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AST</div>
            <div className="text-lg font-bold text-foreground">{avg.assists.toFixed(1)}</div>
          </div>
          <div className="rounded-xl bg-secondary/10 p-4 text-center">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">REB</div>
            <div className="text-lg font-bold text-foreground">{avg.rebounds.toFixed(1)}</div>
          </div>
          <div className="rounded-xl bg-secondary/10 p-4 text-center">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">STL</div>
            <div className="text-lg font-bold text-foreground">{avg.steals.toFixed(1)}</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="font-semibold">Level {starsLevel}</div>
            <div className="text-muted-foreground">{Intl.NumberFormat().format(starsPoints)} Points</div>
          </div>
          <div 
            className="h-2 rounded-full bg-border overflow-hidden" 
            role="progressbar" 
            aria-valuenow={40} 
            aria-valuemin={0} 
            aria-valuemax={100} 
            aria-label={`Level ${starsLevel} progress`}
          >
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300" 
              style={{ width: '40%' }} 
            />
          </div>
          <p className="sr-only">Level {starsLevel} progress: 40% complete</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PlayerProfile
