import { Link } from 'react-router-dom';

/**
 * Minimal editorial footer — mono meta left, contact right, hairline top rule.
 * Mirrors the footer convention of the demoboard exhibits.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule mt-20">
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Left — brand + tagline */}
          <div className="flex items-center gap-3">
            <img src="/EN-Blue.png" alt="" className="h-[18px] w-auto" aria-hidden="true" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-ink">
              ELEVATENOW
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-4 hidden sm:inline">
              · INSIGHTS
            </span>
          </div>

          {/* Right — nav */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[13px] text-ink-3">
            <Link to="/products" className="ink-link">Products</Link>
            <Link to="/usecases" className="ink-link">Usecases</Link>
            <a href="mailto:gps@elevatenow.tech" className="ink-link">gps@elevatenow.tech</a>
            <a href="https://elevatenow.tech" target="_blank" rel="noopener noreferrer" className="ink-link">
              elevatenow.tech
            </a>
          </div>
        </div>

        {/* Bottom meta line */}
        <div className="pt-6 border-t border-rule-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
            © {year} Elevatenow · Insurance Intelligence Platform · Confidential
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
            The publication arm of <a href="https://elevatenow.tech" target="_blank" rel="noopener noreferrer" className="ink-link">elevatenow.tech</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
