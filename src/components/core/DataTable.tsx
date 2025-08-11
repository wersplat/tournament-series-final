"use client"
import { useMemo, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

type Column<T> = {
  key: keyof T
  header: string
}

export function DataTable<T extends Record<string, any>>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  const [query, setQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const filtered = useMemo(() => {
    if (!query) return data
    const q = query.toLowerCase()
    return data.filter((row) => Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q)))
  }, [data, query])

  const columnDefs = useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((c) => ({
        id: String(c.key),
        accessorKey: c.key as string,
        header: () => c.header,
        cell: ({ getValue }) => String(getValue() ?? ""),
        enableSorting: true,
      })),
    [columns]
  )

  const table = useReactTable<T>({
    data: filtered,
    columns: columnDefs,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

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
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="text-left font-medium p-2 cursor-pointer select-none"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc" ? " ▲" : h.column.getIsSorted() === "desc" ? " ▼" : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border/70">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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


