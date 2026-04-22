/**
 * Use case = a field story / published analysis that exercises one or more
 * ElevateNow products. The "category" label remains for LOB/function navigation;
 * product linkage (via ProductMeta.useCaseSlugs) is the primary organizing axis.
 */

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
  keyQuestion: string;
  summary: string;
}

export const CATEGORY_CONFIG: Record<UseCaseCategory, { label: string }> = {
  underwriting: { label: 'Underwriting' },
  claims:       { label: 'Claims' },
  actuarial:    { label: 'Actuarial' },
  compliance:   { label: 'Compliance' },
  operations:   { label: 'Operations' },
  distribution: { label: 'Distribution' },
};
