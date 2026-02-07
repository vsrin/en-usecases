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