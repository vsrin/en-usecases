# GKR — Governed Knowledge Retrieval

What it is, how it works, why it's different from RAG, and how it connects to every decision the Workbench surfaces.

---

## What GKR Is

GKR is a deterministic, ontology-indexed knowledge engine for insurance underwriting and claims decisions. It replaces probabilistic RAG with curated, versioned knowledge chunks — every decision traces to a specific `chunk_id`, version, and override layer.

Three things it's not: an extraction system (GKR doesn't read raw documents), a general-purpose LLM (no probabilistic text generation in the core gate evaluations), and a traditional BRMS like Drools (rules live as structured knowledge chunks with governance metadata, not code). The core principle is deterministic rules first, LLM second. SIC code is the primary routing key throughout all three gates.

---

## The Problem GKR Solves

RAG-based approaches fail in insurance for reasons that are structural, not implementation quality. Probabilistic retrieval produces different answers on the same question — in underwriting, that's not a quality issue, it's a governance failure. When a carrier changes their appetite and the LLM was trained on old data, there's no mechanism to detect the divergence. "The model said CONDITIONAL" doesn't satisfy a regulator; they want to know which rule produced that verdict, which version, and who approved it. And a general RAG system can't cleanly serve both carrier-neutral platform content and carrier-specific overrides with the right precedence every time.

GKR is built around all four of those failures: deterministic evaluation of curated, versioned, two-layer knowledge with a complete audit trail per decision.

---

## Three-Gate Eligibility Pipeline (Deterministic, Zero LLM)

The three-gate pipeline is GKR's core function. It evaluates a submission profile `{ sic, naics, state, coverages }` and produces a deterministic gate trace.

### Gate 1 — Hard Exclusions (SHORT-CIRCUITS on FAIL)

**Input:** SIC code
**Process:** SIC → NAICS crosswalk (via `reference_data`) → exclusion matrix check
**Output:** PASS (continue to Gate 2) or FAIL (short-circuit — no further evaluation)

Hard exclusions are absolute. Examples: certain SIC codes are never written (e.g., gunpowder manufacturers, nuclear facilities). Gate 1 doesn't ask "how likely is this to be a problem" — it asks "is this categorically excluded?" The short-circuit behavior is intentional: if Gate 1 fails, Gates 2 and 3 are not evaluated.

### Gate 2 — Vertical Appetite

**Input:** SIC code → vertical index lookup
**Process:** SIC maps to one or more `industry_vertical` chunks. Each chunk carries an eligibility signal (ELIGIBLE, CONDITIONAL, DECLINE) and conditions.
**Output:** ELIGIBLE / CONDITIONAL / DECLINE with specific conditions

Gate 2 represents the carrier's underwriting appetite for the industry segment. "CONDITIONAL" means "eligible subject to specific conditions being met" — for example, a restaurant is ELIGIBLE for GL but CONDITIONAL on fire suppression systems being verified.

### Gate 3 — Operations Exclusion

**Input:** Business description text (freeform)
**Process:** Keyword match against `operations_exclusion` chunks
**Output:** PASS (no excluded operations found) or FAIL with matched exclusion chunk(s)

Gate 3 catches operations-level exclusions that a SIC code alone can't capture. A SIC for "Building Contractors" might be ELIGIBLE at Gate 2, but if the business description mentions "explosives demolition work," Gate 3 catches it. This gate uses keyword matching (not LLM interpretation) — which means it is deterministic and auditable.

### Gate Trace Output

```json
{
  "gate_1": {
    "status": "PASS",
    "sic": "1521",
    "naics_mapped": "236115",
    "exclusion_checked": true,
    "matched_exclusions": []
  },
  "gate_2": {
    "status": "CONDITIONAL",
    "vertical": "Residential Building Contractors",
    "chunk_id": "UW-IV-1521-v2",
    "conditions": ["COND-001", "COND-002"]
  },
  "gate_3": {
    "status": "PASS",
    "keywords_checked": 47,
    "matched_exclusions": []
  },
  "verdict": "CONDITIONAL",
  "confidence": 72
}
```

Every gate trace records the `chunk_id` of the knowledge that drove the decision. This is the audit chain.

---

## Knowledge Architecture

### Two-Layer Content Model

