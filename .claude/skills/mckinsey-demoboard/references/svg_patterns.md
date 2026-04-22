# SVG patterns — copy-pasteable exhibit skeletons

Every exhibit is inline SVG. Use the skeleton that matches the exhibit pattern you chose, then adjust content, labels, and counts.

All skeletons use the same:

- `viewBox` aspect ratio scaled for desktop readability (~1180×360-560)
- Shared arrow marker definitions
- Color references to the CSS tokens indirectly (via hex codes that match `--ink`, `--ink-4`, `--accent`, etc.)
- Source caption in grey mono at the bottom left
- `<svg class="ex-svg">` with a border and white background set by the parent CSS

## Shared definitions (include in every SVG)

```xml
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A9A9A"/>
  </marker>
  <marker id="arr-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#0066A1"/>
  </marker>
</defs>
```

If multiple exhibits exist in the same document, give each SVG's markers unique IDs to avoid conflicts (`arr2`, `arr2-accent`, etc.).

## Shared text classes (use in every SVG)

- `class="svg-title"` — Source Serif 4, weight 500, for labels that should feel like chart titles
- `class="svg-label"` — JetBrains Mono, uppercase, letter-spacing 0.08em, for labels and codes
- `class="svg-body"` — Inter, for in-chart prose

Define in CSS:
```css
.svg-title { font-family: 'Source Serif 4', serif; font-weight: 500; }
.svg-label { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; }
.svg-body  { font-family: 'Inter', sans-serif; }
```

---

## Pattern 1 — Value chain with intervention layer

```xml
<svg class="ex-svg" viewBox="0 0 1180 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="1180" height="420" fill="#FFFFFF"/>

  <!-- Stage labels (top) -->
  <g class="svg-label" font-size="10" fill="#6B6B6B">
    <text x="100"  y="44" text-anchor="middle">STAGE 01</text>
    <text x="260"  y="44" text-anchor="middle">STAGE 02</text>
    <text x="420"  y="44" text-anchor="middle">STAGE 03</text>
    <text x="580"  y="44" text-anchor="middle">STAGE 04</text>
    <text x="740"  y="44" text-anchor="middle">STAGE 05</text>
    <text x="900"  y="44" text-anchor="middle">STAGE 06</text>
    <text x="1060" y="44" text-anchor="middle">STAGE 07</text>
  </g>

  <!-- Stage boxes -->
  <g>
    <rect x="45"   y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
    <rect x="205"  y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
    <rect x="365"  y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
    <rect x="525"  y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
    <rect x="685"  y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
    <rect x="845"  y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
    <rect x="1005" y="60" width="110" height="56" fill="#F5F5F3" stroke="#D8D8D8"/>
  </g>

  <!-- Arrows between stages -->
  <g stroke="#9A9A9A" stroke-width="1.2" fill="none">
    <path d="M 155 88  L 205 88"  marker-end="url(#arr)"/>
    <path d="M 315 88  L 365 88"  marker-end="url(#arr)"/>
    <path d="M 475 88  L 525 88"  marker-end="url(#arr)"/>
    <path d="M 635 88  L 685 88"  marker-end="url(#arr)"/>
    <path d="M 795 88  L 845 88"  marker-end="url(#arr)"/>
    <path d="M 955 88  L 1005 88" marker-end="url(#arr)"/>
  </g>

  <!-- Box contents -->
  <g class="svg-body" font-size="11" fill="#1F1F1F" text-anchor="middle">
    <text x="100"  y="84">Line 1</text><text x="100"  y="100">Line 2</text>
    <text x="260"  y="84">Line 1</text><text x="260"  y="100">Line 2</text>
    <!-- ...repeat per box... -->
  </g>

  <!-- Today's gate (wrong place) -->
  <g>
    <rect x="365" y="175" width="110" height="40" fill="#FFFFFF" stroke="#9A9A9A" stroke-dasharray="3 3"/>
    <text x="420" y="198" text-anchor="middle" class="svg-label" font-size="9.5" fill="#6B6B6B">TODAY'S</text>
    <text x="420" y="210" text-anchor="middle" class="svg-label" font-size="9.5" fill="#6B6B6B">GATE</text>
    <path d="M 420 140 L 420 173" stroke="#9A9A9A" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#arr)"/>
  </g>

  <!-- Our intervention gates (accent) -->
  <g>
    <rect x="525" y="260" width="270" height="56" fill="#E5EEF4" stroke="#0066A1"/>
    <text x="660" y="283" text-anchor="middle" class="svg-label" font-size="10" fill="#0066A1" font-weight="600">OUR GATES HERE</text>
    <text x="660" y="300" text-anchor="middle" class="svg-body" font-size="12" fill="#0A0A0A">[Description of what happens]</text>
    <path d="M 580 258 L 580 130" stroke="#0066A1" stroke-width="1.5" fill="none" marker-end="url(#arr-accent)"/>
    <path d="M 740 258 L 740 130" stroke="#0066A1" stroke-width="1.5" fill="none" marker-end="url(#arr-accent)"/>
  </g>

  <!-- Movement annotation -->
  <g>
    <path d="M 420 340 L 660 340" stroke="#0066A1" stroke-width="1.5" fill="none" marker-end="url(#arr-accent)"/>
    <text x="540" y="332" text-anchor="middle" class="svg-label" font-size="10" fill="#0066A1" font-weight="600">MOVE [X] UPSTREAM</text>
    <text x="540" y="358" text-anchor="middle" class="svg-body" font-size="11" fill="#3D3D3D">[One-line explanation]</text>
  </g>

  <!-- Source caption -->
  <g class="svg-label" font-size="9.5" fill="#9A9A9A">
    <text x="45" y="400">Source: [attribution].</text>
  </g>
</svg>
```

