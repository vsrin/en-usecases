import type { ProductMeta } from '../types/product';

/**
 * ElevateNow accelerator catalog.
 *
 * Each product's demoboard lives at /public/demoboards/<slug>.html and is
 * iframed inline on the product page. Use cases attached via useCaseSlugs
 * show up under "Use cases that exercise this product".
 *
 * When a demoboard file does not yet exist, demoboardPath is omitted —
 * the product page renders a "Demoboard in production" placeholder.
 */

export const products: ProductMeta[] = [
  // ─────────────────────────── AI-Ready Data Pipelines ───────────────────────────
  {
    slug: 'assure',
    name: 'Assure',
    wordmark: 'ASSURE',
    tagline: 'Data quality for structured and unstructured — before AI consumes it.',
    layer: 'pipelines',
    status: 'ga',
    metrics: [
      { label: '0–100',     description: 'composite trust score per data product across 10 dimensions' },
      { label: 'Proactive', description: 'existing DQ tools observe & report — nothing stops bad data reaching AI' },
      { label: 'Full Trail', description: 'every certification scored, timestamped & traceable for regulators' },
    ],
    summary:
      'AI decisions are only as good as the data behind them. Three modules — DQ Intelligence, DQ Enforcement, and Document Certification — score, gate, and certify every data product (structured and unstructured) before it reaches your AI agents. 10-dimension composite trust score, pipeline-embedded enforcement gate, PDF/loss run/ACORD certification, full audit trail for regulatory inquiries.',
    demoboardPath: 'demoboards/assure.html',
    demoboardVariant: 'Pre-read — customer-specific',
    useCaseSlugs: ['data-quality-certification'],
  },
  {
    slug: 'redact',
    name: 'Redact',
    wordmark: 'REDACT',
    tagline: 'Sensitive data detection and redaction — structured and unstructured.',
    layer: 'pipelines',
    status: 'ga',
    metrics: [
      { label: '1,100+',      description: 'global sensitive data types — PHI, PII, PCI, HIPAA, GDPR' },
      { label: 'Never Leaves', description: 'data stays in your environment — redaction in-pipeline before egress' },
      { label: 'Certified',    description: 'clean output package with full audit trail of every redaction event' },
    ],
    summary:
      'Sensitive data flows into AI pipelines every day — undetected, unredacted, unaudited. Redact (Shield) enforces the boundary before egress. 1,100+ sensitive types detected with confidence scoring across PHI, PII, PCI, HIPAA, and GDPR. Pipeline-native — one SDK line in dbt or Spark. Full redaction, encryption, and tokenization with complete audit trail.',
    useCaseSlugs: [],
  },
  {
    slug: 'datadna',
    name: 'DataDNA',
    wordmark: 'DATADNA',
    tagline: 'Pipeline-native registry and lineage — the trust control plane for AI consumption.',
    layer: 'pipelines',
    status: 'preview',
    metrics: [
      { label: 'Registry',  description: 'data product registry acts as the trust control plane' },
      { label: 'Lineage',   description: 'pipeline-native capture — no manual instrumentation' },
      { label: 'Governed',  description: 'every AI decision traces to a certified data product' },
    ],
    summary:
      'The registry acts as the trust control plane governing AI consumption. DataDNA captures lineage pipeline-natively and produces a data product registry that downstream agents consult before consuming any data. Integrates with Snowflake, Databricks, and cloud-native pipelines.',
    useCaseSlugs: [],
  },

  // ─────────────────────────── AI-Ready Semantic ───────────────────────────
  {
    slug: 'resolve',
    name: 'Resolve',
    wordmark: 'RESOLVE',
    tagline: 'AI-powered customer identification — MDM done right, starting before implementation.',
    layer: 'semantic',
    status: 'ga',
    metrics: [
      { label: '40–60%',       description: 'of MDM projects fail or need major rework' },
      { label: '5×',           description: 'faster readiness assessment vs. manual effort' },
      { label: 'Certified 360', description: 'certified customer and organization' },
    ],
    summary:
      'Accurate entity identification and tracking across the data estate is the foundation of reliable, trustworthy AI. Two modules: Pre-MDM Assessment (know your data is ready before you commit — AI-automated schema mapping, data quality scoring, go/no-go readiness report in days not weeks) and Customer Identity Integration (entity resolution live in weeks, not 18 months — configurable match, merge, and survivorship rules).',
    useCaseSlugs: ['mdm-pre-assessment', 'mdm-lite'],
  },
  {
    slug: 'semantic-hub',
    name: 'Semantic Hub',
    wordmark: 'SEMANTIC HUB',
    tagline: 'The insurance-native context layer for governed AI workflows.',
    layer: 'semantic',
    status: 'ga',
    metrics: [
      { label: '3 Pillars', description: 'ontology, document intelligence, knowledge repository unified' },
      { label: 'Overlay',   description: 'connects to existing systems — no rip-and-replace required' },
      { label: 'Governed',  description: 'every AI decision traceable to certified data products' },
    ],
    summary:
      'AI cannot reason over data it cannot find, connect, or trust. Semantic Hub makes enterprise data discoverable, connected, and consumable by governed AI workflows — via three pillars: a shared insurance ontology (anchor and meaning layer), document intelligence (RAG pipeline for PDFs, loss runs, ACORD forms), and a knowledge repository (guidelines, appetite rules, authority matrices — curated, versioned, ontology-anchored).',
    useCaseSlugs: ['submission-intake', 'loss-run-intelligence', 'public-sector-underwriting'],
  },

  // ─────────────────────────── AI Governance & Guardrails ───────────────────────────
  {
    slug: 'ai-catalog',
    name: 'AI Catalog',
    wordmark: 'AI CATALOG',
    tagline: 'Lineage, versioning, and AI-ready certification across the data-product registry.',
    layer: 'governance',
    status: 'preview',
    metrics: [
      { label: 'Catalog',     description: 'enterprise-wide discoverability for certified data products' },
      { label: 'Versioned',   description: 'every product, rule, and schema version-stamped' },
      { label: 'Certifiable', description: 'AI-readiness certification mapped to a governed lifecycle' },
    ],
    summary:
      'A catalog of catalogs for enterprise-wide data discovery. AI Catalog tracks lineage, version, and certification state for every data product — structured and unstructured — and exposes the consumable surface for agents, workbenches, and compliance teams.',
    useCaseSlugs: [],
  },
  {
    slug: 'ai-cockpit',
    name: 'AI Cockpit',
    wordmark: 'AI COCKPIT',
    tagline: 'Real-time AI agent monitoring and observability.',
    layer: 'governance',
    status: 'preview',
    metrics: [
      { label: 'Real-time', description: 'agent telemetry from recipe runs to production outcomes' },
      { label: 'Explainable', description: 'every decision surfaces its governing chunk and trace' },
      { label: 'Operational', description: 'SLO, drift, and anomaly monitoring on live agents' },
    ],
    summary:
      'AI Cockpit is the operational surface for governed AI agents — observing recipe runs, decision traces, chunk citations, drift and anomaly signals, and SLO compliance across the fleet. Pairs with AI Catalog (what is certified) and AI Compliance Hub (what is audit-ready).',
    useCaseSlugs: [],
  },
  {
    slug: 'ai-compliance-hub',
    name: 'AI Compliance Hub',
    wordmark: 'AI COMPLIANCE HUB',
    tagline: 'Audit trail and regulator-ready explainability for every AI decision.',
    layer: 'governance',
    status: 'preview',
    metrics: [
      { label: 'Audit-Ready', description: 'every AI decision reconstructible from chunks + traces' },
      { label: 'Regulator-Grade', description: 'explainability in the language of reviewers, not engineers' },
      { label: 'Continuous',   description: 'compliance as a live posture, not a quarterly report' },
    ],
    summary:
      'When the regulator asks "why did your AI decide this?" — the AI Compliance Hub is the answer surface. Every decision reconstructs from its governing chunk, version, effective date, and trace path. Designed for carriers that treat AI explainability as a structural posture, not an after-the-fact exercise.',
    useCaseSlugs: ['proactive-audit-monitoring'],
  },

  // ─────────────────────────── Agents & Workflow ───────────────────────────
  {
    slug: 'recipe-packs',
    name: 'Blueprints & Recipes',
    wordmark: 'RECIPE PACKS',
    tagline: 'Insurance agentic recipe packs — the workflow DNA of your AI.',
    layer: 'workflow',
    status: 'ga',
    metrics: [
      { label: 'Composable',  description: 'recipes assemble governed tools into production workflows' },
      { label: 'Multi-LOB',   description: 'WC, Auto, Property, GL claims; commercial + PSU underwriting' },
      { label: 'Traceable',   description: 'every tool invocation stamped with chunk, version, effective date' },
    ],
    summary:
      'Insurance agentic recipe packs codify production workflows — claims FNOL across LOBs, commercial submission intake, public-sector underwriting, cohort analysis — as orchestrated sequences of governed tools. Each tool reads from curated knowledge (Semantic Hub) and writes to audit-traceable collections, so the pipeline itself is the audit trail.',
    useCaseSlugs: [
      'submission-intake',
      'fnol-claims-intelligence',
      'loss-run-intelligence',
      'public-sector-underwriting',
      'cohort-analysis',
    ],
  },

  // ─────────────────────────── AI-Apps (Personified Workbenches) ───────────────────────────
  {
    slug: 'workbench',
    name: 'Workbench',
    wordmark: 'WORKBENCH',
    tagline: 'Personified workbenches for claims, underwriting, and specialty personas.',
    layer: 'apps',
    status: 'ga',
    metrics: [
      { label: 'Persona-native', description: 'intake adjuster to claims director — each role gets its surface' },
      { label: 'Governance-first', description: 'every decision on-screen carries its chunk id and version' },
      { label: 'Trust Modes',    description: 'Full Queue · Guided · Autonomous — dial autonomy by confidence' },
    ],
    summary:
      'The application surface where AI-generated analysis meets the human decision. Role-native workspaces for underwriters and claims staff: a hub, a toolkit, and a research workspace — each rendering governed analysis with decision trace, governing chunk, and version attached. Designed as a companion to core systems of record, not a replacement.',
    useCaseSlugs: ['fnol-claims-intelligence', 'submission-intake'],
  },
];

// Helper functions
export const getProductBySlug = (slug: string): ProductMeta | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByLayer = (layer: ProductMeta['layer']): ProductMeta[] =>
  products.filter((p) => p.layer === layer);

export const getProductsForUseCase = (useCaseSlug: string): ProductMeta[] =>
  products.filter((p) => p.useCaseSlugs.includes(useCaseSlug));
