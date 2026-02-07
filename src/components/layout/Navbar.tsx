import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/use-case/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-en-navy/95 backdrop-blur-xl border-b border-en-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left side - Logo or Back button */}
        <div className="flex items-center gap-4">
          {isDetailPage ? (
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-en-muted hover:text-en-white transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Library
            </Link>
          ) : (
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/elevatenowlogo.png" 
                alt="ElevateNow" 
                className="h-8 w-auto"
              />
              <span className="text-sm px-3 py-1 rounded-full bg-en-cyan/10 text-en-cyan border border-en-cyan/20">
                Use Cases
              </span>
            </Link>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://elevatenow.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-en-muted hover:text-en-white transition-colors"
          >
            Main Site
          </a>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-en-white transition-all hover:scale-110"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}