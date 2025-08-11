'use server'
import { revalidateTag } from 'next/cache'
import { adminFetch } from '@/lib/api'

export async function createMatch(input: any) {
  const res = await adminFetch('/matches', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await res.text())

  revalidateTag('rankings')
  revalidateTag('schedule')
  return res.json()
}