## Pattern 2 — Three gaps (three-column MECE with visual metaphors)

```xml
<svg class="ex-svg" viewBox="0 0 1180 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="1180" height="360" fill="#FFFFFF"/>

  <!-- Column codes -->
  <g class="svg-label" font-size="10" fill="#0066A1" font-weight="600">
    <text x="200" y="40" text-anchor="middle">GAP 01 · [DIM]</text>
    <text x="580" y="40" text-anchor="middle">GAP 02 · [DIM]</text>
    <text x="960" y="40" text-anchor="middle">GAP 03 · [DIM]</text>
  </g>

  <!-- Column titles (two-line serif) -->
  <g class="svg-title" font-size="16" fill="#0A0A0A">
    <text x="200" y="74" text-anchor="middle">[Title line 1]</text>
    <text x="200" y="94" text-anchor="middle">[Title line 2]</text>
    <text x="580" y="74" text-anchor="middle">[Title line 1]</text>
    <text x="580" y="94" text-anchor="middle">[Title line 2]</text>
    <text x="960" y="74" text-anchor="middle">[Title line 1]</text>
    <text x="960" y="94" text-anchor="middle">[Title line 2]</text>
  </g>

  <!-- COL 1: visual metaphor -->
  <g>
    <!-- Draw shapes/arrows/boxes illustrating the gap -->
    <!-- Use #F5F5F3 fills for "today" and #E5EEF4 with #0066A1 stroke for "should be" -->
    <!-- Include a short italic caption at y~260: -->
    <text x="200" y="260" text-anchor="middle" class="svg-body" font-size="12" fill="#3D3D3D" font-style="italic">[One-line caption.]</text>
  </g>

  <!-- Dividers between columns -->
  <line x1="380" y1="120" x2="380" y2="320" stroke="#E8E8E8"/>

  <!-- COL 2: visual metaphor -->
  <!-- ...similar to COL 1... -->

  <line x1="780" y1="120" x2="780" y2="320" stroke="#E8E8E8"/>

  <!-- COL 3: visual metaphor -->
  <!-- ...similar to COL 1... -->

  <!-- Source caption -->
  <g class="svg-label" font-size="9.5" fill="#9A9A9A">
    <text x="45" y="345">Source: [attribution].</text>
  </g>
</svg>
```

Visual metaphor library for three-gaps columns:

