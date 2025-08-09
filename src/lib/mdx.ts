import fs from 'node:fs/promises'
import path from 'node:path'

export type MediaMeta = {
  title: string
  description?: string
  date?: string
  author?: string
  cover?: string
  tags?: string[]
  slug: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'media')

export async function listMediaPosts(): Promise<MediaMeta[]> {
  const files = await fs.readdir(CONTENT_DIR).catch(() => [])
  const mdxFiles = files.filter((f) => f.endsWith('.mdx'))
  const metas: MediaMeta[] = []
  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, '')
    const full = path.join(CONTENT_DIR, file)
    const raw = await fs.readFile(full, 'utf8')
    const fm = /---([\s\S]*?)---/.exec(raw)?.[1] || ''
    const pick = (k: string) => new RegExp(`^${k}:\s*"?([^"\n]+)"?`, 'm').exec(fm)?.[1]
    const title = pick('title')
    const date = pick('date')
    const author = pick('author')
    const cover = pick('cover')
    const tags = /tags:\s*\[(.*?)\]/.exec(fm)?.[1]?.split(',').map((s) => s.trim().replace(/^"|"$/g, ''))
    metas.push({ slug, title: title || slug, date, author, cover, tags })
  }
  return metas.sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : 0))
}


