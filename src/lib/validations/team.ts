import { z } from 'zod'

export const teamSchema = z.object({
  name: z.string().min(2),
  conference: z.enum(['East', 'West']),
  coach: z.string().optional().nullable(),
  org_handle: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
})

export type TeamInput = z.infer<typeof teamSchema>


