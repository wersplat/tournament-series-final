import { z } from 'zod'

export const eventSchema = z.object({
  name: z.string().min(2),
  type: z.string().optional().nullable(),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  bracket_url: z.string().url().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type EventInput = z.infer<typeof eventSchema>


