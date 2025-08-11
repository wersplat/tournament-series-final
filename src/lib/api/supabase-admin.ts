"use server"
import 'server-only'
import type { Team, Player, UUID } from '@/lib/types'
import { adminFetch } from '@/lib/api'

export async function insertTeam(input: Partial<Team>) {
  const res = await adminFetch('/teams', { method: 'POST', body: JSON.stringify(input) })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as Team
}

export async function updateTeamById(id: UUID, input: Partial<Team>) {
  const res = await adminFetch(`/teams/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as Team
}

export async function deleteTeamById(id: UUID) {
  const res = await adminFetch(`/teams/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}

export async function insertPlayer(input: Partial<Player>) {
  const res = await adminFetch('/players', { method: 'POST', body: JSON.stringify(input) })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { id: data.id, gamertag: data.gamertag, team_id: data.current_team_id ?? null } as Player
}

export async function updatePlayerById(id: UUID, input: Partial<Player>) {
  const res = await adminFetch(`/players/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { id: data.id, gamertag: data.gamertag, team_id: data.current_team_id ?? null } as Player
}

export async function deletePlayerById(id: UUID) {
  const res = await adminFetch(`/players/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}

export async function insertEvent(input: { name: string; start_date?: string }) {
  const res = await adminFetch('/events', { method: 'POST', body: JSON.stringify(input) })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function deleteEventById(id: UUID) {
  const res = await adminFetch(`/events/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}

export async function insertMatch(input: {
  event_id: UUID
  team_a_id: UUID
  team_b_id: UUID
  team_a_name?: string | null
  team_b_name?: string | null
  played_at?: string | null
}) {
  const res = await adminFetch('/matches', { method: 'POST', body: JSON.stringify(input) })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function deleteMatchById(id: UUID) {
  const res = await adminFetch(`/matches/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}