- **Timing gap**: Horizontal timeline with a dashed grey "today" check on the right side, and a solid accent "should-be" gate on the left
- **Coverage gap**: Two vertical stacks of labeled boxes — one solid/visible, one dashed/faded
- **Aggregation gap**: Three disconnected tool boxes at top, three disconnected output boxes below, and a crossed-out circle below indicating "no roll-up"
- **Speed gap**: Long arrow with many tick marks (slow) vs. short arrow with few tick marks (fast)
- **Scale gap**: Single-size box (small) vs. stacked boxes growing larger (scaling)

## Pattern 3 — 2×2 positioning matrix

```xml
<svg class="ex-svg" viewBox="0 0 1180 560" xmlns="http://www.w3.org/2000/svg">
  <rect width="1180" height="560" fill="#FFFFFF"/>

  <!-- Axes -->
  <g stroke="#0A0A0A" stroke-width="1.2">
    <line x1="240" y1="60"  x2="240"  y2="480"/>
    <line x1="240" y1="480" x2="1080" y2="480"/>
  </g>

  <!-- Axis arrow heads -->
  <polygon points="240,50 236,60 244,60" fill="#0A0A0A"/>
  <polygon points="1090,480 1080,476 1080,484" fill="#0A0A0A"/>

  <!-- Y-axis label (top, centered above axis) -->
  <g class="svg-label" font-size="10" fill="#0A0A0A" font-weight="600">
    <text x="240" y="32" text-anchor="middle">[Y-AXIS LABEL]</text>
  </g>

  <!-- Y-axis endpoint labels -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B">
    <text x="180" y="100" text-anchor="end">[HIGH LINE 1]</text>
    <text x="180" y="113" text-anchor="end">[HIGH LINE 2]</text>
    <text x="180" y="450" text-anchor="end">[LOW LINE 1]</text>
    <text x="180" y="463" text-anchor="end">[LOW LINE 2]</text>
  </g>

  <!-- X-axis label (right, above rightmost point) -->
  <g class="svg-label" font-size="10" fill="#0A0A0A" font-weight="600">
    <text x="1090" y="507" text-anchor="end">[X-AXIS LABEL]</text>
  </g>

  <!-- X-axis endpoint labels -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B">
    <text x="370" y="507" text-anchor="middle">[LEFT]</text>
    <text x="950" y="507" text-anchor="middle">[RIGHT]</text>
  </g>

  <!-- Quadrant dividers -->
  <line x1="660" y1="60"  x2="660"  y2="480" stroke="#D8D8D8" stroke-dasharray="4 4"/>
  <line x1="240" y1="270" x2="1080" y2="270" stroke="#D8D8D8" stroke-dasharray="4 4"/>

  <!-- Quadrant labels -->
  <g class="svg-label" font-size="9" fill="#9A9A9A">
    <text x="260" y="80">Q1 · [name]</text>
    <text x="680" y="80">Q2 · [name — winning quadrant]</text>
    <text x="260" y="290">Q3 · [name]</text>
    <text x="680" y="290">Q4 · [name]</text>
  </g>

  <!-- Competitor bubbles (uniform size, grey) -->
  <circle cx="360" cy="175" r="9" fill="#9A9A9A"/>
  <text x="375" y="172" class="svg-body" font-size="12" fill="#1F1F1F">[Name]</text>
  <text x="375" y="188" class="svg-body" font-size="10.5" fill="#6B6B6B">[Category]</text>

  <!-- Add 3-5 more competitor circles with labels -->

  <!-- OUR SOLUTION (larger, accent, with concentric rings) -->
  <circle cx="900" cy="165" r="14" fill="#0066A1"/>
  <circle cx="900" cy="165" r="22" fill="none" stroke="#0066A1" stroke-width="1" opacity="0.4"/>
  <circle cx="900" cy="165" r="32" fill="none" stroke="#0066A1" stroke-width="1" opacity="0.2"/>
  <text x="920" y="162" class="svg-title" font-size="15" fill="#0066A1" font-weight="600">[PRODUCT]</text>
  <text x="920" y="180" class="svg-body" font-size="11" fill="#0066A1">[Short positioning line]</text>

  <!-- Source caption -->
  <g class="svg-label" font-size="9.5" fill="#9A9A9A">
    <text x="45" y="540">Source: [attribution]. Positions indicative.</text>
  </g>
</svg>
```

