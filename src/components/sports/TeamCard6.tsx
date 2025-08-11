"use client"
import Image from "next/image"
import { Card } from "@/components/ui/card"

type TeamStats = {
  wins?: number | null
  losses?: number | null
  games?: number | null
}

export function TeamCard6({
  name,
  region,
  logoUrl,
  stats,
}: {
  name: string
  region?: string | null
  logoUrl?: string | null
  stats?: TeamStats
}) {
  const statistics = [
    { label: "Wins", value: stats?.wins ?? "—" },
    { label: "Losses", value: stats?.losses ?? "—" },
    { label: "Games", value: stats?.games ?? "—" },
  ]

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative">
        <div className="relative isolate grid h-28 grid-cols-[120px_1fr] overflow-hidden rounded-t-2xl bg-[#0A1A3F] @md:h-32 @md:grid-cols-[140px_1fr] @lg:h-36 @lg:grid-cols-[180px_1fr]">
          <div className="flex items-center justify-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={96}
                height={96}
                className="rounded-xl border border-border bg-card object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-xl border border-border bg-card" />
            )}
          </div>
          <div className="col-start-2 px-4">
            <div className="flex h-full flex-col items-start justify-center gap-1.5">
              <div className="max-w-full truncate text-2xl/tight font-extrabold tracking-tight text-black">{name}</div>
              {region ? (
                <div className="rounded-full bg-black/20 px-3 py-0.5 text-2xs/snug font-extrabold tracking-[0.3em] text-black uppercase">
                  {region}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[120px_1fr] @md:grid-cols-[140px_1fr] @lg:grid-cols-[180px_1fr]">
        <div className="col-start-2 grid w-fit grid-cols-3 divide-x divide-border py-5 text-foreground @2xl:-ms-8 @2xl:ps-8">
          {statistics.map((statistic) => (
            <div key={statistic.label} className="px-4 @2xl:px-8">
              <div className="mb-2 text-sm/tight font-bold">{statistic.value}</div>
              <div className="text-2xs/tight uppercase text-muted-foreground">{statistic.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default TeamCard6


