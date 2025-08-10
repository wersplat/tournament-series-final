export type UUID = string

export interface Team {
  id: UUID
  name: string
  // Supabase does not store conference; keep optional for legacy usage
  conference?: 'East' | 'West' | null
  // Optional region metadata derived from Supabase if available
  region?: string | null
  logo_url?: string | null
  coach?: string | null
  org_handle?: string | null
  created_at?: string
}

export interface Player {
  id: UUID
  gamertag: string
  position?: 'Point Guard' | 'Shooting Guard' | 'Lock' | 'Power Forward' | 'Center' | null
  role?: string | null
  team_id?: UUID | null
  current_team_id?: UUID | null
  avatar_url?: string | null
  discord_id?: string | null
  twitter_id?: string | null
  player_badges?: string[] | null
  created_at?: string
}

export interface Match {
  id: UUID
  event_id?: UUID | null
  home_team_id: UUID
  away_team_id: UUID
  scheduled_at: string
  status: 'scheduled' | 'completed' | 'canceled' | 'review'
  result_json?: unknown
  vod_url?: string | null
  home_team_name?: string | null
  away_team_name?: string | null
}

export interface TeamRecentStat {
  match_id: UUID
  played_at?: string | null
  opponent_name?: string | null
  is_home?: boolean | null
  is_winner?: boolean | null
  points?: number | null
  assists?: number | null
  rebounds?: number | null
  steals?: number | null
  fgm?: number | null
  fga?: number | null
  three_points_made?: number | null
  three_points_attempted?: number | null
}

export interface Event {
  id: UUID
  name: string
  type?: string | null
  start_date: string
  end_date?: string | null
  location?: string | null
  bracket_url?: string | null
  banner_url?: string | null
  notes?: string | null
}

export interface Ranking {
  id: UUID
  scope: string
  entity_type: 'team' | 'player'
  entity_id: UUID
  rating: number
  rp?: number | null
  updated_at?: string
}

export interface Standing {
  id: UUID
  season: string
  conference: 'East' | 'West'
  team_id: UUID
  w: number
  l: number
  pd?: number | null
  updated_at?: string
}

export interface Submission {
  id: UUID
  submitter_id: UUID
  images: string[]
  ocr_json?: unknown
  status: 'pending' | 'approved' | 'rejected'
  notes?: string | null
  created_at?: string
}

export interface MediaItem {
  id: UUID
  title: string
  url: string
  type: 'video' | 'article' | 'image'
  published_at?: string
  team_id?: UUID | null
  player_id?: UUID | null
}

export interface Profile {
  id: UUID
  role: 'user' | 'admin' | 'league_staff'
  display_name?: string | null
  team_id?: UUID | null
  current_team_id?: UUID | null
  avatar_url?: string | null
}

export interface PlayerMatchStat {
  match_id: UUID
  played_at?: string | null
  team_name?: string | null
  is_winner?: boolean | null
  team_a_name?: string | null
  team_b_name?: string | null
  score_a?: number | null
  score_b?: number | null
  points?: number | null
  assists?: number | null
  rebounds?: number | null
  steals?: number | null
  fgm?: number | null
  fga?: number | null
  three_points_made?: number | null
  three_points_attempted?: number | null
}


