import { requireAdmin } from '@/lib/auth'

export default async function AdminMatchesPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  return <div className="tile p-4">Matches CRUD coming soon.</div>
}


