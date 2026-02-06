import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCases } from '../data/usecases';
import UseCaseHtmlViewer from '../components/usecases/UseCaseHtmlViewer';
import { useTheme } from '../context/ThemeContext';

export default function UseCaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();
  const useCase = useCases.find((uc) => uc.slug === slug);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!useCase) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-24 ${isDark ? 'bg-en-navy' : 'bg-lt-bg'}`}>
        <div className="text-center">
          <h1 className={`text-3xl font-semibold mb-4 ${isDark ? 'text-en-white' : 'text-lt-text'}`}>Use Case Not Found</h1>
          <Link to="/" className="text-en-blue hover:underline">Back to Library</Link>
        </div>
      </div>
    );
  }

  if (useCase.status === 'coming-soon') {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-24 ${isDark ? 'bg-en-navy' : 'bg-lt-bg'}`}>
        <div className="text-center">
          <h1 className={`text-3xl font-semibold mb-4 ${isDark ? 'text-en-white' : 'text-lt-text'}`}>{useCase.title}</h1>
          <p className={`mb-6 ${isDark ? 'text-en-muted' : 'text-lt-text-secondary'}`}>This write-up is coming soon.</p>
          <Link to="/" className="text-en-blue hover:underline">Back to Library</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-en-paper pt-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-en-paper-muted hover:text-en-ink text-sm transition-colors">
          <ArrowLeft size={16} />
          Back to Use Case Library
        </Link>
      </motion.div>
      {useCase.detailType === 'html' && useCase.htmlPath && (
        <UseCaseHtmlViewer htmlPath={useCase.htmlPath} />
      )}
      {useCase.detailType === 'component' && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-en-paper-muted">Component-based detail view placeholder.</p>
        </div>
      )}
    </div>
  );
}
