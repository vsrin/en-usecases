# ElevateNow Platform — Architecture Reference

How all ElevateNow systems connect and work together. No local machine paths — this should be useful regardless of where you're working from.

## What ElevateNow Is

ElevateNow is a governance-first AI platform for insurance operations — not a single product but an interconnected set of systems that together let carriers and MGAs apply AI to underwriting, claims, and operations workflows with full audit trails, deterministic rules, and human-in-the-loop governance.

The foundational principle is deterministic rules first, LLM second. Every agent decision must trace to a governed knowledge source. LLMs fill in where deterministic methods can't — interpretation, synthesis, narrative generation — but not where they're just convenient.

### The Target Users

| Persona | Role | Primary Workspace |
|---------|------|------------------|
| **Jane Doe** | Sr. Underwriter | Underwriting Hub — submission queue, exceptions, eligibility, exposure |
| **Mike Torres** | Claims Director | Claims Hub — WC FNOL pipeline, decision queue, authority gates |

---

## Platform Components Overview

ElevateNow consists of five interconnected systems:

| System | What It Is | Status |
|--------|-----------|--------|
| **Workbench** | The practitioner UI — role-based workspaces for UW and Claims. React 19 frontend + Express backend. | Active, deployed |
| **GKR / CurationStudio** | The knowledge layer — deterministic eligibility, FNOL rules, BA appetite. FastAPI + React 18. | Active, deployed |
| **Flask Tool Server** | Python tool execution environment — all GKR tools run here. | Active, EC2 port 7000 |
| **Conductor** | Workflow orchestration (Netflix Conductor) — recipes that chain tools into pipelines. | Active, EC2 proxied via Cloudflare Workers |
| **Insights Site** | Research and insights publication arm — insights.elevatenow.tech | Active, Cloudflare Pages |

---

## System 1 — GKR / CurationStudio

**What it does:** Hosts the curated knowledge base (eligibility rules, appetite, FNOL triage, BA rules) and exposes them via API. Powers the deterministic gates that drive all underwriting and claims decisions.

**Backend:** FastAPI, Python. Deployed to EC2 at port 8001. Production domain: `gkr-curationstudio.elevatenow.tech`

**Frontend:** React 18 SPA. Admin interface for knowledge curators — browse chunks, approve drafts, run the curation pipeline, test rules.

**Database:** MongoDB `elevatenow_gkr` (knowledge base) + `elevatenow_docintel` (document intelligence pipeline)

**Key concepts:**
- **Knowledge chunks** — The atomic unit of knowledge. Each chunk has a type, domain, curation status, version, SIC/NAICS scope, and override layer.
- **Two-layer model** — Platform layer (carrier-neutral, ships to all) + Carrier layer (per-tenant overrides)
- **Three-gate eligibility** — Gate 1 (hard exclusions), Gate 2 (vertical appetite), Gate 3 (operations exclusion). Deterministic, zero LLM.
- **Curation pipeline** — 5-module pipeline: OCR Ingest → Template Match → Extract (LLM) → Validate → Load. Converts carrier source documents into governed chunks.

For complete GKR detail: see `Claude_gkr.md`.

---

## System 2 — Workbench

**What it does:** The practitioner-facing workspace. Underwriters see their submission queue with AI-generated assessments. Claims directors see their FNOL queue with triaged cases. Both roles have a Toolkit for running individual tools, a Projects space for research, and a Hub for queue management.

### Frontend (React 19 + TypeScript + Vite)

Deployed to Cloudflare Pages. Auto-deploys on push to main. Dev server: `localhost:5173`.

**Key architectural patterns:**

