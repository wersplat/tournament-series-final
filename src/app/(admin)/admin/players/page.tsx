import { requireAdmin } from '@/lib/auth'

export default async function AdminPlayersPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  return <div className="tile p-4">Players CRUD coming soon.</div>
}


