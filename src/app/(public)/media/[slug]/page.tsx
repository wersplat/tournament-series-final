import { notFound } from 'next/navigation'
import { listMediaPosts } from '@/lib/mdx'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Callout } from '@/components/mdx/Callout'
import { YouTube } from '@/components/mdx/YouTube'
import { Figure } from '@/components/mdx/Figure'

export async function generateStaticParams() {
  const posts = await listMediaPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

type Params = Promise<{ slug: string }>

export default async function MediaArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const file = path.join(process.cwd(), 'content', 'media', `${slug}.mdx`)
  try {
    const source = await fs.readFile(file, 'utf8')
    const { content, data } = matter(source)
    const meta = data as any
    return (
      <article className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{meta.title || slug}</h1>
          {meta.date && <div className="text-xs text-muted-foreground">{meta.date}</div>}
          {meta.author && (
            <div className="text-xs text-muted-foreground">
              By <a className="underline" href={`/media/authors/${meta.author}`}>{meta.author}</a>
              {Array.isArray(meta.tags) && meta.tags.length > 0 && (
                <>
                  {' '}•{' '}
                  {meta.tags.map((t: string, i: number) => (
                    <a key={t} className="underline" href={`/media/tags/${t}`}>
                      {t}
                      {i < meta.tags.length - 1 ? ', ' : ''}
                    </a>
                  ))}
                </>
              )}
            </div>
          )}
        </header>
        <div className="prose-base">
          <MDXRemote
            source={content}
            components={{ Callout, YouTube, Figure }}
            options={{ mdxOptions: { remarkPlugins: [] } }}
          />
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}


