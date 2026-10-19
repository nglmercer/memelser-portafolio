# memelser Portfolio · Vue 3 + TypeScript + Cloudflare

Personal portfolio of **memelser / nglmercer** — web, desktop and multiplatform
developer from Perú. Same design as the original page: four tabbed sections
(home, projects, blog, about), ten locales, five themes, an interactive
Navier–Stokes vortex, a GitHub activity observatory, a project explorer and a
reading-list blog.

Deployed as a Cloudflare Worker via the [Void SDK](https://void.cloud/guide/quickstart).
Spanish docs live in [LEEME.md](LEEME.md).

## Stack

- **Vue 3 + TypeScript** (SFCs), **vue-router** (`?view=` / `?post=` URLs),
  **vue-i18n** (10 locales), **three** from npm
- **Vite + Void SDK** (`voidPlugin`), Cloudflare Workers target
- **GitHub data**: daily-synced snapshot — REST fetch → KV cache → bundled JSON fallback

## Layout

- `index.html` — mounts `#app`, loads `src/main.ts`
- `src/` — `App.vue`, `views/PortfolioView.vue`, `components/` (8 sections),
  `composables/` (theme, language, GitHub store, fluid scene, portrait tilt),
  `core/` (routing, i18n helpers, theme, activity ranges),
  `locales/` (per-module dictionaries merged in `translations.ts`),
  `three/` (`Fluid` solver, Burgers-vortex model), `router/`, `i18n/`, `types.ts`
- `routes/api/github.ts` — serves the KV snapshot, falls back to the bundle
- `crons/daily-github.ts` — 06:00 UTC refresh into KV (7-day TTL)
- `scripts/` — `sync-github-data.ts` CLI + `lib/github.ts` aggregation
  (preserves curated demo links, carries contribution history forward)
- `public/` — avatars, `project-frame.html` (repo preview, API-first),
  `github-data.json` (bundled fallback snapshot)
- `env.ts` — optional `GITHUB_TOKEN`, default `GITHUB_USER`

## Development

Requires Node.js ≥ 24.21.0.

```sh
npm ci
npm run dev        # http://localhost:5173 (or: bun run dev)
```

## GitHub data

```sh
GITHUB_TOKEN=ghp_... npm run github:sync   # refresh the bundled snapshot
void secret put GITHUB_TOKEN               # enable the automatic daily cron
npm run deploy                               # publish memelser-portfolio
```

Unauthenticated sync works (60 req/hour); a token raises it to 5,000/hour.
Daily contribution history is carried forward — the REST API cannot rebuild it.

> If `bun run dev` dies with `cron: Invalid job file` right after saving the
> cron file, just restart: Void's watcher read the file mid-save. Atomic save
> in your editor prevents it.

## Verification

```sh
npm test        # 5 suites: i18n, tabs, fluid, sync mapping, data consistency
npm run typecheck
npm run build
```
