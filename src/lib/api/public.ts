import { cache } from 'react'
import type { Event, Match, MediaItem, Player, Standing, Team, UUID, PlayerMatchStat, TeamRecentStat } from '@/lib/types'
import { apiFetch } from '@/lib/api'

// Teams
export const getTeams = cache(async (): Promise<Team[]> => {
  const res = await apiFetch('/api/teams', {}, { tags: ['teams'], revalidate: 300 })
  if (!res.ok) return []
  const json = await res.json()
  const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
  return list.map((t: any) => ({
    id: t.id,
    name: t.name,
    logo_url: t.logo_url ?? null,
    conference: null,
    region: t.regions?.name ?? null,
    created_at: t.created_at ?? undefined,
    wins: (t as any).wins ?? null,
    losses: (t as any).losses ?? null,
    games_played: (t as any).games_played ?? null,
  })) as Team[]
})

// Players
export const getPlayers = cache(async (): Promise<Player[]> => {
  const res = await apiFetch('/api/players?limit=100', {}, { tags: ['players'], revalidate: 120 })
  if (!res.ok) return []
  const json = await res.json()
  const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
  return list.map((p: any) => ({
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
  const res = await apiFetch('/api/views/upcoming-matches?limit=50', {}, { tags: ['schedule'], revalidate: 60 })
  if (!res.ok) return []
  const list = await res.json()
  return (Array.isArray(list) ? list : []).map((m: any) => ({
    id: m.id,
    event_id: m.event_id ?? null,
    home_team_id: m.team_a?.id ?? m.team_a_id ?? m.team_a,
    away_team_id: m.team_b?.id ?? m.team_b_id ?? m.team_b,
    home_team_name: m.team_a?.name ?? m.team_a_name ?? null,
    away_team_name: m.team_b?.name ?? m.team_b_name ?? null,
    scheduled_at: m.played_at ?? m.match_date ?? m.scheduled_at,
    status: (m.status === 'in_progress' || m.status === 'completed' || m.status === 'cancelled' || m.status === 'scheduled' || m.status === 'review') ? m.status : 'scheduled',
  })) as Match[]
})

// Standings - derived from calculate_team_standings(event_id) or fallback empty
export const getStandings = cache(async (): Promise<Standing[]> => {
  const currentEventId = process.env.NEXT_PUBLIC_CURRENT_EVENT_ID
  if (!currentEventId) return []
  const res = await apiFetch(`/api/views/event-standings/${currentEventId}`, {}, { tags: ['standings'], revalidate: 60 })
  if (!res.ok) return []
  const data = await res.json()
  return (Array.isArray(data) ? data : []).map((row: any, idx: number) => ({
    id: `${row.team_id}-${idx}`,
    season: new Date().getFullYear().toString(),
    conference: row.conference ?? 'East',
    team_id: row.team_id,
    w: row.wins ?? row.total_wins ?? 0,
    l: row.losses ?? row.total_losses ?? 0,
    pd: row.point_differential ?? 0,
  })) as Standing[]
})

// Media placeholder - no direct table known yet
export const getMedia = cache(async (): Promise<MediaItem[]> => {
  return []
})

export const getTeamProfile = cache(async (id: string) => {
  const [teamRes, scheduleRes, perfRes] = await Promise.all([
    apiFetch(`/api/teams/${id}`, {}, { tags: ['teams'], revalidate: 300 }),
    apiFetch('/api/views/upcoming-matches?limit=100', {}, { tags: ['schedule'], revalidate: 60 }),
    apiFetch(`/api/views/team-performance-summary/${id}`, {}, { tags: ['teams'], revalidate: 300 })
  ])
  if (!teamRes.ok) return { team: null, players: [], matches: [] }
  const teamJson = await teamRes.json()
  const team = teamJson?.data ?? teamJson
  const roster = (team?.team_rosters || []).map((r: any) => ({ id: r.players?.id, gamertag: r.players?.gamertag, role: r.players?.position ?? null, current_team_id: id }))
  const schedule = (await scheduleRes.json()) as any[]
  const matches = schedule.filter((m: any) => m.team_a?.id === id || m.team_b?.id === id)

  // Optionally fetch recent stats via views endpoints if available
  const recentStats: TeamRecentStat[] = []
  const pastMatches: any[] = []
  const perf = perfRes.ok ? await perfRes.json() : null

  return {
    team: team ? { id: team.id, name: team.name, logo_url: team.logo_url ?? null, region: team.regions?.name ?? null, conference: null } : null,
    players: roster,
    matches,
    pastMatches,
    recentStats,
    performance: perf,
  }
})

export const getPlayerProfile = cache(async (id: string) => {
  const [playerRes, perfRes, schedule] = await Promise.all([
    apiFetch(`/api/players/${id}`, {}, { tags: ['players'], revalidate: 300 }),
    apiFetch(`/api/views/player-performance-view/${id}`, {}, { tags: ['players'], revalidate: 300 }),
    getSchedule(),
  ])
  const playerJson = playerRes.ok ? await playerRes.json() : null
  const base = playerJson?.data ?? playerJson
  const player = base ? ({ id: base.id, gamertag: base.gamertag, role: base.position ?? null, team_id: base.current_team_id ?? null } as any) : null
  const performance = perfRes.ok ? await perfRes.json() : null

  // Past matches via views route
  const historyRes = await apiFetch(`/api/views/player-match-history/${id}?limit=10`, {}, { tags: ['players'], revalidate: 60 })
  const pastMatches: PlayerMatchStat[] = historyRes.ok
    ? ((await historyRes.json()) as any[]).map((m: any) => ({
        match_id: m.match_id,
        played_at: m.match_date ?? m.played_at ?? null,
        team_name: m.team_name ?? null,
        is_winner: typeof m.is_winner === 'boolean' ? m.is_winner : null,
        points: m.points ?? null,
        assists: m.assists ?? null,
        rebounds: m.rebounds ?? null,
        steals: m.steals ?? null,
        fgm: m.field_goals_made ?? m.fgm ?? null,
        fga: m.field_goals_attempted ?? m.fga ?? null,
        three_points_made: m.three_point_made ?? m.three_points_made ?? null,
        three_points_attempted: m.three_point_attempted ?? m.three_points_attempted ?? null,
      }))
    : []

  return { player, matches: schedule, performance, pastMatches }
})

// GraphQL dropped for now

// Events
export const getCurrentEvents = cache(async (): Promise<Event[]> => {
  const res = await apiFetch('/api/events', {}, { tags: ['events'], revalidate: 120 })
  if (!res.ok) return []
  const list = await res.json()
  return (Array.isArray(list) ? list : []).filter((e: any) => e.status === 'in_progress').map((e: any) => ({
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

export const getUpcomingEvents = cache(async (): Promise<Event[]> => {
  const res = await apiFetch('/api/events', {}, { tags: ['events'], revalidate: 120 })
  if (!res.ok) return []
  const list = await res.json()
  return (Array.isArray(list) ? list : []).filter((e: any) => e.status === 'upcoming').map((e: any) => ({
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
  const res = await apiFetch('/api/events', {}, { tags: ['events'], revalidate: 120 })
  if (!res.ok) return []
  const list = await res.json()
  return (Array.isArray(list) ? list : []).filter((e: any) => e.status === 'completed').slice(0, 12).map((e: any) => ({
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


