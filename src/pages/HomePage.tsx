import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { PRODUCT_LAYER_CONFIG, type ProductLayer } from '../types/product';
import { usecases } from '../data/usecases';
import ContactSection from '../components/usecases/ContactSection';
import UseCaseTile from '../components/usecases/UseCaseTile';

/**
 * ElevateNow Insights — landing.
 *
 * The landing is written as an editorial document. Each section is an
 * "exhibit" with mono meta, an assertion headline, supporting grid/diagram,
 * and a footnote where useful. Stack order mirrors the pitch deck:
 *   Cover → Market shift → Architecture shift → Stack → Products → Usecases → Close
 */
// The stack splits into two consumption paths:
//   DATA path → AI-Ready Data Pipelines + AI-Ready Semantic (Assure, Redact, DataDNA, Resolve, Semantic Hub)
//   APP path  → AI Governance + Agents & Workflow + AI-Apps (Compliance Hub, Recipe Packs, Workbench)
// A use case belongs to the DATA path if its primary product sits in the pipelines or semantic layer;
// otherwise APP. Classification below is explicit (only 10 use cases — readability beats cleverness).
const DATA_PATH_USECASE_SLUGS = new Set([
  'data-quality-certification', // Assure (pipelines)
  'mdm-pre-assessment',         // Resolve (semantic)
  'mdm-lite',                   // Resolve (semantic)
]);