GKR operates a two-layer content model that governs every knowledge chunk:

| Layer | `override_layer` value | Description | Deployment |
|-------|----------------------|-------------|-----------|
| **Platform layer** | `platform_only` | Carrier-neutral baselines; industry-standard appetite, exclusions, and rules | Ships to every customer deployment |
| **Carrier layer** | `carrier_supersedes` | Carrier-specific overrides; tagged with `carrier_id` | Per-tenant; takes precedence at runtime |

**Runtime resolution:** GKR always checks carrier layer first. If a carrier-specific chunk exists for the query, it is used. If not, the platform layer chunk is the fallback. This means a carrier can override any platform rule without modifying the platform content.

### Database: `elevatenow_gkr`

The GKR knowledge base lives in MongoDB. Key collections:

| Collection | Count (approx.) | Purpose |
|-----------|----------------|---------|
| `knowledge_chunks` | 864+ | All knowledge: appetite, exclusions, patterns, triage rules |
| `knowledge_templates` | 143 | Industry-standard baselines for document extraction |
| `reference_data` | 7,700+ | NAICS/SIC crosswalk, exclusion matrices, vertical index, jurisdiction rules, BA appetite data |
| `chunk_ontology_edges` | 8,500+ | Typed graph edges: CLASSIFIES, GOVERNS, INFORMS, SUPERSEDES, ANCHORED_TO |
| `ontology_entities` | 81 | 15 products, 6 stages, 60 verticals |
| `ontology_entity_edges` | 1,554 | CONTAINS_SIC, OFFERS_PRODUCT, EVALUATED_AT |
| `curation_audit` | Growing | Immutable mutation log — every chunk change is recorded |

### Chunk Types (19 Total)

**Underwriting (9):**
- `industry_vertical` — appetite signal for an industry segment (used in Gate 2)
- `coverage_exclusion` — specific coverage lines excluded for a class/operation
- `operations_exclusion` — operations-level keyword exclusions (used in Gate 3)
- `product_availability` — which products are available for a given class
- `hazard_class` — hazard classification rules for rating
- `gate_definition` — gate behavior definitions
- `threshold_framework` — confidence/threshold rules for STP and routing
- `stp_exception` — straight-through processing override rules
- `segment_restriction` — segment-level write restrictions

**FNOL (3):**
- `triage_rule` — FNOL routing rules (jurisdiction, severity, escalation triggers)
- `jurisdiction_rule` — state-specific statutory rules for WC, auto
- `sensitive_indicator` — keywords/patterns that trigger escalation (fraud, litigation, severity)

**Claims Authority (1):**
- `authority_matrix` — reserve and settlement authority by amount, coverage, seniority

**Binding Authority (5):**
- `ba_class_appetite` — per-class eligibility matrix (BOP/GL/WC: ACCEPT/REFER/NOT_OFFERED)
- `ba_geographic_restriction` — state/county-level geographic restrictions
- `ba_score_gate` — score thresholds for binding decisions
- `ba_rating_rule` — BA-specific rating rules
- `ba_coverage_gate` — coverage-specific BA conditions

**Cross-domain:**
- `cognitive_pattern` — institutional methodology patterns (UW-CP-001/002/006) that govern LLM agent behavior
- `vertical_insight` — synthesized knowledge products for specific verticals
- `decision_signal` — decision output templates

### Chunk Schema (Key Fields)

```json
{
  "chunk_id": "UW-IV-1521-v2",
  "chunk_type": "industry_vertical",
  "domain": "underwriting",
  "curation_status": "active",
  "version": 2,
  "content_text": "Residential building contractors SIC 1521...",
  "classification_scope": { "sic_ranges": [["1521", "1521"]] },
  "applicable_products": ["GL", "WC", "Property"],
  "applicable_stages": ["Appetite", "Eligibility"],
  "override_layer": "platform_only",
  "carrier_id": null,
  "effective_date": "2026-01-01",
  "superseded_by": null
}
```

### Curation Lifecycle

Every chunk follows a governed lifecycle. Status changes are immutable in `curation_audit`:
```
draft → review → approved → active → stale → revalidated → expired → superseded
```

Only `active` chunks are used in gate evaluation. `stale` chunks have been flagged for review but remain active until superseded. `expired` chunks are retained for audit history.

