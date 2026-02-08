import type { UseCaseMeta } from '../types/usecase';

export const usecases: UseCaseMeta[] = [
  {
    id: 'submission-intake',
    slug: 'submission-intake',
    title: 'Intelligent Submission Intake',
    subtitle: 'From Email Chaos to Structured Workflow',
    category: 'operations',
    tags: ['Submission', 'Document Processing', 'Workflow Automation', 'Triage'],
    status: 'published',
    publishedAt: '2026-01-20',
    estimatedReadMin: 8,
    detailType: 'html',
    htmlPath: 'SubmissionIntake.html',
    keyQuestion: 'What if every submission arrived pre-sorted, pre-validated, and ready for the right underwriter?',
    summary: 'Submissions arrive via email, portal, and broker feeds in inconsistent formats. This recipe extracts, validates, and routes submissions automatically, ensuring nothing falls through the cracks and underwriters receive complete, structured packages.',
  },
  {
    "id": "workers-comp-fnol-intelligence",
    "slug": "workers-comp-fnol-intelligence",
    "title": "First Notice of Loss Claims Arrive With Red Flags Hidden in Plain Sight",
    "subtitle": "From Unstructured Intake to Governed Intelligence Report in Minutes",
    "category": "claims",
    "tags": [
      "Workers Compensation",
      "FNOL Processing",
      "Claims Intelligence",
      "Fraud Detection",
      "Subrogation",
      "Compensability Analysis",
      "Authority Routing"
    ],
    "status": "published",
    "publishedAt": "2026-02-08",
    "estimatedReadMin": 12,
    "detailType": "html",
    "htmlPath": "WCFNOL-ElevatenowRecipe.html",
    "keyQuestion": "When a worker is injured, claims adjusters have minutes to triage compensability, spot fraud indicators, calculate reserves, and route to the right authority level. What happens when the red flags are buried in unstructured text, the jurisdiction rules conflict across 50 states, and there's no time to consult the manual?",
    "summary": "Workers compensation claims begin with unstructured FNOL narratives hiding critical signals—fraud indicators, third-party liability, compensability questions, OSHA triggers. This recipe transforms chaos into governed intelligence: jurisdiction rules applied consistently across 50 states, 12 sensitive indicators detected with standardized taxonomy, subrogation theories evaluated systematically, and authority routing based on explicit governance logic. Every decision traced to evidence, every knowledge source cited, every routing choice documented. From 90-minute manual triage to sub-10-minute intelligence delivery with complete audit trails."
  },
  {
    id: 'loss-run-intelligence',
    slug: 'loss-run-intelligence',
    title: 'Prior Carrier Loss Runs: From PDF Chaos to Underwriting Intelligence',
    subtitle: 'Canonical Mapping, Override Detection, and Coverage Gap Analysis',
    category: 'underwriting',
    tags: ['Loss Runs', 'Claims Mapping', 'Coverage Analysis', 'Specialty Commercial', 'Municipal', 'Public Entity'],
    status: 'published',
    publishedAt: '2026-02-07',
    estimatedReadMin: 10,
    detailType: 'html',
    htmlPath: 'LossRunIntelligence.html',
    keyQuestion: 'What risk signals are buried in prior carrier loss runs that underwriters never see because the data arrives as unstructured PDFs with carrier-specific codes?',
    summary: 'Prior carrier loss runs arrive as PDFs with inconsistent formats and carrier-specific codes that dont map to your coverage lines. Underwriters manually translate codes, often missing misclassified claims and uninsured exposures. This recipe automates extraction, maps claims to canonical products, detects classification errors carriers made, and surfaces coverage gaps—with full provenance on every decision.',
  },
  {
    id: 'proactive-audit-monitoring',
    slug: 'proactive-audit-monitoring',
    title: 'Proactive Audit Monitoring',
    subtitle: 'From Reactive Compliance to Preventive Intelligence',
    category: 'operations',
    tags: ['Audit', 'Compliance', 'Risk Management', 'Governance', 'Underwriting Standards'],
    status: 'published',
    publishedAt: '2026-02-07',
    estimatedReadMin: 12,
    detailType: 'html',
    htmlPath: 'ProactiveAuditMonitoring.html',
    keyQuestion: 'What if audits prevented problems instead of just documenting them?',
    summary: 'Traditional audit happens after binding—when its too late to prevent problems and too expensive to fix them. This recipe transforms audit from a compliance checkbox to a proactive risk intelligence engine that evaluates 100% of submissions before binding, with complete provenance, encoded governance, and actionable insights that matter to underwriters.',
  },
  {
    id: 'public-sector-underwriting',
    slug: 'public-sector-underwriting',
    title: 'Municipal Budgets Tell Risk Stories',
    subtitle: 'From 200-Page PDFs to Actionable Underwriting Intelligence',
    category: 'underwriting',
    tags: ['Public Sector', 'Budget Analysis', 'Risk Intelligence', 'Government Entities', 'PFAS Compliance'],
    status: 'published',
    publishedAt: '2026-02-07',
    estimatedReadMin: 10,
    detailType: 'html',
    htmlPath: 'PSUW-ElevatenowRecipe.html',
    keyQuestion: 'How much risk signal is buried in county budget documents that no underwriter has time to decode, and what happens when that signal surfaces after a loss?',
    summary: 'Counties operate jails, water plants, law enforcement, and healthcare facilities, each with distinct liability profiles. Yet underwriters get 200-page PDFs and 15 minutes. This recipe transforms unstructured budget data into classified departments, verified external intelligence from public domain sources, and audit-ready supplemental logic, with every claim traced to evidence and year-over-year benchmarking built in.',
  },
  {
    id: 'cohort-analysis',
    slug: 'cohort-analysis',
    title: 'AI-Driven Cohort Analysis for Reserving',
    subtitle: 'From Manual Segmentation to Statistically Validated Cohorts',
    category: 'actuarial',
    tags: ['Reserving', 'Loss Triangles', 'Cohort Design', 'Statistical Testing'],
    status: 'published',
    publishedAt: '2026-01-15',
    estimatedReadMin: 12,
    detailType: 'html',
    htmlPath: 'cohort-analysis.html',
    keyQuestion: 'What if cohort design was driven by statistical evidence rather than tradition and convenience?',
    summary: 'Cohort selection is foundational to reserve accuracy, yet most actuaries inherit segmentation from predecessors without rigorous testing. This recipe automates hypothesis generation, cohort construction, and statistical validation to find objectively better segmentations.',
  },
];

// Helper functions
export const getUseCaseBySlug = (slug: string): UseCaseMeta | undefined => {
  return usecases.find(uc => uc.slug === slug);
};

export const getUseCasesByCategory = (category: UseCaseMeta['category']): UseCaseMeta[] => {
  return usecases.filter(uc => uc.category === category);
};

export const getPublishedUseCases = (): UseCaseMeta[] => {
  return usecases.filter(uc => uc.status === 'published');
};