- **Tool registry** (`src/data/context-assembly/tool-registry.json`) — Master definition of all 44 tools. Each tool specifies: inputs, output renderer, persona access, Conductor workflow name. The entire tool form is generated dynamically from this registry — no hardcoded tool UIs.
- **Renderers** (`src/components/renderers/`) — Each tool has a dedicated renderer component that knows how to display that tool's structured output. Eligibility renders gate cards; Loss renders tables and verdicts; etc.
- **Hub pages** — `UnderwritingMonitorPage.tsx` and `ClaimsMonitorPage.tsx` are the primary practitioner workspaces. They display the queue with classification logic (auto_processed / exception / blocked), detail overlays, and trust mode filters (Full Queue / Guided / Autonomous).
- **Recipe service** (`src/services/recipe-service.ts`) — Executes Conductor workflows. POSTs to `/workflow/{name}`, polls GET `/workflow/{workflowId}` every 2 seconds, 5-minute timeout.

**Persona system:**

| Persona ID | Display Name | Default Hub |
|-----------|-------------|-------------|
| `underwriter` | Jane Doe | Underwriting Hub |
| `claims_ops` | Mike Torres | Claims Hub |

Persona drives: which Hub is shown, which tools appear in Toolkit (filtered by `persona_access` in tool-registry.json), what sidebar displays.

**Hub submission classification** (in `monitor-classify.ts`):
- `auto_processed` — confidence ≥ 95%, no conflicts, eligible
- `exception` — critical/underwriting/procedural tiers requiring attention
- `blocked` — confidence = 0 or `incomplete_data` flag

### Backend (Express 4 + TypeScript + MongoDB)

Dev server: `localhost:3001`. Deployed to EC2. Read-only — all writes happen via Conductor recipes.

**Three MongoDB databases:**
- `submission_intake_gkr` — Submissions, agent responses, case memory, unified view
- `wc_fnol_platform` — WC claims, compensability assessments, reserve calculations, workflow executions
- `psu_intelligence` — PSU (Public Sector Underwriting) submissions

**All backend routes require Auth0 JWT** (except `/api/health`).

Key routes:
```
GET  /api/submissions            → All UW submissions with KPIs
GET  /api/submissions/:caseId    → Single submission (from unified view)
GET  /api/claims?lob=wc|auto     → Claims with KPIs
GET  /api/claims/:caseId         → Single claim
GET  /api/tools                  → Tool catalog
GET  /api/psu-submissions        → PSU submissions
GET  /api/health                 → Health check
```

---

## System 3 — Flask Tool Server

**What it does:** Python execution environment for all GKR tools. Each tool is a Python class that reads from the GKR knowledge base and produces structured JSON output.

**Deployment:** EC2, port 7000. Tools auto-sync from Tool_Chest GitHub repository on startup.

**Tool deployment architecture:**
- Tools are flat Python files in `Tool_Chest/Tools/` on GitHub (PascalCase filenames matching the class name)
- Flask server loads all tools from this flat directory
- Tool metadata (input/output schema, dependencies) is registered in a tool registry MongoDB collection
- **Critical rule:** The registered `input_schema` is the source of truth for input validation — it does NOT auto-update when the .py file changes. Schema changes require delete + re-register in Agentic Studio.

**Two LOB tool families:**
- WC: Jurisdiction, Compensability, Benefits, Subrogation, Authority, Sensitive Indicators, Intelligence Report
- Auto: Jurisdiction, Liability, Damage, Subrogation, Authority, Sensitive Indicators, Intelligence Report

All tools follow the same output contract:
```json
{
  "response": "flat string narrative",
  "decision_trace": { "...structured output..." }
}
```

---

## System 4 — Conductor Orchestration

**What it does:** Netflix Conductor orchestrates multi-step workflows (recipes) that chain tool calls, parallel forks, and data transformations. All tool execution in ElevateNow goes through Conductor — it is the single execution plane.

**Deployment:** EC2. Proxied via Cloudflare Workers at `conductor-proxy.vs-ca9.workers.dev` to avoid CORS and add caching.

**Key recipe:** `GKR_Submission_Intake v5` — The primary underwriting intake workflow.