---

## How GKR Drives Workbench Decisions

### The Full Pipeline

```
CurationStudio (knowledge chunks curated) → elevatenow_gkr DB
  → GKR Tools (Python, Flask server) read chunks at runtime
    → Conductor Recipes orchestrate tool execution
      → AGENT_RESPONSES collection (submission_intake_gkr DB)
        → submission_unified_view (MongoDB aggregation)
          → Workbench Backend API (Express)
            → Workbench UI (React) — Hub detail overlay
```

### The GKR_Submission_Intake Recipe (v5)

This is the primary workflow that drives all six agent outputs for an underwriting submission:

1. **Sequential phase:** Receive submission → authenticate → fetch submission data → normalize payload
2. **FORK_JOIN phase (3 parallel pipelines):**
   - Eligibility: GKR three-gate evaluation → cognitive pattern fetch → LLM synthesis agent
   - Exposure: Cognitive pattern fetch → LLM synthesis agent
   - Loss: Cognitive pattern fetch → LLM synthesis agent
3. **Sequential phase (3 deterministic GKR tools):**
   - `GKRCompletenessCheckTool` → stored as `InsuranceVerify` in AGENT_RESPONSES
   - `GKRPropertyEvalTool` → stored as `PropEval`
   - `GKRBusinessProfileTool` → stored as `BusineesProfileSearch`
4. **push_to_mongo:** Merges all 6 agent outputs into AGENT_RESPONSES collection

### Agent Response Format (GKR Format)

All agents produce GKR format. No other format is used.

```json
{
  "response": "Full markdown narrative (not HTML). This is the agent report.",
  "decision_trace": {
    "gate_1": { "status": "PASS", "details": {...} },
    "gate_2": { "status": "CONDITIONAL", "chunk_id": "UW-IV-1521-v2", "conditions": [...] },
    "gate_3": { "status": "PASS" },
    "verdict": "CONDITIONAL",
    "confidence": 72,
    "governing_pattern": "UW-CP-001 v2.0"
  }
}
```

### Cognitive Pattern Architecture

GKR cognitive patterns are the institutional underwriting methodology stored as chunks. They govern LLM agent behavior — the LLM is an executor, not a reasoner.

| Pattern | Agent | Purpose |
|---------|-------|---------|
| `UW-CP-001 v2.0` | PatternSummaryAgent (Exposure) | 9-pattern exposure interrogation + control assessment |
| `UW-CP-002 v1.0` | PatternSummaryAgent (Loss) | Loss validation with four-lens analysis |
| `UW-CP-006` | EligibilityDecisionAgent | Eligibility synthesis from 3-gate tool output |

Every LLM agent report begins with a `@@STATUS_BLOCK` that is parsed by PushToMongoTool into `decision_trace`:
```
@@STATUS_BLOCK_START
ANALYSIS_TYPE: Exposure Analysis
VERDICT: REFER
CONFIDENCE: 65
ACTION: REQUEST INFO
GOVERNING_PATTERN: UW-CP-001 v2.0
@@STATUS_BLOCK_END
```

### What the Workbench UI Shows

The Workbench Hub detail overlay has four tabs, each consuming one or more GKR agent outputs:

| Tab | Agent Source | Type |
|-----|-------------|------|
| **Data Completeness** | `InsuranceVerify` (GKRCompletenessCheckTool) | Deterministic — gate-by-gate completeness with % and quality tier |
| **Exposure Analysis** | `ExposureInsights` (LLM synthesis via UW-CP-001) | Hybrid — LLM narrative governed by cognitive pattern |
| **Loss Analysis** | `LossInsights` (LLM synthesis via UW-CP-002) | Hybrid — LLM narrative governed by cognitive pattern |
| **Eligibility** | `EligibilityCheck` (GKR three-gate + LLM synthesis) | Hybrid — deterministic gate trace + LLM narrative |

---

## Case Memory — The Governance Layer

GKR evaluates rules against the current submission state. What GKR produces is immutable for a given submission profile. What the underwriter does with that evaluation is tracked separately in Case Memory.

### Two Collections

