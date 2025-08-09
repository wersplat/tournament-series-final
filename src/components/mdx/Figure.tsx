import Image from 'next/image'

export function Figure({ src, alt, caption, width = 1280, height = 720 }: { src: string; alt: string; caption?: string; width?: number; height?: number }) {
  return (
    <figure className="space-y-2">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-xl border border-border/60"
      />
      {caption && <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}


