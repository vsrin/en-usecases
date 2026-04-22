/**
 * ElevateNow accelerator (product) — the first-class entity on the Insights site.
 * Each product has a demoboard (an HTML artifact in /demoboards/) and a set of
 * use cases that exercise it in production.
 */

export type ProductLayer =
  | 'apps'         // Personified Workbenches (Claims, UW, etc.)
  | 'workflow'     // Blueprints & Recipes
  | 'governance'   // AI Catalog, AI Cockpit, AI Compliance Hub
  | 'semantic'     // Semantic Hub, Resolve
  | 'pipelines';   // Assure, Redact, DataDNA

export type ProductStatus = 'ga' | 'preview' | 'roadmap';

export interface ProductMetric {
  /** Short label, e.g. "0–100" or "Proactive" */
  label: string;
  /** One-line description under the label */
  description: string;
}

export interface ProductMeta {
  slug: string;
  name: string;               // e.g. "Assure"
  wordmark?: string;          // e.g. "ASSURE" (rendered in mono)
  tagline: string;            // one-line product position
  layer: ProductLayer;
  status: ProductStatus;
  metrics: ProductMetric[];   // ~3 metric bar at top of page
  summary: string;            // paragraph for product hero + card
  demoboardPath?: string;     // relative path under public/ e.g. "demoboards/assure.html"
  demoboardVariant?: string;  // e.g. "Pre-read for Aflac" — shows on hero if non-generic
  useCaseSlugs: string[];     // use cases that exercise this product
}

export const PRODUCT_LAYER_CONFIG: Record<ProductLayer, { label: string; order: number }> = {
  apps:       { label: 'AI-Apps',                  order: 1 },
  workflow:   { label: 'Agents & Workflow',        order: 2 },
  governance: { label: 'AI Governance & Guardrails', order: 3 },
  semantic:   { label: 'AI-Ready Semantic',         order: 4 },
  pipelines:  { label: 'AI-Ready Data Pipelines',   order: 5 },
};

export const PRODUCT_STATUS_CONFIG: Record<ProductStatus, { label: string }> = {
  ga:      { label: 'GA' },
  preview: { label: 'Preview' },
  roadmap: { label: 'Roadmap' },
};