- **`case_memory_events`** — Append-only, one record per acknowledged evaluation. Immutable once written. Contains the gate trace snapshot, verdict, conditions resolved, conditions pending, user context, and override type.
- **`case_memory_summary`** — MongoDB view over events. One virtual document per case_id. Auto-computed. Tracks current state: eval count, latest verdict, conditions pending/resolved, case status.

### The Acknowledgment Gate

Nothing is written to case memory silently. The underwriter must explicitly acknowledge each evaluation result. The UI detects `response_type: "decision_signal"` on the EligibilityCheck output and presents the conditions gate. The underwriter reviews, provides context, and clicks acknowledge. Only then does the `case_memory_events` record get written.

**Why:** The distinction between `agent_responses` (what tools computed) and `case_memory` (what the underwriter decided) is fundamental to governance. `agent_responses` is updated every run. `case_memory` is the immutable decision ledger.

### Condition Resolution vs. Override

- **Condition satisfaction** — Underwriter fulfills what a gate flagged (e.g., "CUO approved — ref CUO-2026-0412"). Medium governance.
- **Rule override** — Underwriter proceeds without satisfying the gate condition. Heavy governance: requires explicit justification + escalation trail.

`case_memory_events.override_type` records the category. This is the field that creates the full audit chain for regulatory examination.

---

## FNOL Tools — GKR Applied to Claims

GKR's knowledge architecture extends to FNOL processing via two LOB families of tools:

### WC (Workers Compensation) Tools
- `WCJurisdictionResolverGKR` — Applies state statutory jurisdiction rules from `jurisdiction_rule` chunks
- `WCCompensabilityAnalyzerGKR` — Assesses compensability with confidence scoring
- `WCBenefitsCalculatorGKR` — Calculates statutory benefits (indemnity + medical) from jurisdiction data
- `WCSubrogationScreenerGKR` — Screens for third-party liability indicators
- `WCAuthorityGateGKR` — Routes based on `authority_matrix` chunks
- `WCSensitiveIndicatorDetectorGKR` — Detects fraud/litigation/severity signals from `sensitive_indicator` chunks
- `WCIntelligenceReportGKR` — Synthesizes all WC tool outputs into a single adjuster intelligence brief

### Auto (Commercial Auto) Tools
Parallel structure to WC: `AutoJurisdictionResolverGKR`, `AutoLiabilityAnalyzerGKR`, `AutoDamageEstimatorGKR`, `AutoSubrogationScreenerGKR`, `AutoAuthorityGateGKR`, `AutoSensitiveIndicatorDetectorGKR`, `AutoIntelligenceReportGKR`

All tools are Python classes deployed to a Flask server. They read from `elevatenow_gkr.knowledge_chunks` and `elevatenow_gkr.reference_data` at runtime — knowledge updates in CurationStudio are immediately available to all tools without tool restarts.

---

## Binding Authority — The Fourth Domain

BA (Binding Authority) extends GKR to the alternative distribution channel. The target use case is producer-facing appetite check for carriers running binding authority programs.

**BA appetite data lives in `reference_data`** (not `knowledge_chunks`) with two table types:
- `ba_class_appetite` — Per-class matrix: category + class name + BOP/GL/WC status (ACCEPT/REFER/NOT_OFFERED)
- `ba_geographic_restriction` — State/county-level restriction overrides

**BA API endpoints:**
- `POST /api/gkr/ba/chat` — Conversational appetite check (Groq LLM at temp 0.2 — the only non-deterministic BA endpoint)
- `POST /api/gkr/ba/check` — Structured eligibility check against appetite matrix (deterministic)
- `GET /api/gkr/ba/appetite?carrier_id=GREAT_AMERICAN` — Full appetite table
- `POST /api/gkr/ba/ingest-bulletin` — Bulletin ingestion (PDF or text) → LLM extraction → BA chunks in `knowledge_chunks`

---

## CurationStudio — The Knowledge Management Layer

CurationStudio is the admin interface for GKR knowledge. It is not customer-facing — it is the tool for ElevateNow (and carriers) to curate, govern, and deploy knowledge.

**Backend:** FastAPI running on port 8000 (production: port 8001 at gkr-curationstudio.elevatenow.tech)
**Frontend:** React 18 SPA with 30+ admin pages
**Database:** `elevatenow_gkr` + `elevatenow_docintel`

