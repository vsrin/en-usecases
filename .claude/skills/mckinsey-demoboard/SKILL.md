---
name: mckinsey-demoboard
description: Produce a single-file, self-paced HTML "demoboard" pre-read for a named senior executive (CIO, CDO, CTO, CEO, board member, investor, or any C-suite reader) in classic McKinsey consulting register — exhibit-heavy, assertion-style headlines, monochrome plus a single accent color, one governing thought per page. Use this skill for executive pre-reads, pitch-read-aheads, one-pagers-but-longer, "send before the meeting" deliverables, product briefings for senior buyers, investor or board read-aheads, and ANY request where the user asks for a demoboard, exhibit pack, board pre-read, executive pre-read, or McKinsey-style packaging of product or strategy content. Trigger this skill whenever the user wants to package a product, pitch, or strategy for a senior reader to consume self-paced before a meeting — even if they don't use the word "demoboard" — especially when they mention McKinsey, BCG, Bain, consulting-style, exhibit-style, or board-ready packaging.
---

# McKinsey Demoboard

This skill produces a single-file HTML demoboard — an interactive, self-paced pre-read that an executive can consume in 5-10 minutes on desktop or mobile. The output is a single `.html` file with no build step, no dependencies beyond Google Fonts, and no external assets. It is designed to be emailed, linked, or placed on a landing page.

The skill encodes two things together:

1. **McKinsey thinking discipline** — pyramid principle, MECE structure, assertion-style headlines, exhibit-per-page, "so what" under every exhibit.
2. **Classic McKinsey visual register** — monochrome typography, single accent color, crisp rules, serif display + sans body, no decorative flourishes.

Neither works without the other. A beautifully styled document that is text-heavy and narrative-led fails. A structurally correct document with weak exhibits and generic styling also fails. The output must do both.

---

## When this skill applies

Trigger on any of these intents:

- "Build a demoboard / pre-read / exhibit pack / one-pager for [product] for [executive]"
- "Package this like McKinsey / BCG / a consulting deck / a board read-ahead"
- "I'm sending this to the [CDO/CIO/CEO/board] before a meeting"
- "Turn this product manual / deck / spec into something I can send to a senior buyer"
- Any case where the user has a product, pitch, or strategy and wants it packaged for a named senior reader to consume self-paced

Do NOT use this skill for:

- Internal team docs, engineering specs, or operational runbooks (use docx skill)
- Investor financial models or data-heavy spreadsheets (use xlsx skill)
- Full pitch decks meant to be presented live (use pptx skill) — demoboards are for reading, not presenting
- Marketing landing pages aimed at unknown visitors (use frontend-design skill)

The demoboard is specifically for a **named, senior, known reader** who will read it **self-paced** before or after a meeting.

---

## The workflow — follow these steps in order

### Step 1 — Gather context before building

Before writing any code, confirm these five things. If the user hasn't volunteered them, ask (use `ask_user_input_v0` for mobile-friendly taps where possible):

1. **Product / pitch** — what is being packaged? (Read any attached product manual, deck, or spec in full before drafting.)
2. **Named recipient** — who is the executive? Role, company, known priorities. (If the recipient is senior enough to have a public footprint, do one or two `web_search` queries to find their recent public positioning — this is what tunes the framing.)
3. **Meeting context** — is the meeting already scheduled? Is this a first meeting, follow-up, or escalation? What is the specific outcome the user wants from the meeting?
4. **The one hook** — if the reader only remembers one thing, what should it be? (Force a single answer. This becomes the cover headline.)
5. **Accent color** — does the product / company have a brand color? If not, default to a McKinsey-ish blue (`#0066A1`). Any single accent is fine as long as it's one.

Do not proceed until these are confirmed. The single most common failure mode is building a generic pre-read because the reader, the hook, or the meeting goal wasn't pinned down.

### Step 2 — Draft the argument before writing any HTML

Write the argument as a list of **assertion-style page headlines** FIRST, in order, before touching code. Each headline must be a complete sentence that asserts something — not a topic label.

- BAD: "The Problem"
- GOOD: "Quality controls sit on the wrong side of the AI decision — by the time a bad record is caught, the model has already scored it."

- BAD: "Product Architecture"
- GOOD: "Three modules share one rule catalog and roll up to one trust score."

- BAD: "How It Works"
- GOOD: "A single lifecycle — profile, certify, gate, score — closes the loop."

If a headline reads like a slide title from a generic SaaS deck, rewrite it. The test: can the reader understand the main argument of the page from the headline alone? If yes, the headline is doing its job.

### Step 3 — Choose exhibits, one per page

A McKinsey demoboard has **one exhibit per substantive page**. The exhibit carries the explanatory load; the body text is supporting. Read `references/exhibit_patterns.md` for the library of exhibit types and when to use each.

Constraint: minimum four, maximum seven exhibits. Fewer than four and the document reverts to text-heavy; more than seven and the reader loses the thread. Four to six is the sweet spot.

