import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { CATEGORY_CONFIG, type UseCaseMeta } from '../../types/usecase';
import { getProductsForUseCase } from '../../data/products';

interface UseCaseTileProps {
  useCase: UseCaseMeta;
  index: number;
}

/**
 * Editorial tile — EX-NN meta, serif title, sub-argument, mono chips for
 * product linkage and LOB. No motion framer spring — let the paper be still.
 */
export default function UseCaseTile({ useCase, index }: UseCaseTileProps) {
  const products = getProductsForUseCase(useCase.slug);
  const categoryLabel = CATEGORY_CONFIG[useCase.category].label;

  return (
    <Link
      to={`/use-case/${useCase.slug}`}
      className="block p-6 bg-paper hover:bg-paper-2 transition-colors group border-r border-b border-rule h-full"
    >
      {/* Exhibit meta */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent font-semibold">
          EX-{String(index + 1).padStart(2, '0')}
        </span>
        <span className="tag-mono">{categoryLabel}</span>
        {useCase.status === 'coming-soon' && (
          <span className="tag-mono !text-ink-4">Coming soon</span>
        )}
        <span className="tag-mono ml-auto inline-flex items-center gap-1 text-ink-4">
          <Clock size={10} /> {useCase.estimatedReadMin} min
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-[20px] font-medium leading-[1.25] text-ink mb-2 group-hover:text-accent transition-colors">
        {useCase.title}
      </h3>

      {/* Sub-argument */}
      <p className="font-sans text-[13.5px] text-ink-3 leading-relaxed mb-4 line-clamp-3">
        {useCase.subtitle}
      </p>

      {/* Product linkage */}
      {products.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-rule-2">
          {products.map((p) => (
            <span
              key={p.slug}
              className="font-mono text-[9.5px] font-semibold tracking-[0.12em] uppercase text-accent bg-accent-soft px-2 py-1"
            >
              {p.wordmark ?? p.name.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Key question (pulled quote) */}
      <blockquote className="font-serif text-[14px] italic text-ink-3 leading-relaxed border-l-2 border-rule pl-4 mb-4">
        {useCase.keyQuestion}
      </blockquote>

      <span className="font-sans text-[13px] text-accent inline-flex items-center gap-1.5">
        {useCase.status === 'published' ? 'Read' : 'Preview'}
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