### The 5-Module Curation Pipeline

When a carrier onboards, their source documents (policy forms, appetite guides, bulletins) are processed through the pipeline:

1. **Document Ingest & OCR** — PDF/DOCX → pages with quality scores (PyMuPDF + Tesseract fallback)
2. **Template Matching** — Source content matched to platform knowledge templates
3. **Delta Extraction** — LLM extraction (Groq/llama-3.3-70b, temp 0.0) — structured fields with citations; carrier names neutralized automatically
4. **Validation & Quality Gate** — Schema checks: required fields, content length 50-1500 words, keyword count 5-15
5. **Classification & Load** — Inserts validated chunks into `knowledge_chunks`; generates ontology edges; writes `curation_audit`

**Carrier neutralization (mandatory):** Platform-layer content must not reference specific carriers. The pipeline automatically replaces carrier names ("Travelers", "Chubb", "Hartford") with "the carrier" during extraction. This ensures platform content ships to any carrier without modification.

---

## Differentiators

### vs. RAG-Based Systems

| Dimension | Generic RAG | GKR |
|-----------|------------|-----|
| Retrieval | Probabilistic vector similarity | Deterministic SIC/NAICS routing |
| Answer variance | Different answer on same query | Zero variance — identical inputs → identical outputs |
| Knowledge currency | Stale until vector store rebuild | Active chunks serve immediately after approval |
| Audit trail | "Cosine similarity ≥ 0.8" | chunk_id + version + override_layer |
| Carrier-specificity | Single shared index | Two-layer: carrier overrides platform at runtime |
| Governance lifecycle | None | draft → review → approved → active → expired |

### vs. Traditional BRMS (Drools, FICO Blaze)

| Dimension | Traditional BRMS | GKR |
|-----------|----------------|-----|
| Knowledge format | Code (Java/DRL) | Structured text chunks with metadata |
| Change management | Dev cycle required | CurationStudio UI → approval → immediate |
| LLM integration | None | Cognitive patterns govern LLM agents natively |
| Carrier onboarding | Major implementation project | 5-module pipeline: source doc → governed chunk in hours |
| Semantic layer | None | Ontology edges: CLASSIFIES, GOVERNS, INFORMS, SUPERSEDES |

### vs. External LLM Pipelines

| Dimension | LLM-only pipeline | GKR |
|-----------|-----------------|-----|
| Determinism | No | Yes (for gate evaluation) |
| Data sovereignty | External API = PHI risk | GKR evaluates within customer infrastructure |
| Explainability | "The model said so" | chunk_id + gate trace + version |
| Knowledge ownership | Carrier's rules absorbed into model | Carrier curates their own layer |
| Update mechanism | Retraining or prompt engineering | CurationStudio approval workflow |

---

## Quick Reference: Key API Endpoints

All GKR routes are mounted at `/api/gkr/*` on the CurationStudio FastAPI backend.

| Endpoint | Purpose |
|----------|---------|
| `POST /api/gkr/eligibility` | Full three-gate evaluation — primary production endpoint |
| `POST /api/gkr/fnol` | FNOL triage routing (jurisdiction, authority, indicators) |
| `POST /api/gkr/resolve` | Full knowledge context for a submission profile |
| `GET /api/gkr/coverage` | Coverage gap analysis by NAICS/SIC |
| `GET /api/gkr/verticals` | List all active verticals |
| `POST /api/gkr/ba/check` | BA eligibility check |
| `POST /api/gkr/ba/chat` | BA conversational appetite probe |
| `POST /api/gkr/ba/ingest-bulletin` | Ingest BA bulletin → chunks |

---

## Environment Configuration

```
ARTIFI_MONGO_CONNECTION_STRING=mongodb+srv://artifi:root@artifi.2vi2m.mongodb.net/...
TARGET_DB=elevatenow_gkr           # Knowledge database
DOCINTEL_DB=elevatenow_docintel    # Document Intelligence database
GROQ_API_KEY=...
OPENAI_API_KEY=...                 # Fallback to Groq
GITHUB_PAT=...                     # For Tool_Chest sync on startup
```

For customer deployments: `TARGET_DB=<customer>_gkr` — each customer gets their own isolated knowledge database that inherits the platform layer and hosts their carrier layer.
