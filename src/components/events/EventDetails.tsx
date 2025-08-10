import Image from 'next/image'
import { createServerSupabase } from '@/lib/supabase/server'

export async function EventDetails({ eventId }: { eventId: string }) {
  const supabase = createServerSupabase()

  const [{ data: event }, { data: teams } , { data: winners }] = await Promise.all([
    supabase.from('events').select('id, name, description, start_date, end_date, banner_url, tier, prize_pool').eq('id', eventId).single(),
    supabase.from('team_rosters').select('team_id, teams(name, logo_url)').eq('event_id', eventId),
    supabase.from('event_results').select('team_id, placement, rp_awarded, prize_amount, teams(name, logo_url)').eq('event_id', eventId).order('placement', { ascending: true })
  ])

  // Deduplicate roster rows into unique teams by team_id for display
  const uniqueTeams = Array.from(
    new Map(
      (teams || [])
        .filter((t: any) => t && t.team_id)
        .map((t: any) => [t.team_id, t])
    ).values()
  )

  return (
    <div className="space-y-6">
      {event?.banner_url ? (
        <div className="relative max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border h-48 sm:h-64 md:h-72 lg:h-80">
          <Image
            src={event.banner_url}
            alt={event.name}
            fill
            sizes="(min-width: 1280px) 768px, (min-width: 1024px) 700px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div>
        <div className="text-2xl font-semibold">{event?.name}</div>
        <div className="text-xs text-muted-foreground">
          {event?.start_date ? new Date(event.start_date).toLocaleDateString() : ''}
          {event?.end_date ? ` – ${new Date(event.end_date).toLocaleDateString()}` : ''}
        </div>
        {event?.prize_pool ? <div className="text-sm mt-1">Prize pool: ${event.prize_pool.toLocaleString()}</div> : null}
      </div>

      <section className="space-y-2">
        <div className="font-medium">Registered Teams</div>
        {uniqueTeams && uniqueTeams.length > 0 ? (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {uniqueTeams.map((t: any) => (
              <li key={t.team_id} className="flex items-center gap-2 text-sm text-muted-foreground">
                {t.teams?.logo_url ? (
                  <Image src={t.teams.logo_url} alt={t.teams.name} width={20} height={20} className="rounded-sm border border-border object-cover" />
                ) : (
                  <span className="w-5 h-5 rounded-sm border border-border bg-muted/30" />
                )}
                {t.teams?.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">No registered teams.</div>
        )}
      </section>

      <section className="space-y-2">
        <div className="font-medium">Past Champions</div>
        {winners && winners.length > 0 ? (
          <ul className="space-y-2">
            {winners.map((w: any) => (
              <li key={w.team_id} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex w-6">#{w.placement}</span>
                {w.teams?.logo_url ? (
                  <Image src={w.teams.logo_url} alt={w.teams.name} width={20} height={20} className="rounded-sm border border-border object-cover" />
                ) : (
                  <span className="w-5 h-5 rounded-sm border border-border bg-muted/30" />
                )}
                <span className="flex-1">{w.teams?.name}</span>
                {w.prize_amount ? <span>${w.prize_amount.toLocaleString()}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">No past champions recorded.</div>
        )}
      </section>
    </div>
  )
}


