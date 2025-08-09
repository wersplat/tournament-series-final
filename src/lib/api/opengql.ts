import type { Team } from '@/lib/types'

const URL = process.env.OPENGQL_URL
const TOKEN = process.env.OPENGQL_PERSISTED_TOKEN

async function persisted<T>(operationId: string, variables?: Record<string, unknown>) {
  if (!URL || !TOKEN) throw new Error('OpenGraphQL not configured')
  const res = await fetch(`${URL}?operationId=${operationId}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ variables }),
    next: { revalidate: 60 },
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data as T
}

export async function fetchTeamPageBundle(id: string) {
  return persisted<{ team: Team; players: unknown; matches: unknown }>('teamPageBundle', {
    id,
  })
}


