import { EventDetails } from '@/components/events/EventDetails'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export default async function EventPage({ params }: { params: Params }) {
  const { id } = await params
  return (
    <div className="space-y-4">
      <EventDetails eventId={id} />
    </div>
  )
}


