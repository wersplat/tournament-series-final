"use client"

type TeamStanding = {
  name: string
  wins: number
  losses: number
  draws?: number | null
  points?: number | null
  diff?: string | number | null
  streak?: string | null
}

export default function Standings5({ title, rows }: { title?: string; rows: TeamStanding[] }) {
  return (
    <div className="w-full">
      <div className="rounded-3xl border border-custom-gray-200 bg-white px-8 py-7 dark:border-custom-gray-600 dark:bg-custom-gray-800">
        {title ? (
          <div className="-mx-8 -mt-7 px-8 py-7">
            <h4 className="text-base/tight font-bold text-custom-gray-900 dark:text-white">{title}</h4>
          </div>
        ) : null}
        <div className="-mx-8 -mb-7 overflow-x-auto rounded-3xl bg-white ring-1 ring-custom-gray-200 dark:bg-custom-gray-800 dark:ring-custom-gray-600">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full table-auto border-collapse border-spacing-px bg-custom-gray-100 dark:bg-custom-gray-700">
              <thead className="text-xs-md/tight font-bold text-custom-gray-900 uppercase dark:text-white">
                <tr>
                  <th className="py-3.5 ps-8 pe-4 text-start">Team</th>
                  <th className="px-2.5 py-3.5 text-center">w</th>
                  <th className="px-2.5 py-3.5 text-center">l</th>
                  <th className="px-2.5 py-3.5 text-center">d</th>
                  <th className="px-2.5 py-3.5 text-center">pts</th>
                  <th className="py-3.5 ps-1 pe-8 text-end">dif</th>
                </tr>
              </thead>
              <tbody className="rounded-3xl text-sm/tight font-bold text-custom-gray-900 dark:text-white [&_td]:bg-white dark:[&_td]:bg-custom-gray-800">
                {rows.map((t) => (
                  <tr key={t.name} className="border-b border-custom-gray-200 last:border-0 dark:border-custom-gray-600">
                    <td className="py-4 ps-8 pe-4 text-start whitespace-nowrap">{t.name}</td>
                    <td className="px-2.5 py-4 text-center whitespace-nowrap">{t.wins}</td>
                    <td className="px-2.5 py-4 text-center whitespace-nowrap">{t.losses}</td>
                    <td className="px-2.5 py-4 text-center whitespace-nowrap">{t.draws ?? 0}</td>
                    <td className="px-2.5 py-4 text-center whitespace-nowrap">{t.points ?? t.wins * 2}</td>
                    <td className="py-4 ps-1 pe-8 text-end whitespace-nowrap">{t.diff ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


