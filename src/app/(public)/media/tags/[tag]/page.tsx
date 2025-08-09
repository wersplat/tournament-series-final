import Link from 'next/link'
import { listMediaPosts } from '@/lib/mdx'

export async function generateStaticParams() {
  const posts = await listMediaPosts()
  const tags = new Set<string>()
  posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)))
  return Array.from(tags).map((tag) => ({ tag }))
}

export default async function MediaTagPage({ params }: { params: { tag: string } }) {
  const posts = (await listMediaPosts()).filter((p) => (p.tags || []).includes(params.tag))
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Tag: {params.tag}</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/media/${p.slug}`} className="tile p-4 focus-ring">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-muted-foreground">{p.date || ''}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


