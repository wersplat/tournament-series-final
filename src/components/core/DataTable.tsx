'use client'
import { useMemo, useState } from 'react'

type Column<T> = {
  key: keyof T
  header: string
}

export function DataTable<T extends Record<string, any>>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query) return data
    const q = query.toLowerCase()
    return data.filter((row) => Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)))
  }, [data, query])

  return (
    <div className="tile p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter…"
        className="mb-3 w-full px-2 py-1 rounded-md bg-background border border-input text-sm"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="text-left font-medium p-2">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-t border-border/70">
                {columns.map((c) => (
                  <td key={String(c.key)} className="p-2">
                    {String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


