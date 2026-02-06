import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-en-navy/80 backdrop-blur-xl border-b border-en-border' 
        : 'bg-white/80 backdrop-blur-xl border-b border-lt-border shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/elevatenowlogo.png" 
              alt="ElevateNow" 
              className="h-8 w-auto"
            />
            <span className={`text-sm px-3 py-1 rounded-full ${
              isDark 
                ? 'bg-en-cyan/10 text-en-cyan border border-en-cyan/20' 
                : 'bg-en-blue/10 text-en-blue border border-en-blue/20'
            }`}>
              Use Cases
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://elevatenow.tech"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors ${
                isDark ? 'text-en-muted hover:text-en-white' : 'text-lt-text-secondary hover:text-lt-text'
              }`}
            >
              Main Site
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/15 text-en-white' 
                  : 'bg-lt-bg-tertiary hover:bg-lt-border text-lt-text'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
