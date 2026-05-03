# Use Case Research & Publishing Guide

Use this when adding a new use case to `insights.elevatenow.tech`. Covers the research approach, content structure, HTML format, and the publishing workflow in the `elevatenow-usecases` repo.

## The Site and Its Voice

insights.elevatenow.tech is a practitioner research publication — not a sales site. The reader is a senior underwriter, claims director, or data leader who has seen a lot of AI pitches and is deeply skeptical of hype. Write for them.

We publish the real problem, why it persists structurally, and what a correct architecture looks like conceptually. We don't give away implementation blueprints, proprietary configurations, or anything that lets someone replicate the solution without us. The framing is: come understand the problem; call us if you want the solution.

---

## The Ten Published Domains

Each use case belongs to one of four categories:

| Category | `data-category` value | CSS tag class |
|---|---|---|
| Underwriting | `underwriting` | `tag-uw` |
| Claims | `claims` | `tag-claims` |
| Operations & Compliance | `operations` | `tag-ops` |
| Actuarial | `actuarial` | `tag-act` |

Current count: **10 published** (3 UW / 2 Claims / 4 Ops / 1 Actuarial).

---

## Step 1 — Research the Use Case

Before writing anything, establish:

### 1a. The Real Problem (Practitioner Framing)
- What specific operational failure exists today?
- What does it cost in time, dollars, or quality?
- What does the industry typically do wrong when addressing it?
- What is the prevailing assumption that needs challenging?

### 1b. The Key Question
A single provocative question a practitioner would ask. This becomes the hero text on the card and the hook at the top of the HTML page.

**Good example:**
> "Underwriters spend 60–70% of their time on triage work that doesn't require underwriting judgment. What if Fast NOs were as fast as Fast YESes — and both happened in minutes?"

**Bad example (too generic):**
> "How can AI improve the underwriting process?"

### 1c. The What / Why / How Framework
Structure the analysis around three questions:
- **What** — What is the use case? What problem does it solve? What does the output look like?
- **Why** — Why does this problem exist? Why do current approaches fail? Why does this matter to a carrier / MGA?
- **How (without blueprints)** — What type of architecture solves it? What principles govern the approach? What are the key design decisions and why?

### 1d. The Outcome Claim
What measurable or observable difference does a well-built solution create? Anchor to real numbers where they exist (e.g., "3-29 day quote cycles → same-day decisions"). Never fabricate specifics.

### 1e. Tags (3–6 terms)
Specific, practitioner-meaningful terms. Not generic ("AI", "automation"). Examples: `Submission Triage`, `Jurisdiction Rules`, `Subrogation`, `Loss Triangles`, `FNOL Processing`, `Entity Resolution`, `Coverage Gap Analysis`.

---

## Step 2 — Register the Use Case in usecases.ts

**File:** `src/data/usecases.ts`

Add a new entry to the `usecases` array. All fields are required:

```typescript
{
  id: 'kebab-case-unique-id',           // e.g. 'renewal-triage'
  slug: 'kebab-case-unique-id',         // same as id
  title: 'Provocative headline',        // short, punchy, problem-focused
  subtitle: 'Clarifying subtitle',      // what the solution enables
  category: 'underwriting',            // underwriting | claims | operations | actuarial
  tags: [
    'Tag One',
    'Tag Two',
    'Tag Three',
  ],
  status: 'published',                 // always 'published' for live cases
  publishedAt: '2026-MM-DD',           // today's date
  estimatedReadMin: 12,                // honest estimate based on word count (~200 wpm)
  detailType: 'html',                  // always 'html' for standalone pages
  htmlPath: 'MyUseCaseName.html',      // filename in public/usecases/ — PascalCase preferred
  keyQuestion: 'The single provocative question that opens the case. Write for a practitioner who has seen a lot. One or two sentences.',
  summary: 'Two to three sentences. What problem exists, how it persists, what a correct solution architecture enables. No superlatives. No "revolutionary AI". Just precise practitioner language.',
}
```

**TypeScript type reference** (`src/types/usecase.ts`):
```typescript
category: 'underwriting' | 'claims' | 'operations' | 'actuarial'
status: 'published' | 'draft'
detailType: 'html' | 'component'
```

---

## Step 3 — Create the Standalone HTML File

**Location:** `public/usecases/YourUseCaseName.html`

This is a fully self-contained HTML file — no external JS framework, no build step. It must look polished enough to share directly with a prospect or partner. Think McKinsey PDF converted to web.

### HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ElevateNow — [Short descriptive title]</title>
<style>
  /* Copy the style block from an existing use case (e.g. SubmissionIntake.html).
     Do not deviate from the design system below. */

  :root {
    --ink: #1a1a2e;
    --paper: #fafaf8;
    --accent: #c0392b;
    --accent-light: #e74c3c;
    --accent-bg: #fdf2f0;
    --tool-blue: #1a5276;
    --agent-green: #1e6e3e;
    --border: #e0ddd5;
    --muted: #6b6b6b;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
  }
</style>
</head>
<body>

<!-- ── HERO ── -->
<section class="hero">
  <div class="hero-label">ElevateNow · Field Research · [Category]</div>
  <h1>[Provocative headline — matches usecases.ts title]</h1>
  <div class="hero-sub">[Subtitle — matches usecases.ts subtitle]</div>
  <div class="hero-meta">
    <span>[Category] · [Read time]</span>
    <span>[Tags — 2-3 key terms]</span>
  </div>
</section>

<div class="container">

  <!-- ── THE REAL PROBLEM ── -->
  <section class="section">
    <div class="section-label">The Real Problem</div>
    <h2>[Problem framing headline]</h2>
    <p>[Opening paragraph — establish the problem as a practitioner sees it]</p>
    <!-- Use callout boxes, stat blocks, problem lists as appropriate -->
  </section>

  <!-- ── WHY THIS PERSISTS ── -->
  <section class="section">
    <div class="section-label">Why This Persists</div>
    <h2>[Root cause headline]</h2>
    <!-- Explain the structural reason the problem hasn't been solved -->
  </section>

  <!-- ── THE ARCHITECTURE ── -->
  <section class="section">
    <div class="section-label">What a Correct Architecture Looks Like</div>
    <h2>[Architecture framing headline]</h2>
    <!-- Explain principles, NOT blueprints. What type of system, what it must do, what it must not do. -->
  </section>

  <!-- ── WHAT IT ENABLES ── -->
  <section class="section">
    <div class="section-label">What It Enables</div>
    <h2>[Outcome headline]</h2>
    <!-- Measurable outcomes, practitioner value, governance implications -->
  </section>

</div>

</body>
</html>
```

### Design Rules for the HTML File

1. **Hero** — Dark gradient background, large serif headline, accent color (red) for emphasis word(s)
2. **Sections** — Light paper background, labeled with `section-label` (uppercase, accent color), `<h2>` for section headline
3. **Callout boxes** — Use for key stats, important caveats, or critical design principles
4. **No external dependencies** — Everything inline. No CDN links to JS frameworks. Google Fonts is OK.
5. **Readable width** — `max-width: 1100px`, generous padding. This is a long-read format.
6. **Practitioner tables** — For comparing approaches, showing trade-offs, or displaying a field taxonomy. Dark header row, alternating stripes.
7. **No screenshots** — This is a text/data-driven format. Diagrams can be done with pure HTML/CSS.
8. **Back link** — Add a subtle "← Back to ElevateNow Insights" link at top that goes to `/` (the insights site root)

### Tone Rules

- Write for someone who has spent 15 years in insurance and is deeply skeptical of AI hype
- Never say "revolutionary", "game-changing", "AI-powered" as marketing terms
- Anchor every claim to a mechanism: not "better outcomes" but "jurisdiction rules applied consistently because they're stored as versioned data, not recalled from model weights"
- Use practitioner vocabulary: FNOL, STP, quota share, adverse development, IBNR, ACORD, bordereaux — not generic business language
- The "How" section should show architectural judgment without giving away implementation

---

## Step 4 — Add the Card to index.html

**File:** `index.html` (project root — this IS the site, not a template)

Find the Proven Results section (search for `id="results"`). Add a new card in the `<div class="uc-grid">` block.

### Card Template

```html
<div class="uc-card r" data-category="[category]" style="transition-delay:.XXs">
  <div class="uc-card-head">
    <div class="uc-card-meta">
      <span class="uc-tag [tag-class]">[Category Label]</span>
      <span class="uc-read-time">[N] min read</span>
    </div>
    <h3>[Title — can be slightly shorter than the full title]</h3>
  </div>
  <div class="uc-card-body">
    <p class="uc-key-q">[keyQuestion from usecases.ts]</p>
  </div>
  <div class="uc-card-foot">
    <div class="uc-tags">
      <span class="uc-pill">[Tag 1]</span>
      <span class="uc-pill">[Tag 2]</span>
    </div>
    <a href="./usecases/[YourUseCaseName.html]" class="uc-read-link" target="_blank">Read →</a>
  </div>