## Pattern 4 — Waterfall / stacked bar with composite

```xml
<svg class="ex-svg" viewBox="0 0 1180 460" xmlns="http://www.w3.org/2000/svg">
  <rect width="1180" height="460" fill="#FFFFFF"/>

  <!-- Axes -->
  <line x1="180" y1="60"  x2="180"  y2="380" stroke="#0A0A0A" stroke-width="1.2"/>
  <line x1="180" y1="380" x2="1120" y2="380" stroke="#0A0A0A" stroke-width="1.2"/>

  <!-- Gridlines -->
  <g stroke="#E8E8E8" stroke-width="1">
    <line x1="180" y1="60"  x2="1120" y2="60"/>
    <line x1="180" y1="124" x2="1120" y2="124"/>
    <line x1="180" y1="188" x2="1120" y2="188"/>
    <line x1="180" y1="252" x2="1120" y2="252"/>
    <line x1="180" y1="316" x2="1120" y2="316"/>
  </g>

  <!-- Y-axis labels -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B" text-anchor="end">
    <text x="170" y="64">100</text>
    <text x="170" y="128">80</text>
    <text x="170" y="192">60</text>
    <text x="170" y="256">40</text>
    <text x="170" y="320">20</text>
    <text x="170" y="384">0</text>
  </g>

  <!-- Component bars (light accent fill, accent stroke) -->
  <g>
    <rect x="220" y="68" width="100" height="312" fill="#E5EEF4" stroke="#0066A1" stroke-width="1.2"/>
    <text x="270" y="404" text-anchor="middle" class="svg-label" font-size="10" fill="#1F1F1F">[LABEL]</text>
    <text x="270" y="418" text-anchor="middle" class="svg-body" font-size="10.5" fill="#6B6B6B">[CATEGORY]</text>
    <text x="270" y="61" text-anchor="middle" class="svg-title" font-size="16" fill="#0066A1" font-weight="600">[VALUE]</text>
  </g>

  <!-- Repeat for 5-7 component bars, varying heights -->

  <!-- Composite bar (solid accent fill, white "CERTIFIED" label) -->
  <rect x="950" y="92" width="140" height="288" fill="#0066A1"/>
  <text x="1020" y="404" text-anchor="middle" class="svg-label" font-size="11" fill="#0A0A0A" font-weight="600">COMPOSITE</text>
  <text x="1020" y="418" text-anchor="middle" class="svg-body" font-size="10.5" fill="#0066A1" font-weight="600">[LABEL]</text>
  <text x="1020" y="75" text-anchor="middle" class="svg-title" font-size="28" fill="#0066A1" font-weight="600">[BIG VALUE]</text>
  <text x="1020" y="220" text-anchor="middle" class="svg-title" font-size="14" fill="#FFFFFF" font-weight="600">[STATUS]</text>

  <!-- Threshold line -->
  <line x1="220" y1="124" x2="1090" y2="124" stroke="#0A0A0A" stroke-dasharray="4 4" stroke-width="1"/>
  <text x="1095" y="128" class="svg-label" font-size="9.5" fill="#0A0A0A">[THRESHOLD LABEL]</text>

  <!-- Source caption -->
  <g class="svg-label" font-size="9.5" fill="#9A9A9A">
    <text x="45" y="448">Illustrative only. [Additional caveat.]</text>
  </g>
</svg>
```

Bar height conversion (for score 0-100):
- `height = (value / 100) * 312`
- `y = 380 - height` (since y=380 is the x-axis)
- Example: value 91 → height 284 → y 96

## Pattern 5 — Architecture diagram (three layers)

