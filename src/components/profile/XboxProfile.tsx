import Image from 'next/image'

interface Props {
  gamertag: string
  username?: string | null
  avatarUrl?: string | null
  rewardsPoints?: number
  goalTitle?: string
  goalProgressPct?: number // 0..100
  friends?: number
  following?: number
  followers?: number
}

export function XboxProfile({
  gamertag,
  username,
  avatarUrl,
  rewardsPoints = 0,
  goalTitle = 'My goal',
  goalProgressPct = 0,
  friends = 0,
  following = 0,
  followers = 0,
}: Props) {
  return (
    <div className="rounded-2xl bg-[#0B0D0F] border border-border/50 p-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={gamertag} width={64} height={64} className="rounded-full border border-white/10 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5" />
          )}
          <div>
            <div className="text-xl font-bold">{gamertag}</div>
            {username ? <div className="text-xs text-white/60">{username}</div> : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">Rewards points</div>
          <div className="text-lg font-semibold">{Intl.NumberFormat().format(rewardsPoints)}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-6 text-xs text-white/70">
        <div><span className="font-semibold text-white">{friends}</span> Friends</div>
        <div><span className="font-semibold text-white">{following}</span> Following</div>
        <div><span className="font-semibold text-white">{followers}</span> Followers</div>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">{goalTitle}</div>
          <div className="text-white/70">{Math.round(goalProgressPct)}%</div>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-[#22C55E]" style={{ width: `${Math.max(0, Math.min(100, goalProgressPct))}%` }} />
        </div>
      </div>
    </div>
  )
}