```
Sequential: auth → fetch submission → normalize payload
FORK_JOIN (parallel):
  Branch 1: GKR eligibility tool → pattern chunk fetch → eligibility LLM agent
  Branch 2: Exposure pattern fetch → exposure LLM agent
  Branch 3: Loss pattern fetch → loss LLM agent
Sequential (after join):
  GKRCompletenessCheckTool → InsuranceVerify
  GKRPropertyEvalTool → PropEval
  GKRBusinessProfileTool → BusineesProfileSearch
Final: push_to_mongo → merges all 6 outputs to AGENT_RESPONSES
```

**All cycles are user-initiated.** Conductor never runs automatically. The UI shows "Submission modified since last evaluation" as a cue but takes no action — the user triggers the recipe.

---

## System 5 — Insights Site (insights.elevatenow.tech)

**What it does:** ElevateNow's practitioner research and publication arm. Hosts use cases, benchmarks, and practitioner perspectives.

**Deployment:** Cloudflare Pages. Auto-deploys from `en-usecases` GitHub repo on push to main. Build command: `tsc -b && vite build`.

**Architecture:** Single self-contained `index.html` at the project root (not a React SPA — pure static HTML + inline JS/CSS). Use case pages are standalone HTML files in `public/usecases/`.

For publishing new use cases: see `Claude_usecasepub.md`.

---

## The Data Flow (End to End)

This is the critical chain. A change at any layer affects all downstream consumers.

```
1. CurationStudio curates knowledge chunks → elevatenow_gkr DB

2. GKR API routes query elevatenow_gkr at runtime
   (GET /api/gkr/eligibility, /api/gkr/fnol, etc.)

3. Flask Tool Server tools call GKR API for rules/chunks

4. Conductor recipe orchestrates tools:
   → Each tool executes, returns structured output
   → PushToMongoTool merges outputs into AGENT_RESPONSES collection
      (submission_intake_gkr.agent_responses, keyed by case_id)

5. MongoDB submission_unified_view aggregates:
   submission_intake_gkr.BP_DATA + AGENT_RESPONSES + case_memory_summary
   → One document per case_id with all data

6. Workbench Backend API reads submission_unified_view:
   GET /api/submissions/:caseId

7. Workbench Frontend renders:
   → Hub detail overlay: 4 tabs (Data Completeness, Exposure, Loss, Eligibility)
   → Each tab consumes one AGENT_RESPONSES key
```

**Debugging data display issues:** Trace through all 7 layers. If a field isn't showing in the UI, check: (1) Did the GKR tool produce it? (2) Did push_to_mongo wire it? (3) Is it in AGENT_RESPONSES? (4) Does the unified view project it? (5) Does the backend type include it? (6) Does the frontend renderer read it?

---

## MongoDB: Key Databases and Collections

### `elevatenow_gkr` (Knowledge Layer — stateless)

| Collection | Purpose |
|-----------|---------|
| `knowledge_chunks` | Curated knowledge: appetite, exclusions, patterns, triage rules |
| `knowledge_templates` | Document extraction templates for carrier onboarding pipeline |
| `reference_data` | NAICS/SIC crosswalk, exclusion matrices, vertical index, jurisdiction rules, BA appetite |
| `ontology_entities` | 81 semantic entities (products, stages, verticals) |
| `ontology_entity_edges` | Entity-to-entity relationships |
| `chunk_ontology_edges` | Chunk-to-entity relationships |
| `curation_audit` | Immutable mutation log |
| `curation_pipeline_runs` | Pipeline execution state |

### `submission_intake_gkr` (Submission Lifecycle — stateful)

| Collection | Purpose |
|-----------|---------|
| `BP_DATA` (also called `submissions`) | Live submission data |
| `AGENT_RESPONSES` | Tool outputs — one document per case_id, tools update their keyed node |
| `case_memory_events` | Append-only decision ledger — written only on user acknowledgment |
| `case_memory_summary` | VIEW over events — auto-computed, one doc per case_id |
| `submission_unified_view` | Materialized view: BP_DATA + AGENT_RESPONSES + case_memory |

