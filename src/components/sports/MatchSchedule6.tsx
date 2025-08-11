"use client"
import { Card } from "@/components/ui/card"

type MatchItem = {
  id: string
  date: Date
  teamA: { name: string; abbr?: string }
  teamB: { name: string; abbr?: string }
  league?: string
  timeLabel?: string
}

export default function MatchSchedule6({ matches }: { matches: MatchItem[] }) {
  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((m) => (
          <Card key={m.id} className="overflow-hidden">
            <div className="relative isolate overflow-hidden rounded-t-2xl bg-[#0A1A3F]">
              <div className="flex items-center justify-between px-4">
                {[m.teamA, m.teamB].map((team, idx) => (
                  <div key={team.name + idx} className="flex gap-x-4 last:flex-row-reverse">
                    <div className="flex min-w-[32px] items-center justify-center text-xl/tight font-bold text-black">
                      <span>-</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 py-5">
                      <div className="h-6 w-6 rounded bg-black/20" />
                      <div className="text-sm/tight font-bold uppercase text-black">{team.abbr ?? team.name.slice(0, 3).toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm/tight">
                <div className="text-2xl/none font-bold text-black">{m.date.getDate()}</div>
                <div className="flex gap-0.5 text-xs-md/tight uppercase">
                  <span className="font-bold text-black">{m.date.toLocaleString(undefined, { month: "short" })}</span>
                  <span className="text-black">{m.date.getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-4 py-3 text-xs-md/tight font-bold text-foreground">
              <div>{m.league ?? "—"}</div>
              <div>{m.timeLabel ?? m.date.toLocaleTimeString()}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


