import { CATEGORY_CONFIG, type UseCaseCategory } from '../../types/usecase';

interface CategoryBadgeProps {
  category: UseCaseCategory;
}

/**
 * Minimal mono-typeface LOB tag. No color per category — in the editorial
 * palette color is reserved for the single accent. LOBs differentiate by
 * typography + position, not color.
 */
export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span className="tag-mono">
      {config.label}
    </span>
  );
}