</div>
```

**CSS tag classes by category:**
- Underwriting → `tag-uw`
- Claims → `tag-claims`
- Operations → `tag-ops`
- Actuarial → `tag-act`

**transition-delay pattern** — stagger by `.04s` per card in each row. First card in a new row: `.05s`, second: `.09s`, third: `.13s`.

### Update the Filter Counts

Find the `<div class="filter-bar">` and update the counts. The filter bar has three levels:
1. **Super-filters:** All (total) / Insurance (UW+Claims) / Data Solutions (Ops+Actuarial)
2. **Separator** (thin vertical line)
3. **Sub-filters:** Underwriting / Claims / Operations / Actuarial

Update the count in the `All` button, plus the relevant category and its super-category.

```html
<!-- Example after adding a new underwriting case: -->
<button class="filter-btn active" data-filter="all">All <span class="filter-count">11</span></button>
<button class="filter-btn" data-filter="insurance">Insurance <span class="filter-count">6</span></button>
<!-- Data Solutions stays 5 -->
...
<button class="filter-btn filter-btn-sub" data-filter="underwriting">Underwriting <span class="filter-count">4</span></button>
```

Also update the section subtitle:
```html
<h2 class="section-title">11 implemented workflows.<br>Documented as practitioners.</h2>
```

**Note on categories:**
- Insurance = underwriting + claims (`data-category="underwriting"` or `data-category="claims"`)
- Data Solutions = operations + actuarial (`data-category="operations"` or `data-category="actuarial"`)

Nav submenu deep links work automatically:
- `#results-insurance` → scrolls to Proven Results + activates Insurance filter
- `#results-datasolutions` → scrolls to Proven Results + activates Data Solutions filter

---

## Step 5 — Build and Deploy

```bash
# From the elevatenow-usecases directory:

# 1. Verify build passes
npm run build

# 2. Commit all changes
git add index.html src/data/usecases.ts public/usecases/YourUseCaseName.html
git commit -m "feat(research): add [use case name] use case"

# 3. Push — Cloudflare Pages auto-deploys in ~60 seconds
git push origin main
```

**Cloudflare deployment:**
- Auto-deploys on push to `main`
- Build command: `tsc -b && vite build`
- Publish directory: `dist/`
- Live at: `insights.elevatenow.tech`

---

## Publishing Checklist

Before committing:

- [ ] `usecases.ts` entry complete with all required fields
- [ ] `htmlPath` in `usecases.ts` matches the actual filename in `public/usecases/`
- [ ] HTML file is self-contained (no broken external refs)
- [ ] Card added to `index.html` with correct `data-category` value
- [ ] Filter counts updated in `index.html`
- [ ] Section subtitle count updated in `index.html`
- [ ] `npm run build` passes with no errors
- [ ] Use case links from `./usecases/YourFile.html` (relative path, not absolute)

---

## Featured vs. Grid Cards

The first two cards in `<div class="uc-featured">` are displayed larger (2-column layout). Everything else goes in `<div class="uc-grid">` (3-column layout).

To promote a new case to Featured: move its card HTML into `<div class="uc-featured">` and add `<div class="uc-featured-label">Featured</div>` inside `uc-card-head`. Featured cards show 4 lines of `keyQuestion` text instead of the standard 2.

---

## File Locations Quick Reference

| File | Purpose |
|------|---------|
| `index.html` | The site itself — add cards here |
| `src/data/usecases.ts` | Use case metadata registry |
| `public/usecases/*.html` | Standalone use case pages |
| `public/demoboards/*.html` | Demo boards (separate from use cases) |
| `public/EN-Blue.png`, `public/Elevatenow-Logo.svg` | Brand assets for use in HTML files |

---

## Evidence Lab Publishing

The Evidence Lab section (dark section in `index.html`, `id="lab"`) is for benchmark studies, framework documents, and research papers — **not** use cases.

To add a new Evidence Lab entry, find the `<div class="ev-grid">` and add:
```html
<div class="ev-card">
  <div class="ev-topic">[Topic tag]</div>
  <h3>[Study title]</h3>
  <p>[1-2 sentence description]</p>
  <a href="[path-to-document]" class="ev-link">Read the framework →</a>
</div>
```

The Evidence Lab is for content that would live in the Benchmarking/Framework reference — see `Claude_benchmarking.md` for that content.