```xml
<svg class="ex-svg" viewBox="0 0 1180 280" xmlns="http://www.w3.org/2000/svg">
  <rect width="1180" height="280" fill="#FFFFFF"/>

  <!-- Layer 1: Sources (neutral grey) -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B"><text x="45" y="34">SOURCES</text></g>
  <rect x="80" y="44" width="180" height="36" fill="#F5F5F3" stroke="#D8D8D8"/>
  <text x="170" y="66" text-anchor="middle" class="svg-body" font-size="11" fill="#1F1F1F">[Source 1]</text>
  <rect x="80" y="90" width="180" height="36" fill="#F5F5F3" stroke="#D8D8D8"/>
  <text x="170" y="112" text-anchor="middle" class="svg-body" font-size="11" fill="#1F1F1F">[Source 2]</text>

  <!-- Layer 2: Your modules (accent) -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B"><text x="320" y="34">[PRODUCT] MODULES</text></g>
  <rect x="320" y="44" width="180" height="36" fill="#E5EEF4" stroke="#0066A1"/>
  <text x="410" y="60" text-anchor="middle" class="svg-label" font-size="10" fill="#0066A1" font-weight="600">[MOD 1]</text>
  <text x="410" y="74" text-anchor="middle" class="svg-body" font-size="11" fill="#0A0A0A">[Mod 1 name]</text>
  <!-- ...more modules... -->

  <!-- Arrows from sources to modules (neutral) -->
  <g stroke="#6B6B6B" stroke-width="1.2" fill="none">
    <path d="M 260 62  L 320 62"  marker-end="url(#arr2)"/>
    <path d="M 260 108 L 320 108" marker-end="url(#arr2)"/>
  </g>

  <!-- Layer 3: Shared rail (dashed neutral) -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B"><text x="600" y="34">SHARED RAIL</text></g>
  <rect x="600" y="44" width="160" height="150" fill="#F5F5F3" stroke="#D8D8D8" stroke-dasharray="3 3"/>
  <text x="680" y="70" text-anchor="middle" class="svg-title" font-size="13" fill="#0A0A0A" font-weight="500">[Rail Item 1]</text>
  <text x="680" y="88" text-anchor="middle" class="svg-body" font-size="10.5" fill="#6B6B6B">[Sub-line]</text>
  <line x1="620" y1="108" x2="740" y2="108" stroke="#D8D8D8"/>
  <text x="680" y="128" text-anchor="middle" class="svg-title" font-size="13" fill="#0A0A0A" font-weight="500">[Rail Item 2]</text>
  <text x="680" y="146" text-anchor="middle" class="svg-body" font-size="10.5" fill="#6B6B6B">[Sub-line 1]</text>
  <text x="680" y="168" text-anchor="middle" class="svg-body" font-size="10.5" fill="#6B6B6B">[Sub-line 2]</text>

  <!-- Arrows modules → rail (accent) -->
  <g stroke="#0066A1" stroke-width="1.2" fill="none">
    <path d="M 500 62 L 540 62 L 540 100 L 600 100" marker-end="url(#arr2-accent)"/>
  </g>

  <!-- Layer 4: Downstream (black "certified" bar) -->
  <g class="svg-label" font-size="9.5" fill="#6B6B6B"><text x="820" y="34">DOWNSTREAM</text></g>
  <rect x="820" y="60" width="280" height="40" fill="#0A0A0A"/>
  <text x="960" y="78" text-anchor="middle" class="svg-label" font-size="10" fill="#FFFFFF" font-weight="600">[THE KEY ARTIFACT]</text>
  <text x="960" y="93" text-anchor="middle" class="svg-body" font-size="11" fill="#FFFFFF" opacity="0.8">[Sub-description]</text>

  <!-- Consumer boxes below the key artifact -->
  <rect x="820" y="130" width="135" height="34" fill="#F5F5F3" stroke="#D8D8D8"/>
  <text x="887" y="151" text-anchor="middle" class="svg-body" font-size="11" fill="#1F1F1F">[Consumer 1]</text>

  <!-- Source caption -->
  <g class="svg-label" font-size="9.5" fill="#9A9A9A">
    <text x="45" y="260">Source: [attribution].</text>
  </g>
</svg>
```

## Pattern 6 — 90-day timeline

