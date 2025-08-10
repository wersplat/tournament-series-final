import { EventDetails } from '@/components/events/EventDetails'

export const dynamic = 'force-dynamic'

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <EventDetails eventId={params.id} />
    </div>
  )
}