export default function HomePage() {
  const publishedUsecases = usecases.filter((u) => u.status === 'published');
  const dataPathUsecases = publishedUsecases.filter((u) => DATA_PATH_USECASE_SLUGS.has(u.slug));
  const appPathUsecases = publishedUsecases.filter((u) => !DATA_PATH_USECASE_SLUGS.has(u.slug));
  const layers = (Object.keys(PRODUCT_LAYER_CONFIG) as ProductLayer[]).sort(
    (a, b) => PRODUCT_LAYER_CONFIG[a].order - PRODUCT_LAYER_CONFIG[b].order,
  );

  return (
    <article>
      {/* ─────────────── COVER ─────────────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 border-b border-rule">
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-accent mb-7">
          ElevateNow Insights
        </p>
        <h1 className="font-serif font-light leading-[1.02] tracking-[-0.02em] text-ink mb-8" style={{ fontSize: 'clamp(40px, 5.6vw, 72px)', maxWidth: '980px' }}>
          The <em className="italic text-accent font-normal">intelligence layer</em> that makes brokers and carriers <em className="italic text-accent font-normal">AI-native</em>.
        </h1>
        <p className="font-serif font-light leading-[1.5] text-ink-2 mb-14" style={{ fontSize: 'clamp(17px, 1.6vw, 20px)', maxWidth: '780px' }}>
          A governed intelligence layer sits between your data and your agents. Certified data
          pipelines. An insurance-native semantic layer. Recipe packs that turn LLMs into
          auditable co-workers. This is the publication arm of <a href="https://elevatenow.tech" target="_blank" rel="noopener noreferrer" className="ink-link">elevatenow.tech</a> — product demoboards and field use cases, as editorial artifacts you can share.
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-ink">
          <div className="py-4 pr-6 border-r border-rule">
            <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-4 mb-2">Products</p>
            <p className="font-sans text-[14px] font-medium text-ink">{products.length} accelerators</p>
          </div>
          <div className="py-4 px-6 border-r border-rule">
            <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-4 mb-2">Use cases</p>
            <p className="font-sans text-[14px] font-medium text-ink">{usecases.length} published</p>
          </div>
          <div className="py-4 px-6 border-r border-rule">
            <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-4 mb-2">Home</p>
            <p className="font-sans text-[14px] font-medium text-ink"><a href="https://elevatenow.tech" target="_blank" rel="noopener noreferrer" className="ink-link">elevatenow.tech</a></p>
          </div>
          <div className="py-4 pl-6">
            <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-4 mb-2">Contact</p>
            <p className="font-sans text-[14px] font-medium text-ink"><a href="mailto:gps@elevatenow.tech" className="ink-link">gps@elevatenow.tech</a></p>
          </div>
        </div>
      </section>

      {/* ─────────────── 01 · MARKET SHIFT ─────────────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-20 pb-14">
        <div className="ph-meta">
          <span className="ph-num">EX-01</span>
          <span className="ph-cat">Market context</span>
          <span className="ph-spacer" />
          <span>Source · ElevateNow Briefing</span>
        </div>
        <h2 className="assertion mb-4">
          The shift to agentic AI is <em>restructuring</em> how carriers build, govern, and operate.
        </h2>
        <p className="subhead mb-8">
          Four forces are compounding simultaneously. The paradigm shift requires carriers to
          build a governed intelligence layer before scaling agentic AI across the enterprise.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-ink border-l border-rule">
          {[
            {
              n: '01',
              title: 'Architectural complexity is compounding.',
              arg: 'MCP and multi-agent orchestration have compounded integration points.',
              body: 'Carriers that don\'t re-architect now will spend 3× more to retrofit agents later.',
            },
            {
              n: '02',
              title: 'AI co-workers are entering regulated workflows.',
              arg: '60%+ of P&C carriers are piloting AI in underwriting or claims decisions today.',
              body: 'Every unaudited AI decision is a regulatory and reputational liability waiting to surface.',
            },
            {
              n: '03',
              title: 'Quality and context have become existential.',
              arg: 'Agents amplify bad data eroding trust faster than any pilot can recover.',
              body: 'Carriers without certified data pipelines will be outcompeted before they diagnose why.',
            },
            {
              n: '04',
              title: 'Leadership is demanding production-grade outcomes.',
              arg: 'Board-level AI ROI scrutiny has intensified — pilots without P&L impact are being cut.',
              body: 'The window to show measurable returns is closing; proof of value is now table stakes.',
            },
          ].map((d) => (
            <div key={d.n} className="p-6 border-r border-b border-rule bg-paper">
              <p className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent mb-3">{d.n}</p>
              <h3 className="font-serif text-[18px] text-ink font-medium leading-snug mb-3">{d.title}</h3>
              <p className="font-sans text-[13.5px] text-ink-3 mb-3 leading-relaxed">{d.arg}</p>
              <p className="font-sans text-[12.5px] italic text-ink-4 leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── 02 · ARCHITECTURE SHIFT ─────────────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-10 pb-14">
        <div className="ph-meta">
          <span className="ph-num">EX-02</span>
          <span className="ph-cat">Architecture shift</span>
          <span className="ph-spacer" />
          <span>Pre-agentic vs. agentic</span>
        </div>
        <h2 className="assertion mb-4">
          New components demand <em>new approaches</em> to data, tech, and governance.
        </h2>
        <p className="subhead mb-8">
          Today: AI apps wired directly to LLMs, databases, and content — a tangle. Tomorrow: a
          governed intelligence layer between every app and every source. This layer is what
          ElevateNow builds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-ink">
          {/* TODAY */}
          <div className="p-6 border-r border-rule bg-paper-2 border-b border-rule md:border-b-0">
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 font-semibold mb-4">Today</p>
            <p className="font-serif text-[20px] text-ink leading-snug mb-6">Apps and sources tangled point-to-point. No single plane of governance.</p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-ink text-paper font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">AI app</div>
              <div className="bg-ink text-paper font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">AI app</div>
              <div className="bg-ink text-paper font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">AI app</div>
            </div>
            <svg viewBox="0 0 300 40" className="w-full h-9 mb-3">
              {[0, 1, 2].flatMap((i) =>
                [0, 1, 2, 3].map((j) => (
                  <line key={`${i}-${j}`} x1={50 + i * 100} y1={0} x2={25 + j * 83} y2={40}
                    stroke="#0066A1" strokeWidth="0.75" opacity="0.45" />
                )),
              )}
            </svg>
            <div className="grid grid-cols-4 gap-2">
              {['LLM', 'LLM', 'DB', 'Content'].map((x, i) => (
                <div key={i} className="bg-rule-2 text-ink-3 font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">{x}</div>
              ))}
            </div>
          </div>

          {/* AGENTIC */}
          <div className="p-6 bg-paper border-b border-rule md:border-b-0">
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent font-semibold mb-4">Agentic world</p>
            <p className="font-serif text-[20px] text-ink leading-snug mb-6">One governed layer mediates every hop. Every decision is traceable.</p>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-ink text-paper font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">AI app</div>
              <div className="bg-ink text-paper font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">AI app</div>
              <div className="bg-ink text-paper font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">AI app</div>
            </div>
            <div className="bg-accent text-paper text-center py-3 mb-2">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase font-semibold">Data & Agentic Intelligence</p>
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase opacity-85 mt-1">Integration · Orchestration · Governance</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['LLM', 'Data', 'DB', 'Content'].map((x, i) => (
                <div key={i} className="bg-rule-2 text-ink-3 font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-2 text-center">{x}</div>
              ))}
            </div>
          </div>
        </div>
        <p className="ex-note">
          <strong>Note.</strong> The governed intelligence layer sits between the system of
          experience (UI/UX) and the system of record. It is what you own, govern, and
          compound value from.
        </p>
      </section>

      {/* ─────────────── 03 · THE STACK ─────────────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-10 pb-16">
        <div className="ph-meta">
          <span className="ph-num">EX-03</span>
          <span className="ph-cat">The stack</span>
          <span className="ph-spacer" />
          <span>ElevateNow focus</span>
        </div>
        <h2 className="assertion mb-4">
          Five layers. <em>One</em> governed vocabulary. <em>Buy</em> the infrastructure; <em>build</em> the trust.
        </h2>
        <p className="subhead mb-10">
          The stack is explicit about what to buy and what to build. Infrastructure — data
          platforms, LLM providers — is commodity. The intelligence layer on top is the moat.
          Every ElevateNow accelerator lives in one of five layers and shares one rule catalog.
        </p>

        <div className="border border-ink">
          {layers.map((layer, i) => {
            const layerProducts = products.filter((p) => p.layer === layer);
            const cfg = PRODUCT_LAYER_CONFIG[layer];
            // Short descriptor: text before em-dash or first clause of tagline
            const shortDesc = (t: string) => {
              const beforeDash = t.split('—')[0].trim();
              return beforeDash.replace(/\.$/, '');
            };
            return (
              <div
                key={layer}
                className={`flex flex-col md:flex-row ${i < layers.length - 1 ? 'border-b border-rule' : ''}`}
              >
                {/* Dark layer label cell — matches pitch-deck navy bars */}
                <div className="md:w-[280px] bg-ink text-paper p-5 md:border-r border-rule flex flex-col justify-center">
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase font-semibold mb-2" style={{ color: '#7DB3D4' }}>
                    Layer {String(cfg.order).padStart(2, '0')}
                  </p>
                  <p className="font-serif text-[22px] text-paper leading-tight mb-1 font-medium">
                    {cfg.label}
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: '#9FB4C5' }}>
                    {layerProducts.length} product{layerProducts.length === 1 ? '' : 's'}
                  </p>
                </div>

                {/* Product pill cards — wordmark + short descriptor, one per product */}
                <div className="flex-1 p-4 flex flex-wrap gap-3 bg-paper">
                  {layerProducts.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/product/${p.slug}`}
                      className="flex flex-col justify-center min-w-[220px] flex-1 md:flex-[0_0_auto] px-4 py-3 border border-rule bg-paper hover:border-accent hover:bg-accent-soft transition-colors group"
                    >
                      <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-ink group-hover:text-accent transition-colors">
                        {p.wordmark ?? p.name.toUpperCase()}
                      </span>
                      <span className="font-sans text-[11.5px] text-ink-4 mt-1 leading-snug line-clamp-2">
                        {shortDesc(p.tagline)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────── 04 · PRODUCT TAKEAWAYS ─────────────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-10 pb-14">
        <div className="ph-meta">
          <span className="ph-num">EX-04</span>
          <span className="ph-cat">Accelerator catalog</span>
          <span className="ph-spacer" />
          <Link to="/products" className="ink-link">All products →</Link>
        </div>
        <h2 className="assertion mb-4">
          Each accelerator ships with a <em>demoboard</em> — a shareable pre-read and an argument for a working session.
        </h2>
        <p className="subhead mb-10">
          Click through to any product to read its demoboard and the use cases that exercise it in production.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-ink border-l border-rule">
          {products.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              to={`/product/${p.slug}`}
              className="block p-6 border-r border-b border-rule bg-paper hover:bg-paper-2 transition-colors group"
            >
              <p className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent mb-3">
                {p.wordmark ?? p.name.toUpperCase()}
              </p>
              <p className="font-serif text-[17px] text-ink leading-snug mb-3 group-hover:text-accent transition-colors">
                {p.tagline}
              </p>
              <p className="font-sans text-[12.5px] text-ink-4 mb-4 line-clamp-3">
                {p.summary}
              </p>
              <span className="font-sans text-[12px] text-accent inline-flex items-center gap-1">
                Demoboard <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-right">
          <Link to="/products" className="font-sans text-[13px] text-accent inline-flex items-center gap-1.5">
            All {products.length} accelerators <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ─────────────── 05 · USECASES ─────────────── */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-12 pt-10 pb-14">
        <div className="ph-meta">
          <span className="ph-num">EX-05</span>
          <span className="ph-cat">Field use cases</span>
          <span className="ph-spacer" />
          <Link to="/usecases" className="ink-link">All usecases →</Link>
        </div>
        <h2 className="assertion mb-4">
          What this looks like in production <em>two paths, one governed layer</em>.
        </h2>
        <p className="subhead mb-12">
          The stack has two consumption paths. The data path certifies what flows through pipelines
          and semantic layer. The app path orchestrates recipes, governs agents, and surfaces the
          work to people. Every use case below sits on one path or the other. The data path comes
          first — certified data is prerequisite to every downstream workflow.
        </p>

        {/* ── 05-A · Data Accelerators (always first) ── */}
        <div className="mb-14">
          <div className="flex items-baseline gap-4 mb-6 pb-3 border-b border-ink">
            <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent">
              Path A · Data Accelerators
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 hidden md:inline">
              Assure · Redact · DataDNA · Resolve · Semantic Hub
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
              {dataPathUsecases.length} use case{dataPathUsecases.length === 1 ? '' : 's'}
            </span>
          </div>

          <h3 className="font-serif text-[22px] md:text-[26px] text-ink font-medium leading-snug mb-6 max-w-[880px]">
            <em>Certified</em> data pipelines and a semantic layer that makes enterprise data discoverable, connected, and governed.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-ink border-l border-rule">
            {dataPathUsecases.map((u, i) => (
              <UseCaseTile key={u.slug} useCase={u} index={i} />
            ))}
          </div>
        </div>

        {/* ── 05-B · App Accelerators (comes second) ── */}
        <div className="mb-2">
          <div className="flex items-baseline gap-4 mb-6 pb-3 border-b border-ink">
            <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-accent">
              Path B · App Accelerators
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4 hidden md:inline">
              Recipe Packs · Governance · Workbench
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
              {appPathUsecases.length} use case{appPathUsecases.length === 1 ? '' : 's'}
            </span>
          </div>

          <h3 className="font-serif text-[22px] md:text-[26px] text-ink font-medium leading-snug mb-6 max-w-[880px]">
            Orchestrated <em>recipes</em>, governed agents, and persona-native workbenches that turn certified data into auditable decisions.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-ink border-l border-rule">
            {appPathUsecases.map((u, i) => (
              <UseCaseTile key={u.slug} useCase={u} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-8 text-right">
          <Link to="/usecases" className="font-sans text-[13px] text-accent inline-flex items-center gap-1.5">
            All {usecases.length} use cases <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <ContactSection />
    </article>
  );
}
