import { Link, NavLink, useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

/**
 * ElevateNow Insights top bar — matches the demoboard brand block exactly.
 *   [EN logo]  ELEVATENOW · INSIGHTS           Products   Usecases   ↗ elevatenow.tech
 *
 * Sticky, 95% white with blur, hairline bottom border. Feels native to the
 * demoboard chrome so an embedded demoboard doesn't re-chrome.
 */
export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-rule"
      style={{ background: '#FFFFFF' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        {/* Left — Logo + wordmark + subtitle */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="ElevateNow Insights home">
          <img src="/EN-Blue.png" alt="" className="h-[18px] w-auto" aria-hidden="true" />
          <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-ink group-hover:text-accent transition-colors">
            ELEVATENOW
          </span>
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-4 hidden sm:inline">
            · INSIGHTS
          </span>
        </Link>

        {/* Right — nav */}
        <div className="flex items-center gap-5 md:gap-7">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `font-sans text-[13px] tracking-[0.02em] transition-colors ${
                isActive || pathname.startsWith('/product') ? 'text-accent' : 'text-ink-3 hover:text-ink'
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/usecases"
            className={({ isActive }) =>
              `font-sans text-[13px] tracking-[0.02em] transition-colors ${
                isActive || pathname.startsWith('/use-case') ? 'text-accent' : 'text-ink-3 hover:text-ink'
              }`
            }
          >
            Usecases
          </NavLink>
          <a
            href="https://elevatenow.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[13px] tracking-[0.02em] text-ink-4 hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            elevatenow.tech <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </nav>
  );
}