### `wc_fnol_platform` (Claims — stateful)

| Collection | Purpose |
|-----------|---------|
| `wc_claims` | WC FNOL claim records |
| `wc_compensability_assessments` | Compensability assessment outputs |
| `wc_reserve_calculations` | Reserve calculation outputs |
| `wc_workflow_executions` | Conductor execution records |

---

## Agent Response Contract

Every tool and LLM agent uses GKR format. No other format is used anywhere in the platform.

```json
{
  "response": "Flat string — markdown narrative, not HTML. This is the narrative report.",
  "decision_trace": {
    "...": "Structured data — gate results, verdicts, confidence scores, conditions"
  }
}
```

**AGENT_RESPONSES key mapping** (what flows through to the unified view):

| Key in AGENT_RESPONSES | Source | Type |
|------------------------|--------|------|
| `EligibilityCheck` | GKR three-gate tool + LLM synthesis | Hybrid |
| `ExposureInsights` | LLM synthesis via UW-CP-001 | LLM governed by cognitive pattern |
| `LossInsights` | LLM synthesis via UW-CP-002 | LLM governed by cognitive pattern |
| `InsuranceVerify` | GKRCompletenessCheckTool | Deterministic |
| `PropEval` | GKRPropertyEvalTool | Deterministic |
| `BusineesProfileSearch` | GKRBusinessProfileTool | Deterministic (note: "Businees" is a typo in production — do not correct it without updating all consumers) |

---

## Case Memory (Governance Layer)

Case memory is the decision ledger that accumulates across evaluation cycles for a submission.

**Two collections:**
- `case_memory_events` — Immutable append-only. One record per acknowledged evaluation. Written only when user explicitly acknowledges.
- `case_memory_summary` — MongoDB view, auto-computed. One virtual document per case_id showing current state.

**Acknowledgment gate:** The user must explicitly acknowledge each Eligibility evaluation result. `agent_responses` = what tools computed (updated every run). `case_memory` = what the underwriter decided (written only on acknowledgment). Nothing is written silently.

**Condition resolution vs. rule override:**
- `condition_satisfaction` — User satisfied what the gate flagged ("CUO approved — ref CUO-2026-0412")
- `rule_override` — User proceeded without satisfying the gate. Requires justification + escalation trail. Heavy governance.

**Initial cycle:** case_memory is null. Submission Fetcher reads unified view, Eligibility Checker calls GKR, user acknowledges → first event written.

**Update cycle:** Submission Fetcher reads unified view (now includes case_memory_summary). Eligibility Checker overlays case_memory on GKR result. User acknowledges → new event appended.

---

## Authentication

All ElevateNow services use Auth0 for authentication.

**Auth0 tenant:** `dev-y34ckcr0xp2b4064.us.auth0.com`
**Flow:** PKCE (no client secret on frontend)
**API audience:** `https://tm-lossrun-api`
**Token type:** JWT Bearer token

- Workbench frontend injects Bearer token on all API calls
- Workbench backend verifies JWT on all routes (except `/api/health`)
- CurationStudio backend verifies JWT in FastAPI middleware (bypassed when `NODE_ENV != production` and `ENFORCE_AUTH` not set)

---

## Deployment Infrastructure

| Component | Host | Port | Domain |
|-----------|------|------|--------|
| Workbench Frontend | Cloudflare Pages | N/A | workbench.elevatenow.tech (auto-deploy on push) |
| Workbench Backend | EC2 | 3001 | backend.elevatenow.tech |
| CurationStudio Backend | EC2 (Docker) | 8001 | gkr-curationstudio.elevatenow.tech |
| Flask Tool Server | EC2 | 7000 | (internal) |
| Conductor | EC2 | 8080 | proxied via conductor-proxy.vs-ca9.workers.dev |
| Insights Site | Cloudflare Pages | N/A | insights.elevatenow.tech (auto-deploy on push) |
| MongoDB | Atlas | N/A | artifi.2vi2m.mongodb.net |

