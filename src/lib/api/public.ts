import { cache } from 'react'
import type { Event, Match, MediaItem, Player, Standing, Team } from '@/lib/types'

const BASE_URL = process.env.PUBLIC_API_BASE_URL

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) return mockFetch<T>(path)
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    next: { revalidate: 60, tags: [path] },
  })
  if (!res.ok) throw new Error(`Public API error ${res.status}`)
  return (await res.json()) as T
}

async function mockFetch<T>(path: string): Promise<T> {
  switch (true) {
    case path.startsWith('/teams'):
      return [
        { id: 't1', name: 'Neon Knights', conference: 'East', logo_url: '/brand/logo.svg' },
        { id: 't2', name: 'Shadow Wolves', conference: 'West', logo_url: '/brand/logo.svg' },
      ] as unknown as T
    case path.startsWith('/players'):
      return [
        { id: 'p1', gamertag: 'Ace', team_id: 't1' },
        { id: 'p2', gamertag: 'Vex', team_id: 't2' },
      ] as unknown as T
    case path.startsWith('/standings'):
      return [
        { id: 's1', season: '2026', conference: 'East', team_id: 't1', w: 12, l: 4 },
        { id: 's2', season: '2026', conference: 'West', team_id: 't2', w: 11, l: 5 },
      ] as unknown as T
    case path.startsWith('/schedule'):
      return [
        {
          id: 'm1',
          event_id: 'e1',
          home_team_id: 't1',
          away_team_id: 't2',
          scheduled_at: new Date().toISOString(),
          status: 'scheduled',
        },
      ] as unknown as T
    case path.startsWith('/media'):
      return [
        { id: 'm1', title: 'Opening Highlights', url: 'https://example.com', type: 'video' },
      ] as unknown as T
    default:
      return [] as unknown as T
  }
}

export const getTeams = cache(async (): Promise<Team[]> => fetchJson('/teams'))
export const getPlayers = cache(async (): Promise<Player[]> => fetchJson('/players'))
export const getStandings = cache(async (): Promise<Standing[]> => fetchJson('/standings'))
export const getSchedule = cache(async (): Promise<Match[]> => fetchJson('/schedule'))
export const getMedia = cache(async (): Promise<MediaItem[]> => fetchJson('/media'))

export const getTeamProfile = cache(async (id: string) => {
  const teams = await getTeams()
  const team = teams.find((t) => t.id === id)
  const players = (await getPlayers()).filter((p) => p.team_id === id)
  const matches = (await getSchedule()).filter((m) => m.home_team_id === id || m.away_team_id === id)
  return { team, players, matches }
})

export const getPlayerProfile = cache(async (id: string) => {
  const players = await getPlayers()
  const player = players.find((p) => p.id === id)
  const matches = await getSchedule()
  return { player, matches }
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


