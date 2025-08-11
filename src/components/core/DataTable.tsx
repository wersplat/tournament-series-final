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
import { Card, CardContent } from "@/components/ui/card"
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table"

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
    <Card className="p-4">
      <CardContent className="p-0">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter…"
          className="mb-3 w-full px-2 py-1 rounded-md bg-background border border-input text-sm"
        />
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <Table className="min-w-[820px]">
            <Thead>
              {table.getHeaderGroups().map((hg) => (
                <Tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <Th
                      key={h.id}
                      className="cursor-pointer select-none"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" ? " ▲" : h.column.getIsSorted() === "desc" ? " ▼" : ""}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


