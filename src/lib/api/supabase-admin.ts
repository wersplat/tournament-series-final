'use server'
import 'server-only'
import type { Team, Player, UUID } from '@/lib/types'
import { createServerSupabase } from '@/lib/supabase/server'

export async function insertTeam(input: Partial<Team>) {
  const client = createServerSupabase()
  const { data, error } = await client.from('teams').insert({
    name: input.name,
    logo_url: input.logo_url ?? null,
    region_id: null,
  }).select('*').single()
  if (error) throw error
  return data as Team
}

export async function updateTeamById(id: UUID, input: Partial<Team>) {
  const client = createServerSupabase()
  const { data, error } = await client.from('teams').update({
    name: input.name,
    logo_url: input.logo_url ?? null,
  }).eq('id', id).select('*').single()
  if (error) throw error
  return data as Team
}

export async function deleteTeamById(id: UUID) {
  const client = createServerSupabase()
  const { error } = await client.from('teams').delete().eq('id', id)
  if (error) throw error
}

export async function insertPlayer(input: Partial<Player>) {
  const client = createServerSupabase()
  const { data, error } = await client.from('players').insert({
    gamertag: input.gamertag,
    current_team_id: input.team_id ?? null,
  }).select('*').single()
  if (error) throw error
  // map current_team_id -> team_id for UI compatibility
  return { id: data.id, gamertag: data.gamertag, team_id: data.current_team_id ?? null } as Player
}

export async function updatePlayerById(id: UUID, input: Partial<Player>) {
  const client = createServerSupabase()
  const { data, error } = await client.from('players').update({
    gamertag: input.gamertag,
    current_team_id: input.team_id ?? null,
  }).eq('id', id).select('*').single()
  if (error) throw error
  return { id: data.id, gamertag: data.gamertag, team_id: data.current_team_id ?? null } as Player
}

export async function deletePlayerById(id: UUID) {
  const client = createServerSupabase()
  const { error } = await client.from('players').delete().eq('id', id)
  if (error) throw error
}

export async function insertEvent(input: { name: string; start_date?: string }) {
  const client = createServerSupabase()
  const { data, error } = await client.from('events').insert({
    name: input.name,
    start_date: input.start_date ?? null,
    status: 'upcoming',
  }).select('*').single()
  if (error) throw error
  return data
}

export async function deleteEventById(id: UUID) {
  const client = createServerSupabase()
  const { error } = await client.from('events').delete().eq('id', id)
  if (error) throw error
}

export async function insertMatch(input: {
  event_id: UUID
  team_a_id: UUID
  team_b_id: UUID
  team_a_name?: string | null
  team_b_name?: string | null
  played_at?: string | null
}) {
  const client = createServerSupabase()
  const { data, error } = await client.from('matches').insert({
    event_id: input.event_id,
    team_a_id: input.team_a_id,
    team_b_id: input.team_b_id,
    team_a_name: input.team_a_name ?? null,
    team_b_name: input.team_b_name ?? null,
    played_at: input.played_at ?? null,
  }).select('*').single()
  if (error) throw error
  return data
}

export async function deleteMatchById(id: UUID) {
  const client = createServerSupabase()
  const { error } = await client.from('matches').delete().eq('id', id)
  if (error) throw error
}


