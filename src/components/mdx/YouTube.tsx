export function YouTube({ id, title }: { id: string; title?: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border/60 tile aspect-video">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title || 'YouTube video player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}