Every exhibit must have:

- An **exhibit label** above it ("Exhibit 3 · The data quality landscape on two axes") — this signals the register.
- A **"so what" note** below it — one or two sentences, starting with **So what**, **Implication**, **Read this as**, or **The commitment**. This is non-negotiable; it's what converts an exhibit from decoration to argument.

### Step 4 — Build the HTML

Copy the template from `assets/template.html` and fill in the content. Read `references/style_system.md` for the visual specification and `references/structure.md` for the page-by-page scaffold.

The template is intentionally strict. Do not invent new color variables, font families, or layout patterns. If a section needs something the template doesn't support, extend by composition (e.g., use two existing patterns together), not by adding novel styles.

### Step 5 — Write SVG exhibits directly

All exhibits are inline SVG — no images, no chart libraries, no external dependencies. This keeps the file single, portable, and safe to email.

Read `references/svg_patterns.md` for the copy-pasteable SVG skeletons for each exhibit type (value chain, 2×2 matrix, waterfall, MECE columns, timeline, flow diagram, stacked comparison). Use these as starting points, not from scratch.

Every SVG exhibit must include a **source caption** at the bottom in small grey monospace text — even if illustrative. "Source: Elevatenow analysis" or "Illustrative only" is fine. The caption is what makes it read as an exhibit rather than an infographic.

### Step 6 — Final checks before delivering

Run through this checklist silently before presenting the file. If any item fails, fix it before delivering.

- [ ] The cover headline is an assertion, not a label
- [ ] Every page headline is an assertion that could stand alone as a takeaway
- [ ] There is an executive summary page near the front with 3-4 numbered takeaways — each one summarizing a later section
- [ ] Four to seven exhibits, one per substantive page
- [ ] Every exhibit has a label above and a "so what" note below
- [ ] Monochrome plus exactly ONE accent color — no secondary accents, no gradients
- [ ] Serif display font for headlines; sans body font; monospace for labels, section numbers, captions
- [ ] One dark "hinge" page somewhere in the middle (full-bleed dark background) — creates visual rhythm
- [ ] Cover has: eyebrow (small uppercase mono), main headline, lede paragraph, four-cell metadata strip
- [ ] Closing page has: a working-session-style agenda (6 items) and a sign-off block with author names + "Confidential" mono tag
- [ ] The file opens and renders correctly in the browser (view it after building)
- [ ] The named executive's industry / role / priorities are reflected in the examples used in the exhibit "so what" notes — not generic

### Step 7 — Deliver

Save to `/mnt/user-data/outputs/[product]_[recipient]_demoboard.html` and call `present_files` with the filepath. After delivery, offer three optional follow-ons:

1. A short cover email to send with the link
2. A PDF export version
3. Adjustments to specific exhibits based on feedback

---

## The discipline that makes this work

A McKinsey demoboard is **not** a prettier version of a SaaS landing page. It is a structurally different artifact. The common failure mode — and what this skill exists to prevent — is producing something that looks clean but still reads as a brochure.

Five rules, in order of importance:

1. **Pyramid principle.** Conclusion first, evidence underneath. The cover headline is the main argument. The executive summary contains the supporting arguments. The exhibits are the evidence. If a reader stops after the cover, they still know what you think. If they stop after the exec summary, they know why. The exhibits only exist to make the argument unassailable.

2. **One governing thought per page.** Every page answers one question and makes one argument. If a page is doing two things, split it into two pages.

3. **MECE.** Mutually exclusive, collectively exhaustive. Three modules, three gaps, three phases — no overlap, nothing missing. Check every list for this.

4. **Assertion headlines.** The title IS the argument. "The problem" is not a title; it's a label. "Quality runs on the wrong side of the decision" is a title.

5. **Restraint.** Monochrome plus one accent. No gradients. No decorative icons. No stock photography. Confidence comes from the structure and the density of argument, not from styling.

If the output starts feeling like a pitch deck or a product website, stop and go back to the assertion headlines. The problem will always be there.

---

## Reference files

Read these as needed. Each is small and focused.

- `references/structure.md` — The page-by-page scaffold (cover → exec summary → exhibit pages → hinge → exhibit pages → agenda → sign-off). Read this before drafting headlines.
- `references/exhibit_patterns.md` — The exhibit library: when to use a value chain vs. a 2×2 vs. a waterfall vs. MECE columns. Read this before choosing exhibits for a specific deliverable.
- `references/style_system.md` — The visual specification: exact color tokens, typography scales, spacing rules, component patterns. Read this before building the HTML.
- `references/svg_patterns.md` — Copy-pasteable SVG skeletons for every exhibit type, with adjustable parameters. Read this when writing exhibits.

## Assets

- `assets/template.html` — The full HTML scaffold. Copy this as the starting point for every demoboard. It includes all CSS, the page architecture, and placeholder content. Do not rewrite the CSS; only change the content.
