import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { CATEGORY_CONFIG, type UseCaseMeta } from '../../types/usecase';
import CategoryBadge from '../ui/CategoryBadge';
import StatusIndicator from '../ui/StatusIndicator';
import { useTheme } from '../../context/ThemeContext';

interface UseCaseTileProps {
  useCase: UseCaseMeta;
  index: number;
}

export default function UseCaseTile({ useCase, index }: UseCaseTileProps) {
  const { isDark } = useTheme();
  const categoryConfig = CATEGORY_CONFIG[useCase.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/use-case/${useCase.slug}`}
        className={`block group rounded-2xl overflow-hidden transition-all duration-300 ${
          isDark 
            ? 'glass-card hover:border-en-blue/30' 
            : 'glass-card-light hover:border-en-blue/40 hover:shadow-xl'
        }`}
      >
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <CategoryBadge category={useCase.category} />
            <StatusIndicator status={useCase.status} />
          </div>

          <h3 className={`font-display text-2xl font-bold mb-2 group-hover:text-en-blue transition-colors ${
            isDark ? 'text-en-white' : 'text-lt-text'
          }`}>
            {useCase.title}
          </h3>

          <p className={`text-sm font-medium mb-3 ${
            isDark ? 'text-en-cyan-dim' : 'text-en-blue'
          }`}>
            {useCase.subtitle}
          </p>

          {/* Key Question */}
          <div className={`p-4 rounded-lg mb-4 ${
            isDark ? 'bg-white/5' : 'bg-lt-bg-tertiary border border-lt-border'
          }`}>
            <p className={`text-sm italic leading-relaxed ${
              isDark ? 'text-en-muted' : 'text-lt-text-secondary'
            }`}>
              "{useCase.keyQuestion}"
            </p>
          </div>

          {/* Summary */}
          <p className={`text-sm leading-relaxed mb-4 ${
            isDark ? 'text-en-muted' : 'text-lt-text-secondary'
          }`}>
            {useCase.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {useCase.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  isDark
                    ? 'bg-white/5 text-en-muted'
                    : 'bg-lt-bg-tertiary text-lt-text-secondary border border-lt-border'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 flex items-center justify-between border-t ${
          isDark ? 'border-en-border' : 'border-lt-border'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            <Clock size={14} className={isDark ? 'text-en-muted' : 'text-lt-text-muted'} />
            <span className={isDark ? 'text-en-muted' : 'text-lt-text-muted'}>
              {useCase.estimatedReadMin} min read
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-en-blue group-hover:gap-3 transition-all">
            {useCase.status === 'published' ? 'Read More' : 'Coming Soon'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hover Effect Bar */}
        <div 
          className="h-1 w-0 group-hover:w-full transition-all duration-300 ease-out"
          style={{ backgroundColor: categoryConfig.color }}
        />
      </Link>
    </motion.div>
  );
}
