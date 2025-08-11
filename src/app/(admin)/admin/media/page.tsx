import { requireAdmin } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'

export default async function AdminMediaPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  return (
    <Card>
      <CardContent>Media CRUD coming soon.</CardContent>
    </Card>
  )
}


