"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatRow = {
  label: string
  value: number | string
}

export default function PlayerStats5({ stats, title = "Performance Stats" }: { stats: StatRow[], title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/50 p-4 text-center border border-border">
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


