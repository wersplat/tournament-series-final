'use client'
import { usePathname, useRouter } from 'next/navigation'

export function SegmentedNav({ items }: { items: { label: string; href: string }[] }) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full glass">
      {items.map((it) => {
        const active = pathname === it.href
        return (
          <button
            key={it.href}
            onClick={() => router.push(it.href)}
            className={
              'px-3 py-1.5 text-sm rounded-full transition-colors ' +
              (active
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:text-foreground')
            }
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}


