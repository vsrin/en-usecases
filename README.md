# ElevateNow Insights

The publication arm of [**elevatenow.tech**](https://elevatenow.tech) — a React site that hosts McKinsey-style **accelerator demoboards** and long-form **field use cases** from the governed intelligence layer for insurance.

**Live:** Cloudflare Pages auto-deploys from `main`.

---

## What's here

- **~10 accelerators** (Assure, Redact, DataDNA, Resolve, Semantic Hub, AI Catalog, AI Cockpit, AI Compliance Hub, Recipe Packs, Workbench) — each with a product page that hosts its demoboard and linked use cases.
- **~10 field use cases** — Data Quality Certification, Submission Intake, FNOL, Loss Run Intelligence, Proactive Audit, Public Sector UW, Cohort Analysis, MDM Pre-Assessment, MDM Lite, WC FNOL.
- **McKinsey editorial register** — paper white, serif headlines (Source Serif 4), single accent (`#0066A1`), mono meta (JetBrains Mono), exhibit-per-page.

---

## Quick start

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # → dist/
npx tsc --noEmit  # type check
```

---

## Site map

| URL | Purpose |
|---|---|
| `/` | Landing — market shift, architecture shift, the 5-layer stack, product catalog, featured use cases |
| `/products` | Full accelerator catalog |
| `/product/:slug` | Product hero + embedded demoboard + linked use cases |
| `/usecases` | Use case library — filter by product or LOB |
| `/use-case/:slug` | Individual published use case |

---

## Project layout

```
elevatenow-usecases/
├── public/
│   ├── demoboards/              ← accelerator demoboards (single-file HTML)
│   │   └── assure.html
│   ├── usecases/                ← legacy use case HTML files
│   │   ├── data-quality-certification.html
│   │   └── …
│   └── EN-Blue.png              ← logo for top-left
├── src/
│   ├── App.tsx                  ← router + layout shell
│   ├── index.css                ← theme tokens (McKinsey palette)
│   ├── types/
│   │   ├── product.ts
│   │   └── usecase.ts
│   ├── data/
│   │   ├── products.ts          ← accelerator catalog + product→usecase links
│   │   └── usecases.ts          ← field publication registry
│   ├── components/
│   │   ├── layout/              ← Navbar, Footer
│   │   ├── ui/                  ← CategoryBadge, StatusIndicator
│   │   └── usecases/            ← UseCaseTile, UseCaseHtmlViewer, ContactSection
│   └── pages/
│       ├── HomePage.tsx
│       ├── ProductsPage.tsx
│       ├── ProductPage.tsx
│       ├── UsecaseLibraryPage.tsx
│       └── UseCaseDetailPage.tsx
├── .claude/
│   └── skills/
│       ├── mckinsey-demoboard.skill   ← portable skill zip
│       └── mckinsey-demoboard/        ← extracted skill (direct use)
├── CLAUDE.md                    ← working guide for Claude Code
└── README.md
```

---

## Creating a new demoboard — use the bundled skill

This repo ships a **Claude Code skill** that produces McKinsey-style demoboards. The skill encodes both the thinking discipline (pyramid principle, MECE, assertion-style headlines) and the visual register (paper + single accent, serif heads + mono meta, one exhibit per page).

### Using the skill with Claude Code

Inside this repo, the skill is auto-discovered under `.claude/skills/mckinsey-demoboard/`. Invoke by describing the request:

> *"Build a demoboard for Resolve — entity resolution — aimed at a CDO at a mid-size carrier. The one hook: MDM done right starts before implementation. Accent: #0066A1."*

The skill will:
1. Confirm product, named recipient, meeting context, the one hook, and accent color.
2. Draft the argument as assertion-style page headlines before writing any HTML.
3. Choose 4–6 exhibits, each with a "so what" note.
4. Build the HTML from `assets/template.html`.
5. Generate inline SVG exhibits using the patterns in `references/svg_patterns.md`.
6. Run a final checklist.

Output should land at `public/demoboards/<slug>.html`. Then wire the product entry:

```ts
// src/data/products.ts
{
  slug: 'resolve',
  demoboardPath: 'demoboards/resolve.html',
  // ...
}
```

Visit `/product/resolve` — the demoboard now renders inline with auto-height iframe.

### Installing the skill on another machine

```bash
# Option 1 — from the portable zip
claude skills install ./.claude/skills/mckinsey-demoboard.skill

# Option 2 — copy extracted folder into the user-scoped skills dir
cp -R .claude/skills/mckinsey-demoboard ~/.claude/skills/
```

### What's inside the skill

```
.claude/skills/mckinsey-demoboard/
├── SKILL.md                       ← the 6-step workflow
├── assets/
│   └── template.html              ← copy-paste starting HTML (McKinsey theme pre-applied)
└── references/
    ├── structure.md               ← page-by-page scaffold (cover, exec summary, problem, …)
    ├── style_system.md            ← colors, fonts, spacing, border rules
    ├── exhibit_patterns.md        ← when to use which exhibit type
    └── svg_patterns.md            ← copy-pasteable SVG skeletons (2×2, MECE, waterfall, timeline, …)
```

---

## Adding a new use case

1. Drop the HTML at `public/usecases/<name>.html` (the runtime injects the McKinsey theme override automatically — no retheming needed).
2. Register in `src/data/usecases.ts`:
   ```ts
   {
     id: 'your-usecase',
     slug: 'your-usecase',
     title: 'Assertion-style title…',
     subtitle: 'Supporting argument…',
     category: 'underwriting',  // underwriting | claims | actuarial | compliance | operations | distribution
     tags: [...],
     status: 'published',
     publishedAt: '2026-04-21',
     estimatedReadMin: 12,
     detailType: 'html',
     htmlPath: 'your-usecase.html',
     keyQuestion: '…',
     summary: '…',
   }
   ```
3. Link to one or more products in `src/data/products.ts` by adding the slug to the relevant `useCaseSlugs[]`.

---

## Design conventions (short version)

- **One accent color only** — `#0066A1`. LOBs, statuses, and categories all differentiate by **typography and position**, never by competing colors.
- **Serif for heads, sans for body, mono for meta**. No exceptions.
- **Assertion headlines** — titles must complete a sentence. Topic labels are banned.
- **Exhibit-per-page** on demoboards. Every exhibit has a "so what" note.
- **Editorial, not marketing** — prefer a dense paragraph that earns its place to three bulleted slogans.

Full working guide in [`CLAUDE.md`](./CLAUDE.md).

---

## Relationship to elevatenow.tech

ElevateNow Insights is the **publication arm** of the company. The brand lives at [elevatenow.tech](https://elevatenow.tech) — product positioning, team, contact. Insights hosts the long-form artifacts — demoboards, field use cases, research. Both surfaces share the same brand, logo, and contact footer but use different chrome on purpose (dark marketing vs. paper editorial), in the McKinsey / McKinsey Insights pattern.

Eventually Insights may move under `insights.elevatenow.tech` or `elevatenow.tech/insights`. The McKinsey chrome drops in cleanly under the parent brand without retheming.

---

## Contact

**[gps@elevatenow.tech](mailto:gps@elevatenow.tech)** · [elevatenow.tech](https://elevatenow.tech)
