import { z } from 'zod'

export const playerSchema = z.object({
  gamertag: z.string().min(2),
  role: z.string().optional().nullable(),
  team_id: z.string().uuid().optional().nullable(),
  country: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
})

export type PlayerInput = z.infer<typeof playerSchema>


