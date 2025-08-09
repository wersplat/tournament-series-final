import { requireAdmin } from '@/lib/auth'

export default async function AdminMediaPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  return <div className="tile p-4">Media CRUD coming soon.</div>
}