```xml
<svg class="ex-svg" viewBox="0 0 1180 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="1180" height="340" fill="#FFFFFF"/>

  <!-- Timeline base -->
  <line x1="60" y1="100" x2="1120" y2="100" stroke="#0A0A0A" stroke-width="1.5"/>

  <!-- Phase markers (vertical ticks) -->
  <line x1="60"   y1="88" x2="60"   y2="112" stroke="#0A0A0A" stroke-width="1.5"/>
  <line x1="413"  y1="88" x2="413"  y2="112" stroke="#0A0A0A" stroke-width="1.5"/>
  <line x1="767"  y1="88" x2="767"  y2="112" stroke="#0A0A0A" stroke-width="1.5"/>
  <line x1="1120" y1="88" x2="1120" y2="112" stroke="#0A0A0A" stroke-width="1.5"/>

  <!-- Day labels -->
  <g class="svg-label" font-size="10" fill="#6B6B6B" text-anchor="middle">
    <text x="60"   y="80">DAY 0</text>
    <text x="413"  y="80">DAY 30</text>
    <text x="767"  y="80">DAY 60</text>
    <text x="1120" y="80">DAY 90</text>
  </g>

  <!-- Phase names (serif, accent) -->
  <g class="svg-title" font-size="14" fill="#0066A1" font-weight="600" text-anchor="middle">
    <text x="236" y="138">[PHASE 1]</text>
    <text x="590" y="138">[PHASE 2]</text>
    <text x="943" y="138">[PHASE 3]</text>
  </g>

  <!-- Phase bars (increasing accent intensity) -->
  <rect x="60"  y="148" width="353" height="6" fill="#E5EEF4"/>
  <rect x="413" y="148" width="354" height="6" fill="#B8D4E3"/>
  <rect x="767" y="148" width="353" height="6" fill="#0066A1"/>

  <!-- Milestones under each phase -->
  <g class="svg-body" font-size="11.5" fill="#1F1F1F">
    <text x="80" y="188" font-weight="600">[Phase 1 subtitle]</text>
    <text x="80" y="210">·  [Milestone 1]</text>
    <text x="80" y="228">·  [Milestone 2]</text>
    <text x="80" y="246">·  [Milestone 3]</text>
    <text x="80" y="264">·  [Milestone 4]</text>
    <text x="80" y="282">·  [Milestone 5]</text>
  </g>

  <!-- Phase 2 milestones: same pattern, x=433 -->
  <!-- Phase 3 milestones: same pattern, x=787 -->

  <!-- Anchoring outcome (black box, upper right) -->
  <rect x="930" y="36" width="200" height="36" fill="#0A0A0A"/>
  <text x="1030" y="52" text-anchor="middle" class="svg-label" font-size="9.5" fill="#FFFFFF" opacity="0.7">ANCHORING OUTCOME</text>
  <text x="1030" y="65" text-anchor="middle" class="svg-body" font-size="11" fill="#FFFFFF" font-weight="600">[The specific deliverable]</text>
  <path d="M 1120 72 L 1120 95" stroke="#0A0A0A" stroke-width="1" fill="none"/>

  <!-- Source caption -->
  <g class="svg-label" font-size="9.5" fill="#9A9A9A">
    <text x="45" y="320">Source: [attribution].</text>
  </g>
</svg>
```

---

## General SVG rules

- **Always include** `<rect width="..." height="..." fill="#FFFFFF"/>` as the first child — the background.
- **Always include** the source caption at the bottom left.
- **Never** use `<filter>`, shadows, or blurs. This register is clinical.
- **Do not** use rounded corners (`rx`, `ry`) on rectangles. Boxes are sharp.
- **Text centering**: use `text-anchor="middle"` on text elements positioned with their x at the center of the desired space.
- **Stroke widths**: primary axes 1.5, secondary lines 1.2, gridlines 1.0. Do not go thicker than 2.0 except for the composite/total bar outlines.
- **Arrows**: always use markers, never draw arrowheads manually.
- **Colors**: reference the same palette tokens as the CSS. Use `#0A0A0A` for ink, `#6B6B6B` for muted text, `#9A9A9A` for captions, `#0066A1` for accent, `#E5EEF4` for accent-soft.

When the accent color in the parent CSS is not blue, update ALL `#0066A1` and `#E5EEF4` references in the SVGs to the new accent / accent-soft values. Consistency across the document is what signals intentionality.
