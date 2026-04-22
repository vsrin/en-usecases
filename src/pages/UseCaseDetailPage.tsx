import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getUseCaseBySlug } from '../data/usecases';
import { getProductsForUseCase } from '../data/products';
import UseCaseHtmlViewer from '../components/usecases/UseCaseHtmlViewer';
import { CATEGORY_CONFIG } from '../types/usecase';

export default function UseCaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const useCase = slug ? getUseCaseBySlug(slug) : undefined;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!useCase) {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mb-3">Not found</p>
        <h2 className="assertion mb-3" style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>
          Use case not found.
        </h2>
        <p className="subhead mx-auto mb-6">The use case you're looking for doesn't exist or has been moved.</p>
        <Link to="/usecases" className="ink-link font-sans text-[14px] inline-flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to library
        </Link>
      </div>
    );
  }

  if (useCase.status === 'coming-soon') {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mb-3">In production</p>
        <h2 className="assertion mb-3" style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>
          {useCase.title}
        </h2>
        <p className="subhead mx-auto mb-6">This use case is being written. Reach out for a pre-read in the meantime.</p>
        <Link to="/usecases" className="ink-link font-sans text-[14px] inline-flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to library
        </Link>
      </div>
    );
  }

  const linkedProducts = getProductsForUseCase(useCase.slug);
  const categoryLabel = CATEGORY_CONFIG[useCase.category].label;

  // Inline HTML body flow — wrapped in editorial chrome (breadcrumb + meta strip).
  if (useCase.detailType === 'html' && useCase.htmlPath) {
    return (
      <article>
        {/* Breadcrumb / meta strip above the HTML body */}
        <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-8 pb-6 border-b border-rule-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] tracking-[0.12em] uppercase text-ink-4 mb-2">
            <Link to="/usecases" className="ink-link text-ink-4 inline-flex items-center gap-1">
              <ArrowLeft size={11} /> Library
            </Link>
            <span>·</span>
            <span>{categoryLabel}</span>
            {linkedProducts.map((p) => (
              <span key={p.slug}>
                · <Link to={`/product/${p.slug}`} className="ink-link text-accent">
                  {p.wordmark ?? p.name.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>
          <h1 className="font-serif text-[22px] md:text-[24px] text-ink leading-tight font-medium max-w-[980px]">
            {useCase.title}
          </h1>
        </section>

        {/* Legacy HTML body */}
        <div className="use-case-detail">
          <UseCaseHtmlViewer htmlPath={useCase.htmlPath} />
        </div>
      </article>
    );
  }

  // Fallback — component-based detail (future use)
  return (
    <article className="max-w-[780px] mx-auto px-6 py-14">
      <Link to="/usecases" className="ink-link font-sans text-[13px] inline-flex items-center gap-1.5 mb-8 text-ink-4">
        <ArrowLeft size={13} /> Library
      </Link>
      <h1 className="assertion mb-3">{useCase.title}</h1>
      <p className="font-serif text-[18px] text-accent mb-6">{useCase.subtitle}</p>
      <blockquote className="font-serif italic text-ink-3 border-l-2 border-rule pl-4 mb-6 leading-relaxed">
        {useCase.keyQuestion}
      </blockquote>
      <p className="font-sans text-[15px] text-ink-2 leading-relaxed">{useCase.summary}</p>
    </article>
  );
}
