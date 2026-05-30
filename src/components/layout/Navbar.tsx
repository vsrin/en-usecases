import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ExternalLink, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-rule" style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 h-[76px] flex items-center justify-between">
        {/* Left — logo + wordmark */}
        <Link to="/" className="flex items-center gap-4 group" aria-label="ElevateNow Insights home" onClick={close}>
          <img
            src="/Elevatenow-Logo.svg"
            alt="Elevatenow"
            className="h-[34px] w-auto group-hover:opacity-80 transition-opacity"
          />
          <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-ink-4 hidden sm:inline">
            · INSIGHTS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `font-sans text-[15px] tracking-[0.01em] transition-colors ${
                isActive || pathname.startsWith('/product') ? 'text-accent font-medium' : 'text-ink-2 hover:text-ink'
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/usecases"
            className={({ isActive }) =>
              `font-sans text-[15px] tracking-[0.01em] transition-colors ${
                isActive || pathname.startsWith('/use-case') ? 'text-accent font-medium' : 'text-ink-2 hover:text-ink'
              }`
            }
          >
            Usecases
          </NavLink>
          <a
            href="https://elevatenow.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[15px] tracking-[0.01em] text-ink-3 hover:text-accent transition-colors inline-flex items-center gap-1.5"
          >
            elevatenow.tech <ExternalLink size={13} />
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 text-ink-2 hover:text-ink transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-rule bg-white px-6 py-4 flex flex-col gap-5">
          <NavLink
            to="/products"
            onClick={close}
            className={({ isActive }) =>
              `font-sans text-[16px] tracking-[0.01em] transition-colors ${
                isActive || pathname.startsWith('/product') ? 'text-accent font-medium' : 'text-ink-2'
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/usecases"
            onClick={close}
            className={({ isActive }) =>
              `font-sans text-[16px] tracking-[0.01em] transition-colors ${
                isActive || pathname.startsWith('/use-case') ? 'text-accent font-medium' : 'text-ink-2'
              }`
            }
          >
            Usecases
          </NavLink>
          <a
            href="https://elevatenow.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[16px] tracking-[0.01em] text-ink-3 inline-flex items-center gap-1.5"
            onClick={close}
          >
            elevatenow.tech <ExternalLink size={13} />
          </a>
        </div>
      )}
    </nav>
  );
}
