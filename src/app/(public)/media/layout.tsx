import type { ReactNode } from 'react'

export default function MediaLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export const revalidate = 120


