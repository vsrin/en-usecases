#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Fix v5 - Homepage rendering + footer cleanup + HTML path
# Run from project root: chmod +x fix-v5.sh && ./fix-v5.sh
# ═══════════════════════════════════════════════════════════════
set -e

echo "▸ Checking HTML file in public/usecases/..."
if [ -f "public/usecases/CohortAnalysis-ElecatenowRecipe.html" ]; then
  echo "  Found: CohortAnalysis-ElecatenowRecipe.html"
elif [ -f "public/usecases/CohortAnalysis-ElevatenowRecipe.html" ]; then
  echo "  Found: CohortAnalysis-ElevatenowRecipe.html (different name)"
  echo "  Renaming to match data config..."
  mv "public/usecases/CohortAnalysis-ElevatenowRecipe.html" "public/usecases/CohortAnalysis-ElecatenowRecipe.html"
else
  echo "  Listing public/usecases/ contents:"
  ls -la public/usecases/ 2>/dev/null || echo "  Directory empty or missing"
fi

echo "▸ Fixing Footer (minimal, no logo, no company name)..."
cat > src/components/layout/Footer.tsx << 'EOF'
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`border-t py-8 px-6 ${
      isDark ? 'border-en-border bg-en-navy' : 'border-lt-border bg-lt-bg-secondary'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className={`text-xs ${isDark ? 'text-en-muted' : 'text-lt-text-muted'}`}>
          {new Date().getFullYear()} ElevateNow
        </span>
        <div className={`flex items-center gap-6 text-xs ${isDark ? 'text-en-muted' : 'text-lt-text-muted'}`}>
          <a href="https://elevatenow.tech" target="_blank" rel="noopener noreferrer"
            className={isDark ? 'hover:text-white transition-colors' : 'hover:text-lt-text transition-colors'}>
            Main Site
          </a>
          <a href="https://elevatenow.tech/contact-us" target="_blank" rel="noopener noreferrer"
            className={isDark ? 'hover:text-white transition-colors' : 'hover:text-lt-text transition-colors'}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
EOF

echo "▸ Fixing Navbar (show '/ Use Cases' only on detail pages, not home)..."
cat > src/components/layout/Navbar.tsx << 'EOF'
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith('/use-case/');
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-en-border"
      style={{
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/elevatenowlogo.png" alt="ElevateNow" className="h-8 w-auto" />
          {isDetail && (
            <span className="text-en-muted text-sm ml-1">/ Use Cases</span>
          )}
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              !isDetail ? 'text-white' : 'text-en-muted hover:text-white'
            }`}
          >
            Library
          </Link>
          <a
            href="https://elevatenow.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-en-muted hover:text-white transition-colors flex items-center gap-1"
          >
            elevatenow.tech
            <ArrowUpRight size={14} />
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-en-muted hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href="#contact"
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-en-blue text-white hover:bg-en-blue-dim transition-colors"
          >
            Connect With Us
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
EOF

echo "▸ Fixing UseCaseHtmlViewer (better iframe handling)..."
cat > src/components/usecases/UseCaseHtmlViewer.tsx << 'EOF'
import { useEffect, useRef, useState } from 'react';

interface Props {
  htmlPath: string;
}

export default function UseCaseHtmlViewer({ htmlPath }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentWindow?.document;
        if (doc?.body) {
          const h = Math.max(
            doc.body.scrollHeight,
            doc.body.offsetHeight,
            doc.documentElement?.scrollHeight || 0
          );
          setHeight(`${h + 40}px`);
        }
      } catch {
        // Cross-origin fallback
        setHeight('300vh');
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <iframe
        ref={iframeRef}
        src={`/usecases/${htmlPath}`}
        style={{ height, width: '100%', border: 'none' }}
        title="Use Case Detail"
      />
    </div>
  );
}
EOF

echo "▸ Fixing HomePage (ensure tiles render)..."
cat > src/pages/HomePage.tsx << 'EOF'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useCases } from '../data/usecases';
import { CATEGORY_CONFIG, type UseCaseCategory } from '../types/usecase';
import UseCaseTile from '../components/usecases/UseCaseTile';
import ContactSection from '../components/usecases/ContactSection';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory | 'all'>('all');
  const { isDark } = useTheme();

  const filtered = useCases.filter((uc) => {
    const matchesSearch =
      search === '' ||
      uc.title.toLowerCase().includes(search.toLowerCase()) ||
      uc.summary.toLowerCase().includes(search.toLowerCase()) ||
      uc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || uc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.entries(CATEGORY_CONFIG) as [UseCaseCategory, typeof CATEGORY_CONFIG[UseCaseCategory]][];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-en-navy' : 'bg-lt-bg'}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-grid-pattern opacity-40' : 'bg-grid-pattern-light opacity-60'}`} />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-en-blue) 0%, transparent 70%)', opacity: 0.12 }}
        />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-medium tracking-[4px] uppercase mb-4 text-en-blue">
              ElevateNow Use Case Library
            </p>
            <h1 className={`font-display text-5xl md:text-7xl leading-[1.1] mb-6 max-w-4xl ${
              isDark ? 'text-en-white' : 'text-lt-text'
            }`}>
              How Agentic AI{' '}
              <span className={isDark ? 'text-gradient-cyan' : 'text-gradient-blue'}>Reshapes</span>
              {' '}Insurance Operations
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl leading-relaxed mb-10 ${
              isDark ? 'text-en-muted' : 'text-lt-text-secondary'
            }`}>
              Each use case explores a real operational challenge in insurance and examines
              how composable AI agents, governance-first architecture, and workflow recipes
              offer a structurally different approach.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            <div className="relative flex-1 max-w-md">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-en-muted' : 'text-lt-text-muted'
              }`} />
              <input
                type="text"
                placeholder="Search use cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-white/5 border border-en-border text-en-white placeholder-en-muted focus:border-en-blue/40'
                    : 'bg-white border border-lt-border text-lt-text placeholder-lt-text-muted focus:border-en-blue/40 shadow-sm'
                }`}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={14} className={isDark ? 'text-en-muted' : 'text-lt-text-muted'} />
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-en-blue-bg text-en-blue border border-en-blue/20'
                    : isDark
                      ? 'bg-white/5 text-en-muted border border-transparent hover:bg-white/10'
                      : 'bg-white text-lt-text-secondary border border-lt-border hover:bg-lt-bg-tertiary'
                }`}
              >
                All
              </button>
              {categories.map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === key
                      ? 'bg-en-blue-bg text-en-blue border border-en-blue/20'
                      : isDark
                        ? 'bg-white/5 text-en-muted border border-transparent hover:bg-white/10'
                        : 'bg-white text-lt-text-secondary border border-lt-border hover:bg-lt-bg-tertiary'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((uc, i) => (
                <UseCaseTile key={uc.id} useCase={uc} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-en-muted' : 'text-lt-text-muted'}`}>
                No use cases match your search.
              </p>
            </div>
          )}
          <div className="mt-8 text-center">
            <p className={`text-sm ${isDark ? 'text-en-muted' : 'text-lt-text-muted'}`}>
              {filtered.length} use case{filtered.length !== 1 ? 's' : ''}{' '}
              {activeCategory !== 'all' ? `in ${CATEGORY_CONFIG[activeCategory].label}` : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </div>
  );
}
EOF

