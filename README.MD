## 2K26 Tournament Series — Web App

Production-ready Next.js 14 (App Router) app for the 2K26 Tournament Series.

### Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (+ @tailwindcss/typography) + **shadcn/ui style primitives** + **lucide-react**
- **Supabase JS v2** with SSR helpers (`@supabase/ssr`) for Auth + DB
- **Zod**, **React Hook Form**, **TanStack Query** (patterns ready), **date-fns**
- **MDX** authoring for Media (runtime via `next-mdx-remote` + `gray-matter`)
- Motion via **framer-motion** (minimal placeholders)

### Architecture Overview

- **Public READs**: Public TS API (REST / optional `pg_graphql`) accessed via typed adapter in `src/lib/api/public.ts` with cache tags.
- **Privileged WRITEs**: Admin Python API (REST, service role) via `src/lib/api/admin.ts` (server-only). RBAC enforced with Supabase Profiles `role` field.
- **Optional composition layer**: OpenGraphQL persisted operations via `src/lib/api/opengql.ts`.
- **RLS-first**: Server components by default. Client components where user interaction is required.

### Requirements

- Node 18+ (Node 20+ recommended)
- pnpm 9+

### Quick Start

```bash
pnpm install
cp .env.example .env.local
# edit .env.local (see Environment Variables)
pnpm dev
```

App runs at `http://localhost:3000`.

### Environment Variables

Copy `.env.example` to `.env.local` and set:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Primary API endpoints
PUBLIC_API_BASE_URL=
ADMIN_API_BASE_URL=

# Optional composition layer
OPENGQL_URL=
OPENGQL_PERSISTED_TOKEN=

# Optional pg_graphql (direct read helper)
PG_GRAPHQL_URL=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

If `PUBLIC_API_BASE_URL`/`ADMIN_API_BASE_URL` are empty, public/admin adapters return safe mock data so pages still render locally.

### Supabase Setup

1) Create a Supabase project; copy the Project URL and anon key to env.
2) Auth -> URL configuration: add `http://localhost:3000/login` and `http://localhost:3000` as Site URL.
3) OAuth providers (optional now / recommended for prod): enable Google, Discord, and X/Twitter in Supabase; they redirect back to `/login`.
4) Profiles table must include `role` with values `user|admin`. To grant admin to a user, set `profiles.role = 'admin'` for that user’s `user_id`.

Auth routes implemented:

- POST `/auth/signin/email` (magic link)
- POST `/auth/signin/oauth` (provider=`google|discord|twitter`)
- POST `/auth/signout`

### Admin RBAC

- `src/middleware.ts` gates `/admin/*`. If no session or role != `admin`, users are redirected to `/login?next=/admin/...`.
- Helper `requireAdmin()` is used in admin pages to short-circuit rendering on the server.

### Data Adapters

- `src/lib/api/public.ts`: `getTeams`, `getPlayers`, `getStandings`, `getSchedule`, `getMedia`, `getTeamProfile`, `getPlayerProfile`
  - Adds Next cache tags and `revalidate` hints; includes optional `queryGraphQL()` when `PG_GRAPHQL_URL` is set.
- `src/lib/api/admin.ts` (server-only): `createEvent`, `updateTeam`, `getReviewQueue`, `approveSubmission`, `rejectSubmission`
- `src/lib/api/opengql.ts` (optional): persisted operations `fetchTeamPageBundle()` when `OPENGQL_URL` + token are set.

### MDX Publishing (Media)

- Place posts at `content/media/*.mdx` with frontmatter:

```md
---
title: "Week 1 Recap"
description: "Highlights and storylines from kickoff week"
date: "2026-01-07"
author: "UPA Editorial"
cover: "/media/covers/week1.jpg"   # place the image under public/media/covers
tags: [recap, highlights]
---

<Callout variant="success">Great opening week! Key storylines below.</Callout>

<YouTube id="dQw4w9WgXcQ" title="Highlights" />

<Figure src="/brand/logo.svg" alt="Logo" caption="Series banner" />
```

- MDX components available in posts:
  - `<Callout variant="info|success|warning|danger">` … `</Callout>`
  - `<YouTube id="..." title="..." />`
  - `<Figure src="/..." alt="..." caption="..." />`

- Media routes:
  - Index: `/media` (lists MDX Articles with cover + API-based videos/links)
  - Article: `/media/[slug]`
  - Tags: `/media/tags/[tag]`
  - Authors: `/media/authors/[author]`
  - Open Graph image: `/media/[slug]/opengraph-image` (generated from frontmatter)

### Theming

- Xbox Dark (default): near-black surfaces with neon-green accent `#9BF00B`.
- PlayStation Dark (alt): deep blue accent `#2a5fff`.
- Toggle via `ThemeToggle` (switches `data-theme` attribute). Tokens are CSS variables in `src/app/globals.css` and consumed by Tailwind.
- Tiles use a glass/blur aesthetic; focus rings are high-contrast and keyboard-accessible.

### UI Components

- Minimal shadcn-like primitives in `src/components/ui/*`:
  - `button`, `input`, `badge`, `card`, `select`, `tabs`, `table` (add more with `pnpm shadcn:add` if you bring shadcn generator)
- `Button` supports `asChild` via Radix `Slot`.
- Higher-level building blocks under `src/components/core/*` (header, footer, DataTable, ThemeToggle, SegmentedNav).

### Routing & Pages (high-level)

- Public: `/` (Landing), `/login`, `/about`, `/schedule`, `/rankings`, `/teams`, `/teams/[id]`, `/players`, `/players/[id]`, `/standings`, `/media`
- Admin (RBAC): `/admin`, `/admin/events`, `/admin/players`, `/admin/teams`, `/admin/matches`, `/admin/media`, `/admin/review`, `/admin/review/[id]`

### Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "shadcn:add": "shadcn add",
  "generate:icons": "lucide-icons --out src/components/icons",
  "prepare": "echo 'ready'"
}
```

### Deploy

- **Vercel**: push repo and set env vars in the project. Ensure the `NEXT_PUBLIC_SITE_URL` matches your domain. OG image route uses Node runtime.
- **Railway**: build with `pnpm build` and run `pnpm start`. Set env vars in the service.
- **Static assets via Cloudflare Pages**: If you split static hosting, make sure images under `public/` are deployed along with the app or served by your CDN.

### Notes & Tips

- If you see Supabase env errors locally, ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. For completely offline dev, you can set dummy values.
- Public adapters use mock data when `PUBLIC_API_BASE_URL` is not set, so content pages remain interactive.
- To make a user admin: update the `profiles` row for the `user_id` and set `role = 'admin'`.

### Roadmap (optional additions)

- DataTable with full server-side pagination/sorting
- More shadcn components (dialog, dropdown, toast)
- Tag chips and authors directory pages
- OpenSearch sitemap + RSS/Atom for Media
