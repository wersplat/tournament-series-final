import { cache } from 'react'
import type { Event, Match, MediaItem, Player, Standing, Team, UUID } from '@/lib/types'
import { createServerSupabase } from '@/lib/supabase/server'

// Live data from Supabase. When env is missing, return minimal mocked values.

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

async function ensureClient() {
  if (!isConfigured()) return null
  return createServerSupabase()
}

// Teams
export const getTeams = cache(async (): Promise<Team[]> => {
  const client = await ensureClient()
  if (!client) {
    return [
      { id: 't1', name: 'Neon Knights', logo_url: '/brand/logo.svg', conference: null, region: null },
      { id: 't2', name: 'Shadow Wolves', logo_url: '/brand/logo.svg', conference: null, region: null },
    ]
  }
  const { data, error } = await client.from('teams').select('id, name, logo_url, created_at')
  if (error) throw error
  return (data || []) as Team[]
})

// Players
export const getPlayers = cache(async (): Promise<Player[]> => {
  const client = await ensureClient()
  if (!client) {
    return [
      { id: 'p1', gamertag: 'Ace', team_id: 't1' },
      { id: 'p2', gamertag: 'Vex', team_id: 't2' },
    ]
  }
  const { data, error } = await client.from('players').select('id, gamertag, current_team_id, avatar_url, bio, created_at')
  if (error) throw error
  // Map current_team_id -> team_id for UI compatibility
  return (data || []).map((p: any) => ({
    id: p.id as UUID,
    gamertag: p.gamertag as string,
    team_id: (p.current_team_id as UUID) ?? null,
    avatar_url: p.avatar_url ?? null,
    bio: p.bio ?? null,
    created_at: p.created_at ?? undefined,
  })) as Player[]
})

// Schedule (matches)
export const getSchedule = cache(async (): Promise<Match[]> => {
  const client = await ensureClient()
  if (!client) {
    return [
      {
        id: 'm1',
        event_id: 'e1',
        home_team_id: 't1',
        away_team_id: 't2',
        scheduled_at: new Date().toISOString(),
        status: 'scheduled',
      },
    ]
  }
  // Map Supabase schema to UI: teams stored as team_a_id/team_b_id
  const { data, error } = await client
    .from('matches')
    .select('id, event_id, team_a_id, team_b_id, scheduled_at, status')
    .order('scheduled_at', { ascending: true })
  if (error) throw error
  return (data || []).map((m: any) => ({
    id: m.id,
    event_id: m.event_id ?? null,
    home_team_id: m.team_a_id,
    away_team_id: m.team_b_id,
    scheduled_at: m.scheduled_at,
    status: (m.status === 'in_progress' || m.status === 'completed' || m.status === 'cancelled' || m.status === 'scheduled') ? m.status : 'scheduled',
  })) as Match[]
})

// Standings - derived from calculate_team_standings(event_id) or fallback empty
export const getStandings = cache(async (): Promise<Standing[]> => {
  const client = await ensureClient()
  if (!client) return []
  // If you have a current event id, plug it here; otherwise return empty until wired.
  const currentEventId = process.env.NEXT_PUBLIC_CURRENT_EVENT_ID
  if (!currentEventId) return []
  const { data, error } = await client.rpc('calculate_team_standings', { event_id_param: currentEventId })
  if (error) throw error
  return (data || []).map((row: any, idx: number) => ({
    id: `${row.team_id}-${idx}`,
    season: new Date().getFullYear().toString(),
    conference: 'East',
    team_id: row.team_id,
    w: row.wins,
    l: row.losses,
    pd: row.point_differential,
  })) as Standing[]
})

// Media placeholder - no direct table known yet
export const getMedia = cache(async (): Promise<MediaItem[]> => {
  return []
})

export const getTeamProfile = cache(async (id: string) => {
  const [teams, players, schedule] = await Promise.all([getTeams(), getPlayers(), getSchedule()])
  const team = teams.find((t) => t.id === id) || null
  const roster = players.filter((p) => p.team_id === id)
  const matches = schedule.filter((m) => m.home_team_id === id || m.away_team_id === id)
  return { team, players: roster, matches }
})

export const getPlayerProfile = cache(async (id: string) => {
  const [players, schedule] = await Promise.all([getPlayers(), getSchedule()])
  const player = players.find((p) => p.id === id) || null
  return { player, matches: schedule }
})

export async function queryGraphQL<T = unknown>(document: string, variables?: Record<string, unknown>) {
  const url = process.env.PG_GRAPHQL_URL
  if (!url) throw new Error('PG_GRAPHQL_URL not configured')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: document, variables }),
    next: { revalidate: 60 },
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data as T
}


