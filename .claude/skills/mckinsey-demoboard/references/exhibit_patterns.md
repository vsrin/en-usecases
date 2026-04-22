# Exhibit patterns — the library

A demoboard uses 4-7 exhibits. Choose from this library. Do not invent new exhibit types unless the argument genuinely requires it.

Each exhibit is designed to make a specific kind of argument. Picking the wrong exhibit for the argument is the single most common failure.

## Pattern 1 — Value chain (process flow)

**Use when:** Showing how something moves through a sequence of stages, and where in that sequence a problem or intervention occurs.

**Structure:** 5-7 horizontal boxes connected by arrows, with an annotation layer above or below showing where a gate, gap, or intervention sits.

**Typical argument:** "The problem happens at stage X, not stage Y" or "Our solution intervenes at stage X, before stage Y."

**Example:** "Insurance AI value chain — source → ingest → warehouse → pipeline → feature → AI decision → customer. Today's quality gate sits at warehouse; our gate sits at pipeline."

**Style notes:** Stage labels in uppercase mono above each box. Use dashed outlines and greyed text for things that are "today's state" and solid outlines with accent color for "should-be state." Always include at least one annotation arrow showing movement or change.

## Pattern 2 — Three gaps (or three pillars, three bets)

**Use when:** Making a MECE decomposition with three elements — three gaps, three principles, three opportunities.

**Structure:** Three vertical columns. Each column has a uppercase accent-colored code at top ("GAP 01 · TIMING"), a two-line serif assertion headline, a visual metaphor in the middle, and a short italic caption at bottom.

**Typical argument:** "The problem has three independent dimensions that must all be addressed" or "Our strategy rests on three principles, each MECE."

**Example:** Three gaps — timing (timeline with check in wrong place), coverage (two stacks, one visible one invisible), aggregation (three disconnected tools with no roll-up).

**Style notes:** Each column needs its own visual metaphor, not just text. Columns separated by thin vertical rules. The visual metaphors themselves should be simple — abstract shapes and arrows, not detailed illustrations.

## Pattern 3 — 2×2 positioning matrix

**Use when:** Comparing your solution to alternatives on two dimensions. The classic McKinsey move.

**Structure:** Two axes forming four quadrants. Competitors plotted as labeled circles. Your solution plotted as a larger accent-colored circle, ideally with concentric rings, in the "winning" quadrant.

**Typical argument:** "On these two axes, every other tool is a specialist; we're the only one in Q2."

**Style notes:** Axes in solid black with arrow ends. Quadrant labels in small grey mono ("Q1 · structured observability"). Competitor bubbles uniform size, grey, with labels to the right. Your bubble larger, accent color, with 2-3 concentric rings behind it at declining opacity. Always label both axes clearly and include endpoint labels (e.g., "STRUCTURED ONLY" and "STRUCTURED + UNSTRUCTURED").

**Never** use an actual Gartner quadrant as inspiration — it's specifically not what this pattern should evoke.

## Pattern 4 — Waterfall or stacked comparison

**Use when:** Showing how multiple components roll up to a single composite number, or comparing values across categories where one is the standout.

**Structure:** Horizontal bar chart with 5-7 component bars plus one "composite" or "total" bar, the latter in solid accent color. Threshold line across if relevant (e.g., "certification threshold ≥ 80").

**Typical argument:** "Here's how [composite thing] is computed, and here's what [specific example] looks like today" or "Component scores roll up to one number."

**Style notes:** Gridlines light grey. Bars outlined accent color, filled with light accent. Composite bar filled solid accent, labeled clearly. Values above each bar in accent color, serif numerals. Always include a source caption noting "Illustrative only" if the data is hypothetical.

## Pattern 5 — MECE three-column detail

**Use when:** Detailing three items that must be presented as parallel (three modules, three offerings, three segments).

**Structure:** Three columns of equal width, each with: code + title at top, short subtitle, list of 4-6 items, and (optionally) a small colored callout at bottom relating it to the recipient's specific context.

**Typical argument:** "Here are the three things, and here's what each one means for you specifically."

**Style notes:** Columns joined by shared rules, no gaps between them. Each column has the same internal rhythm — do not vary the structure between columns. The bottom callout is a small accent-colored box (like `background: var(--accent-soft); border-left: 2px solid var(--accent);`) with a recipient-specific application. This is where the document proves it was written for THIS reader.

## Pattern 6 — Architecture / system diagram

**Use when:** Showing how the parts of a product fit together and connect to the outside world.

**Structure:** Left-to-right flow with three or four layers (sources → your system → shared rail → downstream consumers). Your system's components in accent-colored boxes; everything else in neutral grey boxes.

**Typical argument:** "Here is how it works — not as a feature list, but as a system."

**Style notes:** Use dashed arrows for shared-rail connections (lateral) and solid arrows for primary flows (left-to-right). Column headers in small grey mono ("SOURCES", "MODULES", "SHARED RAIL", "DOWNSTREAM"). The output of the system — the certified thing — gets rendered in solid black box with white text, signaling "this is the artifact."

## Pattern 7 — Timeline / phased rollout

**Use when:** Showing what happens over a defined time window (typically 30-60-90 or 90-180-365 days).

**Structure:** Horizontal timeline with day markers at 0, 30, 60, 90. Three phase bars of increasing accent intensity (light → medium → dark accent). Under each phase, a list of 4-5 milestones. An "anchoring outcome" callout in black at the far right of the timeline, connected to the Day 90 mark by a short line.

**Typical argument:** "By day X, a specific concrete thing has happened."

**Style notes:** Phase names in accent-colored serif caps. Milestones in small sans with accent bullet points. Always end with a named, dated deliverable — not a generic "go live" phase. The anchoring outcome box is the most important element; make sure it's visually anchored to a specific date.

## Pattern 8 — Stacked evidence (optional, use sparingly)

**Use when:** Needing to show three or four data points that together make an argument — but the data points don't fit a chart.

**Structure:** Three or four cells in a row, each with a large serif number on the left (the data point) and a short explanation on the right.

**Typical argument:** "Here are the numbers that matter."

**Style notes:** Numbers in serif light weight, 48-64px, accent color. Explanations in sans, 14px, grey. Use at most once per demoboard.

---

## Choosing exhibits for a new demoboard

A strong demoboard uses exhibits in roughly this sequence:

1. **Problem page** → Value chain (Pattern 1) or Three gaps (Pattern 2)
2. **Frame page** → Three gaps (Pattern 2) — if not used for problem — or 2×2 (Pattern 3)
3. **Positioning page** → 2×2 matrix (Pattern 3)
4. **Product page** → Architecture diagram (Pattern 6) + MECE columns (Pattern 5)
5. **Artifact page** → Waterfall (Pattern 4)
6. **Rollout page** → Timeline (Pattern 7)

Swap any one of these based on the specific argument. But the overall rhythm — diagnose, decompose, position, hinge, show, prove, commit — is near-universal.

## What every exhibit needs

Three things, without exception:

1. **Exhibit label above** — "Exhibit N · [one-sentence description]"
2. **Source caption inside the SVG, at the bottom** — grey mono, 9-10px. "Source: [origin]." or "Illustrative only."
3. **"So what" note below** — the paragraph starting with **So what**, **Implication**, **Read this as**, or **The commitment**. Bolded lead phrase, one or two sentences max.

If any of the three is missing, the exhibit fails.
