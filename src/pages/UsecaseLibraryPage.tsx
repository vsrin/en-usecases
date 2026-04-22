import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usecases } from '../data/usecases';
import { products, getProductsForUseCase } from '../data/products';
import { CATEGORY_CONFIG, type UseCaseCategory } from '../types/usecase';
import UseCaseTile from '../components/usecases/UseCaseTile';

/**
 * Use case library — filter by product (primary) and LOB/function (secondary).
 * Product is the first-class axis now; LOB is supporting.
 */
export default function UsecaseLibraryPage() {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<string | 'all'>('all');
  const [lobFilter, setLobFilter] = useState<UseCaseCategory | 'all'>('all');

  const lobs = Object.entries(CATEGORY_CONFIG) as [UseCaseCategory, { label: string }][];

  const filtered = useMemo(() => {
    return usecases.filter((uc) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        uc.title.toLowerCase().includes(q) ||
        uc.summary.toLowerCase().includes(q) ||
        uc.subtitle.toLowerCase().includes(q) ||
        uc.tags.some((t) => t.toLowerCase().includes(q));
      const matchesProduct =
        productFilter === 'all' ||
        getProductsForUseCase(uc.slug).some((p) => p.slug === productFilter);
      const matchesLob = lobFilter === 'all' || uc.category === lobFilter;
      return matchesSearch && matchesProduct && matchesLob;
    });
  }, [search, productFilter, lobFilter]);

  return (
    <article>
      {/* ─────── Hero ─────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-14 md:pt-20 pb-10">
        <div className="ph-meta">
          <span className="ph-num">INDEX</span>
          <span className="ph-cat">Publications · Field use cases</span>
          <span className="ph-spacer" />
          <span>{usecases.length} published</span>
        </div>

        <h1 className="assertion mb-4" style={{ fontSize: 'clamp(32px, 4vw, 46px)' }}>
          Use cases from the <em>field</em>.
        </h1>

        <p className="font-serif font-light text-[17px] leading-[1.5] text-ink-2 max-w-[780px] mb-10">
          Each publication argues a real operational problem, the recipe of accelerators that
          addresses it, and the measurable effect. Filter by the product you want to exercise or
          the line of business you operate in.
        </p>

        {/* Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
            <input
              type="text"
              placeholder="Search title, summary, tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-rule bg-paper text-[13px] text-ink placeholder-ink-4 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Product filter — primary */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 mr-2">Product</span>
            <button
              onClick={() => setProductFilter('all')}
              className={`font-mono text-[10px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 border transition-colors ${
                productFilter === 'all'
                  ? 'bg-accent text-paper border-accent'
                  : 'bg-paper text-ink-3 border-rule hover:border-accent hover:text-accent'
              }`}
            >
              All
            </button>
            {products.map((p) => (
              <button
                key={p.slug}
                onClick={() => setProductFilter(p.slug)}
                className={`font-mono text-[10px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 border transition-colors ${
                  productFilter === p.slug
                    ? 'bg-accent text-paper border-accent'
                    : 'bg-paper text-ink-3 border-rule hover:border-accent hover:text-accent'
                }`}
              >
                {p.wordmark ?? p.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* LOB filter — secondary */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 mr-2">LOB</span>
            <button
              onClick={() => setLobFilter('all')}
              className={`font-mono text-[10px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 border transition-colors ${
                lobFilter === 'all'
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper text-ink-3 border-rule hover:border-ink hover:text-ink'
              }`}
            >
              All
            </button>
            {lobs.map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setLobFilter(key)}
                className={`font-mono text-[10px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 border transition-colors ${
                  lobFilter === key
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper text-ink-3 border-rule hover:border-ink hover:text-ink'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Grid ─────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-ink border-l border-rule">
            {filtered.map((u, i) => (
              <UseCaseTile key={u.slug} useCase={u} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 mb-2">No match</p>
            <p className="font-serif text-[18px] text-ink-2">No use cases match the current filters.</p>
            <button
              onClick={() => { setSearch(''); setProductFilter('all'); setLobFilter('all'); }}
              className="mt-4 ink-link font-sans text-[13px]"
            >
              Clear filters
            </button>
          </div>
        )}
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 mt-6">
          {filtered.length} of {usecases.length} use case{filtered.length === 1 ? '' : 's'}
          {productFilter !== 'all' && ` · Product: ${products.find((p) => p.slug === productFilter)?.name}`}
          {lobFilter !== 'all' && ` · LOB: ${CATEGORY_CONFIG[lobFilter].label}`}
        </p>

        <p className="mt-8 font-sans text-[13px] text-ink-4">
          Looking for the products themselves? <Link to="/products" className="ink-link text-ink-2">All accelerators →</Link>
        </p>
      </section>
    </article>
  );
}
