# Style system — the visual specification

Adherence to this specification is non-negotiable. The McKinsey register depends on restraint; inventing new styling options dilutes the effect.

## Color tokens

Use these exact CSS variables. Do not add new ones. Do not substitute. If you need a color the system doesn't provide, compose from what's there.

```css
:root {
  --ink:        #0A0A0A;   /* primary text, main rules */
  --ink-2:      #1F1F1F;   /* secondary text, dark body */
  --ink-3:      #3D3D3D;   /* tertiary text */
  --ink-4:      #6B6B6B;   /* muted text, captions */
  --ink-5:      #9A9A9A;   /* disabled or faded text */
  --rule:       #D8D8D8;   /* primary rules between sections */
  --rule-2:     #E8E8E8;   /* secondary rules inside exhibits */
  --paper:      #FFFFFF;   /* backgrounds */
  --paper-2:    #F5F5F3;   /* cell backgrounds, filled boxes */
  --paper-3:    #EDEDEA;   /* slightly deeper neutral fills */
  --accent:     #0066A1;   /* THE accent — swap per brand but always ONE */
  --accent-2:   #004A75;   /* darker accent for hover/pressed */
  --accent-soft:#E5EEF4;   /* accent-tinted background for callouts */
}
```

**Accent selection:** Default to `#0066A1` (consulting blue). If the product has a brand color, use it — but commit fully; do not use two accents. Derive `--accent-2` (darker for pressed states) and `--accent-soft` (tinted fill) from the chosen accent.

Common alternative accents that work in this register:
- Burnt orange `#C8502B` (for warmth)
- Oxblood `#8B2131` (for gravitas)
- Deep teal `#0D5F66` (for tech)
- Forest `#2E5339` (for sustainability)

## Typography

Three fonts, three roles. Do not add a fourth font.

```html
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Source Serif 4** — all headlines (cover, assertions, section titles, exhibit titles). Weights 300-500 primarily. Italics for emphasis and the hinge quote.
- **Inter** — all body copy, all lists, most UI text. Weights 400-600.
- **JetBrains Mono** — section numbers, eyebrows, exhibit labels, captions, all uppercase-with-letter-spacing labels.

Font pairing rules:
- Headlines: Serif 300 or 400 for most; Serif 500 for emphasis. Never Serif 600 or 700 in headlines — it reads as heavy/marketing.
- Body: Sans 400. Sans 500 for emphasis. Sans 600 only for inline strong text inside "so what" notes.
- Mono: always uppercase, letter-spacing 0.1em-0.18em, sized between 9.5px and 11px. Use for structural labels, never for body copy.

**Alternative serif options** (pick ONE):
- Source Serif 4 (default — most legible at all sizes)
- Fraunces (more editorial, works if the brand leans warm)
- Playfair Display (use sparingly; high contrast can read as overly decorative)

Do not use:
- Georgia, Times New Roman (too browser-default)
- Libre Baskerville (too literary)
- Any script, slab, or display-only faces

## Spacing and layout

The document uses a consistent outer container:

```css
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 48px; }
.page { padding: 72px 0 80px; border-bottom: 1px solid var(--rule); }
```

- **Maximum content width**: 1180px
- **Page horizontal padding**: 48px desktop, 24px mobile
- **Vertical rhythm between pages**: 72-80px top/bottom padding plus a 1px rule
- **Max reading width for paragraphs**: 820px (never let a paragraph span the full 1180)

## The page header scaffold (mandatory on every page except cover and hinge)

```html
<div class="ph">
  <span class="ph-num">02</span>
  <span class="ph-cat">The problem</span>
  <span class="ph-spacer"></span>
  <span>Exhibit 1 of 6</span>
</div>
```

```css
.ph {
  display: flex; align-items: baseline; gap: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-4);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ink);
  margin-bottom: 24px;
}
.ph .ph-num { color: var(--accent); font-weight: 600; }
```

The bottom rule is `1px solid var(--ink)` — full ink, not grey. This is the signal that a new exhibit page has begun.

## Assertion headline pattern

```html
<h2 class="assertion">
  [Lead phrase, stating the argument —]
  <span class="accent">[accent-colored hook phrase that the reader will remember]</span>
</h2>
<p class="subhead">[Subhead: context and what exhibit to expect.]</p>
```

```css
.assertion {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 400;
  font-size: clamp(26px, 3.2vw, 38px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--ink);
  max-width: 980px;
  margin-bottom: 12px;
}
.assertion em { font-style: italic; font-weight: 500; }
.assertion .accent { color: var(--accent); font-style: normal; font-weight: 500; }
```

## The hinge page

One page, full bleed, dark:

```css
.hinge {
  padding: 80px 0;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  background: var(--ink);
  color: var(--paper);
}
.hinge h2 {
  font-family: 'Source Serif 4', serif;
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 300;
  font-style: italic;
  line-height: 1.2;
  max-width: 960px;
}
.hinge h2 em { color: [lighter accent, e.g., #5FB0E5]; font-style: italic; }
```

The hinge page has no section header, no exhibit, no "so what" note. Just a small mono label, the quote, and an attribution line.

## "So what" note pattern

```html
<div class="ex-note">
  <strong>So what.</strong> [One or two sentences making the implication explicit.]
</div>
```

```css
.ex-note {
  font-family: 'Inter', sans-serif; font-size: 11.5px;
  color: var(--ink-4); line-height: 1.5;
  padding-top: 10px; margin-top: 14px;
  border-top: 1px solid var(--rule-2);
  max-width: 820px;
}
.ex-note strong { color: var(--ink-3); font-weight: 600; }
```

Lead phrase options (use one per note, vary across exhibits):
- **So what.**
- **Implication.**
- **Read this as.**
- **The commitment.**
- **Why this matters.**
- **Upshot.**

## Reveal-on-scroll

Every first-class element (headlines, exhibits, notes) gets `class="reveal"`. The script at the bottom observes them and fades them in on scroll. Do not remove this; it's what makes the document feel produced rather than dumped.

## Mobile behavior

At ≤720px:
- `.wrap` padding drops to 24px
- `.page` padding drops to 48px top / 56px bottom
- Multi-column grids collapse to single column
- Top bar metadata hides; brand stays
- Cover metadata strip: 2×2 instead of 4×1
- MECE three-column columns stack vertically

SVG exhibits use `viewBox` and scale naturally. They do not get rewritten for mobile — they just shrink. Test on a narrow viewport before delivering.

## Things that are banned

- Drop shadows on anything except the hero accent bubble in a 2×2
- Gradients of any kind except on the one dark hinge page background, and even there prefer radial tinted overlays rounding to transparent
- Emoji in any UI element
- Font Awesome or any icon library — if you need an icon, draw it inline as SVG
- Any font outside the three specified
- Any accent beyond the one chosen accent
- Rounded corners of more than 2px (and only on the outer mark on the top bar)
- Stock photography
- Animations beyond the scroll-reveal fade
