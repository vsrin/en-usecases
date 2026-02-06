import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-12 px-6 border-t ${
      isDark 
        ? 'bg-en-navy border-en-border' 
        : 'bg-white border-lt-border'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <img 
              src="/elevatenowlogo.png" 
              alt="ElevateNow" 
              className="h-7 w-auto mb-3"
            />
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-en-muted' : 'text-lt-text-secondary'
            }`}>
              Governance-first agentic AI for insurance operations
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-en-white' : 'text-lt-text'
            }`}>
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://elevatenow.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors ${
                    isDark ? 'text-en-muted hover:text-en-cyan' : 'text-lt-text-secondary hover:text-en-blue'
                  }`}
                >
                  Main Website
                </a>
              </li>
              <li>
                <a 
                  href="https://elevatenow.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors ${
                    isDark ? 'text-en-muted hover:text-en-cyan' : 'text-lt-text-secondary hover:text-en-blue'
                  }`}
                >
                  Platform Overview
                </a>
              </li>
              <li>
                <a 
                  href="https://elevatenow.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors ${
                    isDark ? 'text-en-muted hover:text-en-cyan' : 'text-lt-text-secondary hover:text-en-blue'
                  }`}
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-en-white' : 'text-lt-text'
            }`}>
              Get in Touch
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:gps@elevatenow.tech"
                  className={`text-sm transition-colors ${
                    isDark ? 'text-en-muted hover:text-en-cyan' : 'text-lt-text-secondary hover:text-en-blue'
                  }`}
                >
                  gps@elevatenow.tech
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/company/elevatenow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm transition-colors ${
                    isDark ? 'text-en-muted hover:text-en-cyan' : 'text-lt-text-secondary hover:text-en-blue'
                  }`}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`pt-8 border-t text-center ${
          isDark ? 'border-en-border' : 'border-lt-border'
        }`}>
          <p className={`text-xs ${
            isDark ? 'text-en-muted' : 'text-lt-text-muted'
          }`}>
            © {currentYear} ElevateNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
