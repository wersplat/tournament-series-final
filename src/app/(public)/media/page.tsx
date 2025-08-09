import { getMedia } from '@/lib/api/public'

export default async function MediaPage() {
  const media = await getMedia()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Media</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="tile p-4 focus-ring">
            <div className="font-medium">{m.title}</div>
            <div className="text-xs text-muted-foreground">{m.type}</div>
          </a>
        ))}
      </div>
    </div>
  )
}