**CurationStudio CI/CD:** Push to `main` → GitHub Actions builds Docker image → pushes to AWS ECR → deploys to EC2 via SSM. Triggered automatically.

**Workbench Frontend:** Cloudflare Pages auto-deploys on push to `main` of the `en-workspace` repo. Build command: `tsc -b && vite build`. TypeScript errors fail the build — always run `npx tsc --noEmit` before pushing.

---

## Cross-Cutting Rules

1. **All MongoDB writes happen via Conductor recipes or CurationStudio pipeline.** The Workbench Backend is read-only.
2. **GKR format only** for all agent responses everywhere.
3. **Deterministic rules first, LLM second.** Every agent decision must trace to a governed `chunk_id`.
4. **All cycles are user-initiated.** No recipe runs automatically. No silent writes.
5. **Carrier neutralization** on all platform-layer content — carrier names replaced with "the carrier" automatically in the pipeline.
6. **Two-layer model everywhere** — platform layer + carrier override layer, runtime resolution always checks carrier first.
7. **Case memory is immutable** — `case_memory_events` records are never modified after write. Only new events are appended.

---

## Git Commit Convention

All commit messages must begin with a bracketed prefix for Cloudflare and GitHub log readability:

| Area | Prefix |
|------|--------|
| PSU pipeline | `[PSU]` |
| BA / Binding Authority | `[BA]` |
| Underwriting Hub/pipeline | `[UW]` |
| Claims Hub/FNOL | `[Claims]` |
| GKR / CurationStudio | `[GKR]` |
| ToolChest / Flask tools | `[Tools]` |
| Auth / shared infra | `[Infra]` |
| Insights site / use cases | `[Insights]` |
| Cross-cutting | `[Workbench]` |

Example: `[GKR] feat: add GL jurisdiction resolver chunk type`

---

## Technology Stack Summary

| Layer | Tech |
|-------|------|
| Workbench Frontend | React 19, TypeScript 5.9, Vite 7, Auth0, pure CSS |
| Workbench Backend | Express 4.21, TypeScript 5.7, MongoDB Atlas, Auth0 JWT |
| GKR Backend | FastAPI (Python), PyMuPDF, pdfplumber, pytesseract, OpenCV, Groq, OpenAI |
| GKR Frontend | React 18, React Router DOM 6, D3 7, Vite 5 |
| Orchestration | Netflix Conductor, Cloudflare Workers proxy |
| Databases | MongoDB Atlas (3 databases: elevatenow_gkr, submission_intake_gkr, wc_fnol_platform) |
| Auth | Auth0 (PKCE, JWT Bearer) |
| Hosting | Cloudflare Pages (frontends), EC2 (backends + tools) |
| LLM | Groq (primary, llama-3.3-70b), OpenAI (fallback) |
| Container | Docker (CurationStudio backend only), AWS ECR |

---

## What's Live vs. In Progress

| Feature | Status |
|---------|--------|
| Three-gate GKR eligibility | Live |
| WC FNOL pipeline (full 7 tools) | Live |
| Auto FNOL pipeline (full 7 tools) | Live |
| Underwriting Hub (UW submissions queue + detail overlay) | Live |
| Claims Hub (WC claims queue + compensability + reserves) | Live |
| PSU Hub (Public Sector Underwriting) | Live |
| BA (Binding Authority) broker portal | In progress |
| Case Memory acknowledgment UX | Designed, partially implemented |
| T2 extraction layer (regex + spaCy) | Planned — highest priority |
| T2.5 (Granite-Docling) evaluation | Planned |
| T4 (Ollama local LLM) | Planned |
