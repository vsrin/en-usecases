# CLAUDE.md — ElevateNow Insights

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## What this repo is

**ElevateNow Insights** — the publication arm of [elevatenow.tech](https://elevatenow.tech). A React + Vite site that hosts:

1. **Accelerator demoboards** — McKinsey-style HTML pre-reads, one per ElevateNow accelerator (Assure, Resolve, Redact, DataDNA, Semantic Hub, AI Catalog, AI Cockpit, AI Compliance Hub, Recipe Packs, Workbench).
2. **Field use cases** — long-form published analyses of real insurance operational problems, each exercising one or more accelerators.

The site design is an editorial register — paper-white, serif headlines, single accent (`#0066A1`), no dark mode. It is intentionally distinct from the dark, marketing-forward `elevatenow.tech` so the two surfaces can coexist when merged later (likely as `insights.elevatenow.tech` or `elevatenow.tech/insights`).

## Stack

- **React 19** + TypeScript + **Vite 7** + **Tailwind 4** (CSS-in-CSS via `@theme` in `src/index.css`)
- **React Router 7** — BrowserRouter
- **Framer Motion** (installed, sparingly used — editorial voice prefers stillness)
- **Google Fonts** — Source Serif 4 (headings), Inter (body), JetBrains Mono (meta)
- No test framework. Validation is manual: `npm run lint` + `npx tsc --noEmit` + `npm run build`.

## Architecture

### Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | `HomePage.tsx` | Editorial landing — cover, market shift, architecture shift, 5-layer stack, product catalog, featured usecases, engagement close |
| `/products` | `ProductsPage.tsx` | Full accelerator catalog, grouped by layer |
| `/product/:slug` | `ProductPage.tsx` | Product hero + embedded demoboard (iframed) + linked use cases + sibling products |
| `/usecases` | `UsecaseLibraryPage.tsx` | Use case library, filter by product (primary) + LOB (secondary) |
| `/use-case/:slug` | `UseCaseDetailPage.tsx` | Legacy HTML use case rendered in iframe with McKinsey override |

### Data model (two first-class entities)

- **Products** (`src/data/products.ts` + `src/types/product.ts`) — the ~10 accelerators. Each product has `slug`, `name`, `wordmark`, `tagline`, `layer`, `status`, `metrics[]`, `summary`, `demoboardPath`, and `useCaseSlugs[]`.
- **Use cases** (`src/data/usecases.ts` + `src/types/usecase.ts`) — field publications. Each has `slug`, `title`, `subtitle`, `category` (LOB), `tags[]`, `htmlPath`, `keyQuestion`, `summary`. Product linkage is declared from the product side via `useCaseSlugs`.

### File locations

- **Demoboards** live at `public/demoboards/<slug>.html` — standalone self-contained HTML artifacts. The `ProductPage` iframes them with auto-height sizing.
- **Legacy use cases** live at `public/usecases/<filename>.html` — standalone HTML. The `UseCaseHtmlViewer` iframes them and injects a McKinsey-theme override stylesheet to normalize fonts, colors, and layout across files authored at different times.

### Style tokens (locked in `src/index.css`)

```
ink     #0A0A0A    paper    #FFFFFF    accent      #0066A1
ink-2   #1F1F1F    paper-2  #F5F5F3    accent-2    #004A75
ink-3   #3D3D3D    paper-3  #EDEDEA    accent-soft #E5EEF4
ink-4   #6B6B6B    rule     #D8D8D8
ink-5   #9A9A9A    rule-2   #E8E8E8
```

Fonts: `--font-serif` (Source Serif 4), `--font-sans` (Inter), `--font-mono` (JetBrains Mono).

### Brand conventions

- Top-left always: `[EN-Blue.png] ELEVATENOW · INSIGHTS`
- Wordmark: `ELEVATENOW` all-caps, JetBrains Mono, letter-spaced 0.12em
- Footer mono meta line: `© YYYY Elevatenow · Insurance Intelligence Platform · Confidential`
- Single accent color only. No secondary accents. LOBs differentiate by typography + position, not color.

## Build & dev commands

```bash
npm run dev       # Vite dev server → localhost:5173
npm run build     # tsc -b && vite build → dist/
npm run lint      # ESLint
npm run preview   # Preview production build
npx tsc --noEmit  # Type check only
```

**Pre-push checklist:** `npx tsc --noEmit` passes → `npm run build` green → `git status` clean → push.

## Deployment

Cloudflare Pages auto-deploys on push to `main` at `github.com/vsrin/en-usecases`. `public/_redirects` handles SPA routing.

---

# Creating new demoboards — the `mckinsey-demoboard` skill

A **user-scoped Claude Code skill** for producing McKinsey-style demoboards is bundled with this repo. The skill encodes both the thinking discipline (pyramid principle, MECE, assertion-style headlines, "so what" per exhibit) and the visual register (monochrome + single accent, serif heads + mono meta, exhibit-per-page).

## Where the skill lives in this repo

```
.claude/
└── skills/
    ├── mckinsey-demoboard.skill         ← portable zip (single-file install)
    └── mckinsey-demoboard/              ← extracted files (direct use)
        ├── SKILL.md
        ├── assets/
        │   └── template.html            ← starting HTML with McKinsey theme
        └── references/
            ├── structure.md             ← page-by-page scaffold
            ├── style_system.md          ← visual spec (colors, fonts, spacing)
            ├── exhibit_patterns.md      ← exhibit type library (2×2, MECE, etc.)
            └── svg_patterns.md          ← inline-SVG skeletons per exhibit type
```

## How to use the skill

**Inside this repo with Claude Code:** the skill should already be discoverable because it lives under `.claude/skills/`. Invoke it by describing the request:

> "Build a demoboard for Resolve — entity resolution — aimed at a CDO at a mid-size carrier. Primary hook: MDM done right starts before implementation. Accent color: #0066A1."

The skill runs a 6-step workflow:

1. **Gather context** — product, named recipient, meeting context, the one hook, accent color.
2. **Draft the argument** — assertion-style page headlines before any HTML.
3. **Choose 4–6 exhibits, one per page** — every exhibit has a label and a "so what" note.
4. **Build the HTML** — start from `assets/template.html`, do not invent new style variables.
5. **Write SVG exhibits inline** — use `references/svg_patterns.md` skeletons. Every exhibit has a source caption.
6. **Run the final checklist** — assertion headlines, numbered exec-summary takeaways, exhibits load the argument, not the body text.

**To install the skill on another machine:**
```bash
claude skills install /path/to/this/repo/.claude/skills/mckinsey-demoboard.skill
```

Or copy the extracted folder into `~/.claude/skills/` to make it user-scoped globally.

## Where demoboards go when built

Output a single-file `.html` (self-contained — Google Fonts CDN is the only external dependency) to `public/demoboards/<product-slug>.html`.

Then wire it in `src/data/products.ts` on the corresponding product entry:

```ts
{
  slug: 'resolve',
  // ...
  demoboardPath: 'demoboards/resolve.html',
  demoboardVariant: 'Pre-read for <customer>',  // optional — shows on hero if customer-specific
  useCaseSlugs: ['mdm-pre-assessment', 'mdm-lite'],
}
```

That's it — `/product/resolve` now serves the demoboard inline with auto-height iframe. No additional code changes needed.

## Adding a new use case

1. Drop the HTML file at `public/usecases/<name>.html` (authored per existing patterns — the runtime injects the McKinsey theme override automatically).
2. Register it in `src/data/usecases.ts` with a slug, title, category, tags, key question, summary, and `htmlPath: '<name>.html'`.
3. Link it to products by adding the slug to the relevant `useCaseSlugs[]` arrays in `src/data/products.ts`.

The McKinsey override sheet in `src/components/usecases/UseCaseHtmlViewer.tsx` normalizes any use case HTML into the editorial register at render time — source files do not need retheming.

## Do not

- Introduce secondary accent colors. One accent only (`#0066A1`).
- Add dark mode. The site is paper-white by design — this is the editorial differentiation from `elevatenow.tech`.
- Hardcode dark navy or other brand colors into use case HTML files — the override can't always untangle them.
- Author new demoboards outside the skill template. The discipline + visual register together are the value prop.
