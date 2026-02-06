import { CATEGORY_CONFIG, type UseCaseCategory } from '../../types/usecase';

interface CategoryBadgeProps {
  category: UseCaseCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];

  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide"
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      {config.label}
    </span>
  );
}
