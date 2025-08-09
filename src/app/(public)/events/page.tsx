import Image from 'next/image'
import { getCurrentEvents, getUpcomingEvents } from '@/lib/api/public'

export default async function EventsPage() {
  const [current, upcoming] = await Promise.all([getCurrentEvents(), getUpcomingEvents()])
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Events</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">In Progress</h2>
        {current.length === 0 ? (
          <div className="text-sm text-muted-foreground">No events in progress.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {current.map((e) => (
              <div key={e.id} className="tile p-4 space-y-2">
                {e.banner_url ? (
                  <Image src={e.banner_url} alt={e.name} width={640} height={360} className="w-full h-auto rounded-md border border-border object-cover" />
                ) : null}
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(e.start_date).toLocaleDateString()} {e.end_date ? `– ${new Date(e.end_date).toLocaleDateString()}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="text-sm text-muted-foreground">No upcoming events scheduled.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcoming.map((e) => (
              <div key={e.id} className="tile p-4 space-y-2">
                {e.banner_url ? (
                  <Image src={e.banner_url} alt={e.name} width={640} height={360} className="w-full h-auto rounded-md border border-border object-cover" />
                ) : null}
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(e.start_date).toLocaleDateString()} {e.end_date ? `– ${new Date(e.end_date).toLocaleDateString()}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


