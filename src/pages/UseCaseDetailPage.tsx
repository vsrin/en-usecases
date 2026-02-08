import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getUseCaseBySlug } from '../data/usecases';
import UseCaseHtmlViewer from '../components/usecases/UseCaseHtmlViewer';
import { useTheme } from '../context/ThemeContext';

export default function UseCaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();
  
  const useCase = slug ? getUseCaseBySlug(slug) : undefined;

  // Scroll to top when page loads or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!useCase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-en-white' : 'text-lt-text'}`}>
            Use Case Not Found
          </h2>
          <p className={`mb-6 ${isDark ? 'text-en-muted' : 'text-lt-text-secondary'}`}>
            The use case you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-en-blue hover:underline font-medium"
          >
            <ArrowLeft size={16} />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  // If coming soon, show placeholder
  if (useCase.status === 'coming-soon') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-en-white' : 'text-lt-text'}`}>
            Coming Soon
          </h2>
          <p className={`mb-2 ${isDark ? 'text-en-muted' : 'text-lt-text-secondary'}`}>
            {useCase.title}
          </p>
          <p className={`mb-6 text-sm ${isDark ? 'text-en-muted' : 'text-lt-text-muted'}`}>
            This use case is currently in development. Check back soon!
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-en-blue hover:underline font-medium"
          >
            <ArrowLeft size={16} />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  // If detailType is 'html' and htmlPath exists, render the HTML viewer
  if (useCase.detailType === 'html' && useCase.htmlPath) {
    return (
      <div className="use-case-detail">
        {/* HTML Content - starts at top, under fixed navbar */}
        <div className="pt-20">
          <UseCaseHtmlViewer htmlPath={useCase.htmlPath} />
        </div>
      </div>
    );
  }

  // Fallback for component-based detail (future use)
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link 
        to="/" 
        className={`inline-flex items-center gap-2 mb-8 font-medium transition-colors ${
          isDark ? 'text-en-muted hover:text-en-white' : 'text-lt-text-secondary hover:text-lt-text'
        }`}
      >
        <ArrowLeft size={18} />
        Back to Library
      </Link>
      
      <article className="prose prose-lg max-w-none">
        <h1 className={isDark ? 'text-en-white' : 'text-lt-text'}>{useCase.title}</h1>
        <p className="lead text-en-blue">{useCase.subtitle}</p>
        <blockquote className={isDark ? 'text-en-muted' : 'text-lt-text-secondary'}>
          {useCase.keyQuestion}
        </blockquote>
        <p className={isDark ? 'text-en-muted' : 'text-lt-text-secondary'}>{useCase.summary}</p>
      </article>
    </div>
  );
}