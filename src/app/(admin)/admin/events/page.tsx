import { requireAdmin } from '@/lib/auth'
import { insertEvent } from '@/lib/api/supabase-admin'

export default async function AdminEventsPage() {
  const can = await requireAdmin()
  if (!can.ok) return null
  async function action(formData: FormData) {
    'use server'
    await insertEvent({
      name: String(formData.get('name') || ''),
      start_date: String(formData.get('start_date') || ''),
    })
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Events</h1>
      <form action={action} className="tile p-4 grid gap-2 max-w-md">
        <input name="name" placeholder="Event name" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
        <input name="start_date" type="date" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
        <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground">Create</button>
      </form>
    </div>
  )
}


