"use client"
import Image from "next/image"

export default function PlayerCard5({
  gamertag,
  role,
  avatarUrl,
  stats,
  footer,
}: {
  gamertag: string
  role?: string | null
  avatarUrl?: string | null
  stats?: { ppg?: number | null; fgPct?: number | null; threePct?: number | null }
  footer?: { gamesPlayed?: number | null; avgPerformance?: number | null; rankScore?: number | null }
}) {
  return (
    <div className="rounded-3xl border border-custom-gray-200 bg-white overflow-hidden dark:border-custom-gray-600 dark:bg-custom-gray-800">
      {/* Banner */}
      <div className="relative isolate h-40 sm:h-48 md:h-56 bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-600 dark:to-amber-500">
        {/* subtle pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_0%,rgba(255,255,255,.4),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(255,255,255,.3),transparent_35%)]" />

        {/* Avatar */}
        <div className="absolute left-4 top-4">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={gamertag} width={72} height={72} className="rounded-full border border-white/40 shadow-lg object-cover" />
          ) : (
            <div className="h-[72px] w-[72px] rounded-full border border-white/40 bg-white/20" />
          )}
        </div>

        {/* Name + role */}
        <div className="absolute left-28 top-6 pr-28">
          <div className="text-white drop-shadow-sm text-xl sm:text-2xl font-extrabold leading-tight">{gamertag}</div>
          <div className="mt-1 inline-flex items-center rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-bold tracking-widest uppercase text-white/95">
            {role || "—"}
          </div>
        </div>

        {/* Badge title */}
        <div className="absolute right-4 top-6">
          <div className="rounded-full bg-black/60 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1">
            Career total stats
          </div>
        </div>

        {/* Stats pill */}
        {stats ? (
          <div className="absolute right-4 bottom-4 grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-2xl bg-white text-gray-900 shadow-lg dark:divide-gray-700 dark:bg-custom-gray-900 dark:text-white">
            <div className="px-5 py-3 text-center">
              <div className="text-xl font-bold leading-none">{stats.ppg != null ? Number(stats.ppg).toFixed(1) : "—"}</div>
              <div className="mt-1 text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400">PPG</div>
            </div>
            <div className="px-5 py-3 text-center">
              <div className="text-xl font-bold leading-none">{stats.fgPct != null ? `${Math.round(stats.fgPct * 100)}%` : "—"}</div>
              <div className="mt-1 text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400">FG%</div>
            </div>
            <div className="px-5 py-3 text-center">
              <div className="text-xl font-bold leading-none">{stats.threePct != null ? `${Math.round(stats.threePct * 100)}%` : "—"}</div>
              <div className="mt-1 text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400">3P%</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer summary */}
      {footer ? (
        <div className="grid grid-cols-3 gap-2 px-4 py-3 text-center text-[11px]">
          <div>
            <div className="text-base font-semibold leading-none">{footer.gamesPlayed != null ? Number(footer.gamesPlayed) : "—"}</div>
            <div className="mt-1 text-muted-foreground uppercase tracking-wide">Games</div>
          </div>
          <div>
            <div className="text-base font-semibold leading-none">{footer.avgPerformance != null ? Number(footer.avgPerformance).toFixed(2) : "—"}</div>
            <div className="mt-1 text-muted-foreground uppercase tracking-wide">Avg Score</div>
          </div>
          <div>
            <div className="text-base font-semibold leading-none">{footer.rankScore != null ? Number(footer.rankScore).toFixed(2) : "—"}</div>
            <div className="mt-1 text-muted-foreground uppercase tracking-wide">Rank</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}


