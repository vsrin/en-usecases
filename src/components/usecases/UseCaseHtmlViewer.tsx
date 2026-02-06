import { useEffect, useState } from 'react';

interface UseCaseHtmlViewerProps {
  htmlPath: string;
}

export default function UseCaseHtmlViewer({ htmlPath }: UseCaseHtmlViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHtml = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from public folder
        const response = await fetch(`/usecases/${htmlPath}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load use case: ${response.statusText}`);
        }
        
        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        console.error('Error loading HTML:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadHtml();
  }, [htmlPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-en-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-en-paper-muted">Loading use case...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2 text-en-ink">Failed to Load</h2>
          <p className="text-en-paper-muted mb-4">{error}</p>
          <a href="/" className="text-en-blue hover:underline">Return to Library</a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="html-viewer"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