echo "▸ Verifying data file matches types..."
cat > src/data/usecases.ts << 'EOF'
import type { UseCaseMeta } from '../types/usecase';

export const useCases: UseCaseMeta[] = [
  {
    id: 'cohort-analysis',
    slug: 'cohort-analysis',
    title: 'Rethinking Cohort Analysis in P&C Reserving',
    subtitle: 'Why Agentic AI Changes the Actuarial Paradigm',
    category: 'actuarial',
    tags: ['Loss Reserving', 'Cohort Segmentation', 'Agentic Architecture', 'Governance'],
    status: 'published',
    publishedAt: '2025-06-01',
    estimatedReadMin: 12,
    detailType: 'html',
    htmlPath: 'CohortAnalysis-ElecatenowRecipe.html',
    keyQuestion: 'What if actuaries could test every plausible cohort hypothesis — not just the ones time allows?',
    summary:
      'Traditional cohort analysis tests a fraction of possible segmentations due to manual constraints. This use case explores how composable AI agents can systematically evaluate cohort hypotheses while preserving actuarial rigor, governance, and regulatory transparency.',
  },
  {
    id: 'submission-triage',
    slug: 'submission-triage',
    title: 'The Submission Bottleneck Problem',
    subtitle: 'How Structured AI Triage Changes Underwriting Throughput',
    category: 'underwriting',
    tags: ['Submission Intake', 'Intelligent Routing', 'Appetite Alignment'],
    status: 'coming-soon',
    publishedAt: '',
    estimatedReadMin: 10,
    detailType: 'component',
    keyQuestion: 'Why do underwriters spend more time finding the right submissions than analyzing them?',
    summary:
      'Commercial submissions arrive in unstructured formats across inconsistent channels. This use case examines how agentic workflows can decompose, classify, and route submissions against appetite guidelines — shifting underwriter effort from logistics to judgment.',
  },
  {
    id: 'loss-run-analysis',
    slug: 'loss-run-analysis',
    title: 'Unlocking Signal in Loss Run Data',
    subtitle: 'From Unstructured PDFs to Structured Risk Intelligence',
    category: 'underwriting',
    tags: ['Loss Run', 'Document Intelligence', 'Risk Assessment', 'Data Normalization'],
    status: 'coming-soon',
    publishedAt: '',
    estimatedReadMin: 8,
    detailType: 'component',
    keyQuestion: 'How much risk insight is trapped in loss run PDFs that no one has time to properly decode?',
    summary:
      'Loss runs are the most information-dense artifact in commercial underwriting — yet they arrive in dozens of formats and are typically reviewed through pattern recognition rather than systematic extraction. This use case explores what changes when AI agents normalize and interrogate loss history at scale.',
  },
  {
    id: 'audit-compliance',
    slug: 'audit-compliance-monitoring',
    title: 'Continuous Compliance as Architecture',
    subtitle: 'Moving Audit from Post-Hoc Review to Embedded Governance',
    category: 'compliance',
    tags: ['Audit', 'Regulatory', 'Governance', 'Embedded Controls'],
    status: 'coming-soon',
    publishedAt: '',
    estimatedReadMin: 10,
    detailType: 'component',
    keyQuestion: 'What if compliance were a property of the workflow, not a review that happens after?',
    summary:
      'Insurance compliance traditionally operates as a retrospective check. This use case explores the architectural shift toward embedding governance agents directly within operational workflows — making compliance continuous, auditable, and inseparable from the decisions themselves.',
  },
];
EOF

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Fix complete.                                        ║"
echo "║                                                        ║"
echo "║   Check your browser console (F12) for any errors.     ║"
echo "║   Make sure you're on http://localhost:5173/ (home)     ║"
echo "║   not on /use-case/... (detail page).                  ║"
echo "║                                                        ║"
echo "║   Run: npm run dev                                     ║"
echo "╚══════════════════════════════════════════════════════════╝"