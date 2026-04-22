import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { PRODUCT_LAYER_CONFIG, PRODUCT_STATUS_CONFIG, type ProductLayer } from '../types/product';

/**
 * Products index — grouped by layer in the same order as the deck's architecture
 * stack (apps → workflow → governance → semantic → pipelines).
 */
export default function ProductsPage() {
  const layers = (Object.keys(PRODUCT_LAYER_CONFIG) as ProductLayer[]).sort(
    (a, b) => PRODUCT_LAYER_CONFIG[a].order - PRODUCT_LAYER_CONFIG[b].order,
  );

  return (
    <article>
      {/* ─────── Hero ─────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-14 md:pt-20 pb-12">
        <div className="ph-meta">
          <span className="ph-num">INDEX</span>
          <span className="ph-cat">Products · ElevateNow Accelerators</span>
          <span className="ph-spacer" />
          <span>{products.length} products</span>
        </div>

        <h1 className="assertion mb-4" style={{ fontSize: 'clamp(32px, 4vw, 50px)' }}>
          <em>The governed intelligence layer</em>, shipped as <span className="accent">purpose-built accelerators</span>.
        </h1>

        <p className="font-serif font-light text-[18px] leading-[1.5] text-ink-2 max-w-[780px]">
          Every accelerator sits on the same stack and speaks the same chunk-and-trace
          vocabulary. Mix pipelines with semantic with governance with workflow — or start
          with a single product and compound from there. Each product page hosts its
          demoboard and the use cases that exercise it in production.
        </p>
      </section>

      {/* ─────── Layer sections ─────── */}
      {layers.map((layer) => {
        const layerProducts = products.filter((p) => p.layer === layer);
        if (layerProducts.length === 0) return null;
        const cfg = PRODUCT_LAYER_CONFIG[layer];

        return (
          <section key={layer} className="max-w-[1180px] mx-auto px-6 md:px-12 pb-14">
            <div className="exhibit-label">
              {String(cfg.order).padStart(2, '0')} · {cfg.label}
              <span className="line" />
              <span className="text-ink-4">{layerProducts.length} product{layerProducts.length === 1 ? '' : 's'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-ink border-l border-rule">
              {layerProducts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/product/${p.slug}`}
                  className="block p-6 border-r border-b border-rule bg-paper hover:bg-paper-2 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent">
                      {p.wordmark ?? p.name.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink-4 whitespace-nowrap">
                      {PRODUCT_STATUS_CONFIG[p.status].label}
                    </span>
                  </div>

                  <h3 className="font-serif text-[19px] text-ink font-medium leading-snug mb-3 group-hover:text-accent transition-colors min-h-[68px]">
                    {p.tagline}
                  </h3>

                  <p className="font-sans text-[13px] text-ink-3 leading-relaxed mb-4 line-clamp-4">
                    {p.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-rule-2">
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
                      {p.useCaseSlugs.length > 0
                        ? `${p.useCaseSlugs.length} use case${p.useCaseSlugs.length === 1 ? '' : 's'}`
                        : 'Demoboard'}
                    </span>
                    <span className="font-sans text-[12px] text-accent inline-flex items-center gap-1">
                      Open <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
