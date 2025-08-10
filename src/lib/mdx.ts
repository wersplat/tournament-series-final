import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

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
    const { data } = matter(raw)

    const title = typeof data.title === 'string' && data.title.trim().length > 0 ? (data.title as string).trim() : slug
    const date = typeof data.date === 'string' ? (data.date as string) : undefined
    const author = typeof data.author === 'string' ? (data.author as string) : undefined
    const coverRaw = typeof data.cover === 'string' ? (data.cover as string) : undefined
    const trimmedCover = coverRaw ? coverRaw.trim() : undefined
    const cover = trimmedCover && (trimmedCover.startsWith('/') || trimmedCover.startsWith('http://') || trimmedCover.startsWith('https://')) ? trimmedCover : undefined
    const tags = Array.isArray(data.tags) ? (data.tags as string[]).map((t) => String(t)) : undefined

    metas.push({ slug, title, date, author, cover, tags })
  }
  return metas.sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : 0))
}


