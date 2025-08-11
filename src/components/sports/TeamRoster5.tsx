"use client"
import Image from "next/image"

type Player = {
  id: string
  number?: string | null
  position?: string | null
  firstName?: string | null
  lastName?: string | null
  img?: string | null
  age?: number | null
  height?: string | null
  weight?: number | null
  win?: number | null
  loss?: number | null
  yellowCards?: number | null
  redCards?: number | null
  points?: number | null
  status?: "active" | "inactive" | "injured" | null
}

export function StatusIcon({ status }: { status?: Player["status"] }) {
  if (!status) return null
  return (
    <div className="inline-flex aspect-square w-8 items-center justify-center rounded-full border border-custom-gray-200 dark:border-custom-gray-600">
      {status === "active" && (
        <div className="flex aspect-square w-3 items-center justify-center rounded-full bg-custom-green">
          <div className="flex aspect-square w-1.5 items-center justify-center rounded-full bg-white dark:bg-custom-gray-800">
            <div className="aspect-square w-0.5 rounded-full bg-custom-green" />
          </div>
        </div>
      )}
      {status === "inactive" && (
        <div className="flex aspect-square w-3 items-center justify-center rounded-full bg-custom-gray dark:bg-custom-gray-400">
          <div className="flex aspect-square w-1.5 items-center justify-center rounded-full bg-white dark:bg-custom-gray-800">
            <div className="aspect-square w-0.5 rounded-full bg-custom-gray dark:bg-custom-gray-400" />
          </div>
        </div>
      )}
      {status === "injured" && (
        <div className="relative flex aspect-square w-3 items-center justify-center rounded-full bg-custom-red">
          <div className="absolute start-1/2 top-1/2 h-0.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-white" />
          <div className="absolute start-1/2 top-1/2 h-1.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white" />
        </div>
      )}
    </div>
  )
}

export default function TeamRoster5({ title, players }: { title?: string; players: Player[] }) {
  return (
    <div className="w-full">
      <div className="rounded-3xl border border-custom-gray-200 bg-white px-8 py-7 dark:border-custom-gray-600 dark:bg-custom-gray-800">
        {title ? (
          <div className="relative -mx-8 -mt-7 px-8 py-7">
            <h3 className="pe-10 text-base/tight font-bold text-custom-gray-900 dark:text-white">{title}</h3>
          </div>
        ) : null}
        <div className="-mx-8 -mb-7 overflow-x-auto rounded-3xl bg-white ring-1 ring-custom-gray-200 dark:bg-custom-gray-800 dark:ring-custom-gray-600">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto_auto_auto_auto] gap-x-2.5">
            <div className="col-span-full -mb-6 grid grid-cols-subgrid bg-custom-gray-100 pb-6 text-xs-md/tight font-bold text-custom-gray-900 uppercase dark:bg-custom-gray-700 dark:text-white">
              <div className="py-4 ps-8 pe-2.5">Player</div>
              <div className="py-4 ps-4 text-end">Age</div>
              <div className="py-4 ps-4 text-end">HT</div>
              <div className="py-4 ps-4 text-end">WT</div>
              <div className="py-4 ps-4 text-end">W</div>
              <div className="py-4 ps-4 text-end">L</div>
              <div className="py-4 ps-4 text-end">YC</div>
              <div className="py-4 ps-4 text-end">RC</div>
              <div className="py-4 ps-4 text-end">PTS</div>
              <div className="py-4 ps-4 pe-8 text-end">Status</div>
            </div>
            {players.map((player) => (
              <div key={player.id} className="col-span-full grid grid-cols-subgrid items-center border-b border-custom-gray-200 bg-white text-sm/tight first:rounded-t-3xl first:ring-1 first:ring-custom-gray-200 last:border-b-0 dark:border-custom-gray-600 dark:bg-custom-gray-800 dark:first:ring-custom-gray-600">
                <div className="flex min-w-[17.5rem] gap-3 overflow-hidden">
                  <div className="relative isolate flex min-w-[11.25rem] shrink-0 items-center gap-2 bg-custom-gray-900 text-white">
                    <div className="relative flex shrink-0 items-center ps-6 font-bold uppercase">{player.number ?? "-"}</div>
                    <figure className="relative h-14 w-20 shrink-0">
                      {player.img ? (
                        <Image src={player.img} alt={`${player.firstName ?? ""} ${player.lastName ?? ""}`} fill sizes="80px" className="relative mt-0.5 object-cover object-top" />
                      ) : (
                        <div className="relative mt-0.5 h-full w-full bg-custom-gray-100" />
                      )}
                    </figure>
                    <div className="font-bold uppercase">{player.position ?? ""}</div>
                  </div>
                  <div className="self-center font-bold">
                    <div className="text-xs-md/tight">{player.firstName ?? ""}</div>
                    <div>{player.lastName ?? ""}</div>
                  </div>
                </div>
                <div className="py-5 ps-4 text-end font-bold">{player.age ?? "-"}</div>
                <div className="py-5 ps-12 text-end font-bold">{player.height ?? "-"}</div>
                <div className="py-5 ps-8 text-end font-bold whitespace-nowrap">{player.weight ?? "-"}</div>
                <div className="py-5 ps-9 text-end font-bold">{player.win ?? "-"}</div>
                <div className="py-5 ps-10 text-end font-bold">{player.loss ?? "-"}</div>
                <div className="py-5 ps-10 text-end font-bold">{player.yellowCards ?? "-"}</div>
                <div className="py-5 ps-10 text-end font-bold">{player.redCards ?? "-"}</div>
                <div className="py-5 ps-7 text-end font-bold">{player.points ?? "-"}</div>
                <div className="py-3 ps-4 pe-8 text-end">
                  <StatusIcon status={player.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


