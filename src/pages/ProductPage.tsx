import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { getProductBySlug, products } from '../data/products';
import { PRODUCT_LAYER_CONFIG, PRODUCT_STATUS_CONFIG } from '../types/product';
import { getUseCaseBySlug } from '../data/usecases';

/**
 * Product page.
 *
 * Structure:
 *   1. Top meta line     — EX-00 / PRODUCT · <layer>
 *   2. Assertion hero    — product name, tagline, metric bar
 *   3. Embedded demoboard — iframe into /demoboards/<slug>.html
 *   4. Attached usecases  — exhibit-labeled tile grid
 *   5. Related products   — same-layer sibling suggestions
 */
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(3200);

  // Scroll to top on mount / slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Auto-resize the iframe to its content height (re-measures on load + on window resize)
  useEffect(() => {
    const measure = () => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const h = Math.max(
        doc.documentElement.scrollHeight,
        doc.body?.scrollHeight ?? 0,
      );
      if (h > 0) setIframeHeight(h);
    };
    const onLoad = () => measure();
    const onResize = () => measure();
    const el = iframeRef.current;
    if (el) el.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
    return () => {
      if (el) el.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
    };
  }, [product?.demoboardPath]);

  if (!product) {
    return (
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 py-20 text-center">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 mb-4">Not found</p>
        <h1 className="assertion mb-4">Product not found.</h1>
        <p className="subhead mb-8">The product you're looking for doesn't exist or has moved.</p>
        <Link to="/products" className="ink-link font-sans text-[14px]">← All products</Link>
      </div>
    );
  }

  const layerLabel = PRODUCT_LAYER_CONFIG[product.layer].label;
  const statusLabel = PRODUCT_STATUS_CONFIG[product.status].label;
  const attachedUseCases = product.useCaseSlugs
    .map((s) => getUseCaseBySlug(s))
    .filter(Boolean) as Array<NonNullable<ReturnType<typeof getUseCaseBySlug>>>;
  const siblings = products
    .filter((p) => p.layer === product.layer && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <article>
      {/* ──────── Hero ──────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-14 md:pt-20 pb-12">
        {/* Meta line */}
        <div className="ph-meta">
          <span className="ph-num">EX-00</span>
          <span className="ph-cat">Product · {layerLabel}</span>
          <span className="ph-spacer" />
          <span>Status · {statusLabel}</span>
        </div>

        {/* Breadcrumb */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-sans text-[13px] text-ink-4 hover:text-accent mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> All products
        </Link>

        {/* Wordmark */}
        <p className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent mb-3">
          {product.wordmark ?? product.name.toUpperCase()}
        </p>

        {/* Assertion title (tagline IS the argument) */}
        <h1 className="assertion mb-4" style={{ fontSize: 'clamp(32px, 4vw, 46px)', maxWidth: '980px' }}>
          {product.tagline}
        </h1>

        {/* Summary */}
        <p className="font-serif font-light text-[18px] leading-[1.5] text-ink-2 max-w-[780px] mb-10">
          {product.summary}
        </p>

        {/* Metric bar — inspired by the demoboard's "0–100 / Proactive / Full Trail" header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-ink">
          {product.metrics.slice(0, 3).map((m, i) => (
            <div
              key={i}
              className={`py-4 pr-6 ${i < 2 ? 'sm:border-r border-rule' : ''} ${i > 0 ? 'sm:pl-6' : ''}`}
            >
              <div className="font-serif font-light text-[22px] md:text-[26px] text-ink leading-tight mb-1">
                {m.label}
              </div>
              <div className="font-sans text-[12px] text-ink-4 leading-snug">
                {m.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── Demoboard ──────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pb-20">
        <div className="exhibit-label">
          01 · Demoboard
          {product.demoboardVariant && (
            <>
              <span className="line" />
              <span className="text-ink-4">{product.demoboardVariant}</span>
            </>
          )}
        </div>

        {product.demoboardPath ? (
          <div className="border border-rule bg-paper">
            <iframe
              ref={iframeRef}
              src={`/${product.demoboardPath}`}
              title={`${product.name} demoboard`}
              className="w-full block"
              style={{ height: iframeHeight, border: 'none' }}
            />
          </div>
        ) : (
          <div className="border border-rule bg-paper-2 p-16 text-center">
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mb-3">
              Demoboard in production
            </p>
            <p className="assertion mb-4" style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>
              Not yet published for <em>{product.name}</em>.
            </p>
            <p className="subhead mx-auto">
              Reach out to gps@elevatenow.tech for the current pre-read or a working session.
            </p>
          </div>
        )}

        <p className="ex-note">
          <strong>Note.</strong> Demoboards open in an editorial grammar — assertion headlines,
          MECE exhibits, composable evidence. The body of this document is an independent HTML
          artifact so the same file can be shared as a pre-read outside of this site.
        </p>
      </section>

      {/* ──────── Attached usecases ──────── */}
      {attachedUseCases.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-6 md:px-12 pb-20">
          <div className="exhibit-label">
            02 · Use cases that exercise this product
            <span className="line" />
          </div>

          <h2 className="assertion mb-8" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)' }}>
            What this looks like in production.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-ink border-l border-rule">
            {attachedUseCases.map((uc, i) => (
              <Link
                key={uc.slug}
                to={`/use-case/${uc.slug}`}
                className="block p-6 border-r border-b border-rule bg-paper group hover:bg-paper-2 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent font-semibold">
                    UC-{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="tag-mono">{uc.category}</span>
                  <span className="tag-mono ml-auto inline-flex items-center gap-1">
                    <Clock size={11} /> {uc.estimatedReadMin} min
                  </span>
                </div>
                <h3 className="font-serif text-[20px] font-medium leading-tight text-ink mb-2 group-hover:text-accent transition-colors">
                  {uc.title}
                </h3>
                <p className="font-sans text-[13.5px] text-ink-3 leading-relaxed mb-4 line-clamp-3">
                  {uc.subtitle}
                </p>
                <span className="font-sans text-[13px] text-accent inline-flex items-center gap-1.5">
                  Read <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ──────── Related products ──────── */}
      {siblings.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-6 md:px-12 pb-16">
          <div className="exhibit-label">
            03 · Also in {layerLabel}
            <span className="line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-ink border-l border-rule">
            {siblings.map((p) => (
              <Link
                key={p.slug}
                to={`/product/${p.slug}`}
                className="p-6 border-r border-b border-rule bg-paper hover:bg-paper-2 transition-colors group"
              >
                <p className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent mb-2">
                  {p.wordmark ?? p.name.toUpperCase()}
                </p>
                <p className="font-serif text-[17px] text-ink leading-snug mb-2 group-hover:text-accent transition-colors">
                  {p.tagline}
                </p>
                <span className="font-sans text-[12px] text-ink-4 inline-flex items-center gap-1">
                  Open <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
