export const runtime = 'edge'
import { apiFetch } from '@/lib/api'

export async function GET() {
  const res = await apiFetch('/views/player-performance?limit=100', {}, { tags: ['rankings'], revalidate: 60 })
  return new Response(res.body, {
    status: res.status,
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}


