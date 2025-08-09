import Link from 'next/link'
import { listMediaPosts } from '@/lib/mdx'

export async function generateStaticParams() {
  const posts = await listMediaPosts()
  const authors = Array.from(new Set(posts.map((p) => p.author).filter(Boolean) as string[]))
  return authors.map((author) => ({ author }))
}

export default async function MediaAuthorPage({ params }: { params: { author: string } }) {
  const posts = (await listMediaPosts()).filter((p) => p.author === params.author)
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Author: {params.author}</h1>
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


