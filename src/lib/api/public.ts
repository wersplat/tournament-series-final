import { cache } from 'react'
import type { Event, Match, MediaItem, Player, Standing, Team, UUID, PlayerMatchStat, TeamRecentStat } from '@/lib/types'
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
  const { data, error } = await client.from('teams').select('id, name, logo_url, region_id, created_at')
  if (error) throw error
  return (data || []).map((t: any) => ({
    id: t.id,
    name: t.name,
    logo_url: t.logo_url ?? null,
    conference: null,
    region: null, // could be resolved via regions table if needed
    created_at: t.created_at ?? undefined,
  })) as Team[]
})

// Players
export const getPlayers = cache(async (): Promise<Player[]> => {
  const client = await ensureClient()
  if (!client) {
    return [
      { id: 'p1', gamertag: 'Ace', current_team_id: 't1' },
      { id: 'p2', gamertag: 'Vex', current_team_id: 't2' },
    ]
  }
  const { data, error } = await client.from('players').select('id, gamertag, position, current_team_id, created_at')
  if (error) throw error
  // Map current_team_id -> team_id for UI compatibility
  return (data || []).map((p: any) => ({
    id: p.id as UUID,
    gamertag: p.gamertag as string,
    current_team_id: (p.current_team_id as UUID) ?? null,
    role: p.position ?? null,
    avatar_url: null,
    discord_id: null,
    twitter_id: null,
    player_badges: null,
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
  // Use upcoming_matches for schedule view (has scheduled_at + status)
  const { data, error } = await client
    .from('upcoming_matches')
    .select('id, event_id, team_a_id, team_b_id, scheduled_at, status, teams!upcoming_matches_team_a_id_fkey(name), teams_b:teams!upcoming_matches_team_b_id_fkey(name)')
    .order('scheduled_at', { ascending: true })
  if (error) throw error
  return (data || []).map((m: any) => ({
    id: m.id,
    event_id: m.event_id ?? null,
    home_team_id: m.team_a_id,
    away_team_id: m.team_b_id,
    home_team_name: m.teams?.name ?? null,
    away_team_name: m.teams_b?.name ?? null,
    scheduled_at: m.scheduled_at,
    status: (m.status === 'in_progress' || m.status === 'completed' || m.status === 'cancelled' || m.status === 'scheduled' || m.status === 'review') ? m.status : 'scheduled',
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
  const client = await ensureClient()
  if (!client) {
    const [teams, players, schedule] = await Promise.all([getTeams(), getPlayers(), getSchedule()])
    const team = teams.find((t) => t.id === id) || null
    const roster = players.filter((p) => p.current_team_id === id)
    const matches = schedule.filter((m) => m.home_team_id === id || m.away_team_id === id)
    return { team, players: roster, matches }
  }

  const [teamRes, rosterRes, upcoming, history, teamRecent] = await Promise.all([
    client.from('teams').select('id, name, logo_url, region_id, created_at').eq('id', id).single(),
    client.from('players').select('id, gamertag, position, current_team_id').eq('current_team_id', id),
    client
      .from('upcoming_matches')
      .select('id, event_id, team_a_id, team_b_id, scheduled_at, status, teams!upcoming_matches_team_a_id_fkey(name), teams_b:teams!upcoming_matches_team_b_id_fkey(name)')
      .or(`team_a_id.eq.${id},team_b_id.eq.${id}`)
      .order('scheduled_at', { ascending: true }),
    client
      .from('match_details')
      .select('id:match_id, played_at, team_a_id, team_b_id, team_a_name, team_b_name, score_a, score_b, winner_id')
      .or(`team_a_id.eq.${id},team_b_id.eq.${id}`)
      .order('played_at', { ascending: false })
      .limit(10),
    client
      .from('team_match_stats')
      .select(`
        match_id,
        team_id,
        points, assists, rebounds, steals,
        fgm:field_goals_made, fga:field_goals_attempted,
        three_points_made, three_points_attempted,
        match_details:match_details!team_match_stats_match_id_fkey(played_at, team_a_id, team_b_id, team_a_name, team_b_name, winner_id)
      `)
      .eq('team_id', id)
      .order('played_at', { ascending: false, foreignTable: 'match_details' })
      .limit(10),
  ])

  const team = teamRes.data
    ? ({ id: teamRes.data.id, name: teamRes.data.name, logo_url: teamRes.data.logo_url ?? null, region: null, conference: null, created_at: teamRes.data.created_at ?? undefined } as any)
    : null
  const roster = (rosterRes.data || []).map((p: any) => ({ id: p.id, gamertag: p.gamertag, role: p.position ?? null, current_team_id: p.current_team_id ?? null }))
  const matches = (upcoming.data || []).map((m: any) => ({
    id: m.id,
    event_id: m.event_id ?? null,
    home_team_id: m.team_a_id,
    away_team_id: m.team_b_id,
    home_team_name: m.teams?.name ?? null,
    away_team_name: m.teams_b?.name ?? null,
    scheduled_at: m.scheduled_at,
    status: (m.status === 'in_progress' || m.status === 'completed' || m.status === 'cancelled' || m.status === 'scheduled' || m.status === 'review') ? m.status : 'scheduled',
  })) as Match[]

  const pastMatches = (history.data || [])
  const recentStats: TeamRecentStat[] = (teamRecent.data || []).map((r: any) => {
    const md = Array.isArray(r.match_details) ? r.match_details[0] : r.match_details
    return ({
    match_id: r.match_id,
    played_at: md?.played_at ?? null,
    opponent_name: md ? (md.team_a_id === id ? md.team_b_name : md.team_a_name) : null,
    is_home: md ? (md.team_a_id === id) : null,
    is_winner: md ? (md.winner_id === id) : null,
    points: r.points ?? null,
    assists: r.assists ?? null,
    rebounds: r.rebounds ?? null,
    steals: r.steals ?? null,
    fgm: r.fgm ?? null,
    fga: r.fga ?? null,
    three_points_made: r.three_points_made ?? null,
    three_points_attempted: r.three_points_attempted ?? null,
  })})
  return { team, players: roster, matches, pastMatches, recentStats }
})

export const getPlayerProfile = cache(async (id: string) => {
  const client = await ensureClient()
  // Base identity from players
  const [playerRow, perf, schedule, played] = await Promise.all([
    client
      ? client.from('players').select('id, gamertag, position, current_team_id').eq('id', id).single()
      : Promise.resolve({ data: null, error: null } as any),
    client ? client.from('player_performance_view').select('*').eq('id', id).single() : Promise.resolve({ data: null } as any),
    getSchedule(),
    client
      ? client
          .from('player_match_history')
          .select('match_id, played_at, team_name, is_winner, points, assists, rebounds, steals, fgm, fga, three_points_made, three_points_attempted')
          .eq('player_id', id)
          .order('played_at', { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] } as any),
  ])
  const base = playerRow?.data
  const player = base
    ? ({ id: base.id, gamertag: base.gamertag, role: base.position ?? null, team_id: base.current_team_id ?? null } as any)
    : null
  const performance = perf?.data || null
  const pastMatches: PlayerMatchStat[] = (played?.data || []).map((m: any) => ({
    match_id: m.match_id,
    played_at: m.played_at ?? null,
    team_name: m.team_name ?? null,
    is_winner: typeof m.is_winner === 'boolean' ? m.is_winner : null,
    points: m.points ?? null,
    assists: m.assists ?? null,
    rebounds: m.rebounds ?? null,
    steals: m.steals ?? null,
    fgm: m.fgm ?? null,
    fga: m.fga ?? null,
    three_points_made: m.three_points_made ?? null,
    three_points_attempted: m.three_points_attempted ?? null,
  }))

  return { player, matches: schedule, performance, pastMatches }
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

// Events
export const getCurrentEvents = cache(async (): Promise<Event[]> => {
  const client = await ensureClient()
  if (!client) return []
  const { data, error } = await client
    .from('events')
    .select('id, name, type, start_date, end_date, banner_url, rules_url, tier, prize_pool')
    .eq('status', 'in_progress')
    .order('start_date', { ascending: true })
  if (error) throw error
  return (data || []).map((e: any) => ({
    id: e.id,
    name: e.name,
    type: e.type ?? null,
    start_date: e.start_date,
    end_date: e.end_date ?? null,
    bracket_url: null,
    location: null,
    notes: null,
    // Preserve known optional fields via cast
    banner_url: e.banner_url ?? undefined,
  })) as Event[]
})

export const getUpcomingEvents = cache(async (): Promise<Event[]> => {
  const client = await ensureClient()
  if (!client) return []
  const { data, error } = await client
    .from('events')
    .select('id, name, type, start_date, end_date, banner_url, rules_url, tier, prize_pool, status')
    .eq('status', 'upcoming')
    .order('start_date', { ascending: true })
  if (error) throw error
  return (data || []).map((e: any) => ({
    id: e.id,
    name: e.name,
    type: e.type ?? null,
    start_date: e.start_date,
    end_date: e.end_date ?? null,
    bracket_url: null,
    location: null,
    notes: null,
    banner_url: e.banner_url ?? undefined,
  })) as Event[]
})

export const getPastEvents = cache(async (): Promise<Event[]> => {
  const client = await ensureClient()
  if (!client) return []
  const { data, error } = await client
    .from('events')
    .select('id, name, type, start_date, end_date, banner_url, rules_url, tier, prize_pool, status')
    .eq('status', 'completed')
    .order('end_date', { ascending: false })
    .limit(12)
  if (error) throw error
  return (data || []).map((e: any) => ({
    id: e.id,
    name: e.name,
    type: e.type ?? null,
    start_date: e.start_date,
    end_date: e.end_date ?? null,
    bracket_url: null,
    location: null,
    notes: null,
    banner_url: e.banner_url ?? undefined,
  })) as Event[]
})


