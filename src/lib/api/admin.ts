'use server'
import 'server-only'
import type { Event, Submission, Team } from '@/lib/types'

const BASE_URL = process.env.ADMIN_API_BASE_URL
const ADMIN_API_KEY = process.env.ADMIN_API_KEY

async function fetchAdmin<T>(path: string, init?: any): Promise<T> {
  if (!BASE_URL) return mockAdmin<T>(path, init)
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-admin-api-key': ADMIN_API_KEY || '',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Admin API error ${res.status}`)
  return (await res.json()) as T
}

async function mockAdmin<T>(path: string, init?: any): Promise<T> {
  if (path.startsWith('/submissions')) {
    const queue: Submission[] = [
      {
        id: 'sub1',
        submitter_id: 'u1',
        images: ['/brand/logo.svg'],
        ocr_json: { score: 102 },
        status: 'pending',
        notes: null,
      },
    ]
    return queue as unknown as T
  }
  if (path.startsWith('/events') && init?.method === 'POST') {
    return JSON.parse(init!.body as string) as T
  }
  return {} as T
}

export async function createEvent(input: Partial<Event>) {
  return fetchAdmin<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateTeam(id: string, input: Partial<Team>) {
  return fetchAdmin<Team>(`/teams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function getReviewQueue() {
  return fetchAdmin<Submission[]>('/submissions?status=pending')
}

export async function getSubmission(id: string) {
  const list = await getReviewQueue()
  return list.find((s) => s.id === id) || null
}

export async function approveSubmission(id: string) {
  return fetchAdmin(`/submissions/${id}/approve`, { method: 'POST' })
}

export async function rejectSubmission(id: string, reason: string) {
  return fetchAdmin(`/submissions/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}


