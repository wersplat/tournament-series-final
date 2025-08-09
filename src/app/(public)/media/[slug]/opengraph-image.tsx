import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), 'content', 'media', `${params.slug}.mdx`)
  const source = await fs.readFile(file, 'utf8').catch(() => null)
  const title = source ? (matter(source).data.title as string) : params.slug
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0b0c',
          color: 'white',
          fontSize: 64,
          padding: 80,
        }}
      >
        <div style={{ border: '4px solid #9BF00B', borderRadius: 24, padding: 40 }}>{title}</div>
      </div>
    ),
    size,
  )
}


