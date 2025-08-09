'use client'
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <pre className="text-xs text-muted-foreground">{error.message}</pre>
      <button className="h-9 px-3 rounded-md bg-primary text-primary-foreground" onClick={() => reset()}>Try again</button>
    </div>
  )
}


