export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-10">
      <div className="container py-8 text-xs text-muted-foreground flex flex-col gap-1">
        <div>© {new Date().getFullYear()} Unified Pro-Am: 2K26 Tournament Series</div>
        <div>
          Xbox theme accent: <span className="text-primary">#9BF00B</span> · PlayStation accent:{' '}
          <span className="text-primary" data-theme="playstation">
            #2a5fff
          </span>
        </div>
      </div>
    </footer>
  )
}


