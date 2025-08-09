import Link from 'next/link'
import Image from 'next/image'
import { getMedia } from '@/lib/api/public'
import { listMediaPosts } from '@/lib/mdx'

export default async function MediaPage() {
  const [media, posts] = await Promise.all([getMedia(), listMediaPosts()])
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Media</h1>
      {posts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Articles</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/media/${p.slug}`} className="tile p-0 overflow-hidden focus-ring">
                {p.cover && (
                  <Image src={p.cover} alt={p.title} width={1200} height={630} className="h-40 w-full object-cover" />
                )}
                <div className="p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.date || ''}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Videos & Links</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="tile p-4 focus-ring">
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-muted-foreground">{m.type}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}


