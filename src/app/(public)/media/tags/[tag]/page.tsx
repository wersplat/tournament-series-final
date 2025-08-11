import Link from 'next/link'
import { listMediaPosts } from '@/lib/mdx'
import { Card, CardContent } from '@/components/ui/card'

export async function generateStaticParams() {
  const posts = await listMediaPosts()
  const tags = new Set<string>()
  posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)))
  return Array.from(tags).map((tag) => ({ tag }))
}

type Params = Promise<{ tag: string }>

export default async function MediaTagPage({ params }: { params: Params }) {
  const { tag } = await params
  const posts = (await listMediaPosts()).filter((p) => (p.tags || []).includes(tag))
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Tag: {tag}</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/media/${p.slug}`} className="focus-ring">
            <Card>
              <CardContent>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.date || ''}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


