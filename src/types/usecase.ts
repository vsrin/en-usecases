export type UseCaseCategory =
  | 'underwriting'
  | 'claims'
  | 'actuarial'
  | 'compliance'
  | 'operations'
  | 'distribution';

export type UseCaseStatus = 'published' | 'coming-soon';

export interface UseCaseMeta {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: UseCaseCategory;
  tags: string[];
  status: UseCaseStatus;
  publishedAt: string;
  estimatedReadMin: number;
  detailType: 'component' | 'html';
  htmlPath?: string;
  keyQuestion: string;           // The intellectual hook — why this matters
  summary: string;
}

export const CATEGORY_CONFIG: Record<UseCaseCategory, { label: string; color: string }> = {
  underwriting:  { label: 'Underwriting',  color: '#3b82f6' },
  claims:        { label: 'Claims',        color: '#f59e0b' },
  actuarial:     { label: 'Actuarial',     color: '#8b5cf6' },
  compliance:    { label: 'Compliance',    color: '#ef4444' },
  operations:    { label: 'Operations',    color: '#14b8a6' },
  distribution:  { label: 'Distribution',  color: '#ec4899' },
};
