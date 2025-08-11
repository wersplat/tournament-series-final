"use client"

export type LatestResult = {
  date: string
  team1: { name: string }
  team2: { name: string }
  score: string
  competition?: string
}

export default function LatestResults5({ results }: { results: LatestResult[] }) {
  return (
    <div className="w-full">
      <div className="rounded-3xl border border-custom-gray-200 bg-white px-8 py-7 dark:border-custom-gray-600 dark:bg-custom-gray-800">
        <div className="-mx-8 -mb-7 overflow-x-auto rounded-3xl bg-white ring-1 ring-custom-gray-200 dark:bg-custom-gray-800 dark:ring-custom-gray-600">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full table-auto border-collapse border-spacing-px bg-custom-gray-100 dark:bg-custom-gray-700">
              <thead className="text-xs-md/tight font-bold text-custom-gray-900 uppercase dark:text-white">
                <tr>
                  <th className="py-3.5 ps-8 pe-4 text-start">Date</th>
                  <th className="px-2.5 py-3.5 text-start">
                    <span className="sr-only">Team 1</span>
                  </th>
                  <th className="py-3.5 text-center">Score</th>
                  <th className="px-2.5 py-3.5 text-start">
                    <span className="sr-only">Team 2</span>
                  </th>
                  <th className="py-3.5 ps-1 pe-8 text-start">Competition</th>
                </tr>
              </thead>
              <tbody className="rounded-3xl text-sm/tight font-bold text-custom-gray-900 dark:text-white [&_td]:bg-white dark:[&_td]:bg-custom-gray-800">
                {results.map((r) => (
                  <tr key={`${r.date}-${r.team1.name}-${r.team2.name}`} className="border-b border-custom-gray-200 ring-1 first:rounded-t-3xl last:border-0 dark:border-custom-gray-600">
                    <td className="ps-8 pe-4 text-start">{r.date}</td>
                    <td className="px-2.5 py-4 pe-1 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <div className="min-w-0 text-xs-md/tight font-bold text-custom-gray-900 dark:text-white">
                          <div className="truncate">{r.team1.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">{r.score}</td>
                    <td className="px-2.5 py-4 ps-1 text-start whitespace-nowrap">
                      <div className="flex flex-row-reverse items-center justify-end gap-2">
                        <div className="min-w-0 text-xs-md/tight font-bold text-custom-gray-900 dark:text-white">
                          <div className="truncate">{r.team2.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 ps-1 pe-8 text-start whitespace-nowrap">{r.competition ?? "—"}</td>
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


