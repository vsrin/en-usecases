import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { usecases } from '../data/usecases';
import { CATEGORY_CONFIG, type UseCaseCategory } from '../types/usecase';
import UseCaseTile from '../components/usecases/UseCaseTile';
import ContactSection from '../components/usecases/ContactSection';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory | 'all'>('all');
  const { isDark } = useTheme();

  const filtered = usecases.filter((uc) => {
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
          style={{ background: 'radial-gradient(circle, var(--color-en-blue) 0%, transparent 70%)', opacity: isDark ? 0.12 : 0.08 }}
        />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-medium tracking-[4px] uppercase mb-4 text-en-blue">
              ElevateNow Use Case Library
            </p>
            <h1 className={`font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6 max-w-4xl ${
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
                    : 'bg-white border-2 border-lt-border text-lt-text placeholder-lt-text-muted focus:border-en-blue/40 shadow-sm'
                }`}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={14} className={isDark ? 'text-en-muted' : 'text-lt-text-muted'} />
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-en-blue-bg text-en-blue border-2 border-en-blue/30'
                    : isDark
                      ? 'bg-white/5 text-en-muted border border-transparent hover:bg-white/10'
                      : 'bg-white text-lt-text-secondary border-2 border-lt-border hover:bg-lt-bg-tertiary'
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
                      ? 'bg-en-blue-bg text-en-blue border-2 border-en-blue/30'
                      : isDark
                        ? 'bg-white/5 text-en-muted border border-transparent hover:bg-white/10'
                        : 'bg-white text-lt-text-secondary border-2 border-lt-border hover:bg-lt-bg-tertiary'
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