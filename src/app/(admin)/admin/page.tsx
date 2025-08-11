import { requireAdmin } from '@/lib/auth'

export default async function AdminDashboard() {
  const can = await requireAdmin()
  if (!can.ok) return null
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[
          ['Events', '/admin/events'],
          ['Players', '/admin/players'],
          ['Teams', '/admin/teams'],
          ['Matches', '/admin/matches'],
          ['Media', '/admin/media'],
          ['Review', '/admin/review'],
        ].map(([label, href]) => (
          <a key={href} href={href} className="focus-ring">
            <div className="rounded-2xl border border-border ring-1 ring-transparent dark:ring-white/10 p-4 bg-card">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">Manage {label.toLowerCase()}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}


