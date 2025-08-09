import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getReviewQueue } from '@/lib/api/admin'

export default async function ReviewQueuePage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  const queue = await getReviewQueue()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Review Queue</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {queue.map((s) => (
          <Link key={s.id} href={`/admin/review/${s.id}`} className="tile p-4">
            <div className="font-medium">Submission {s.id}</div>
            <div className="text-xs text-muted-foreground">Status: {s.status}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


