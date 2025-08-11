"use client"

type StatRow = {
  label: string
  value: number | string
}

export default function PlayerStats5({ stats }: { stats: StatRow[] }) {
  return (
    <div className="w-full">
      <div className="rounded-3xl border border-custom-gray-200 bg-white px-8 py-7 dark:border-custom-gray-600 dark:bg-custom-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="tile p-4 text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


