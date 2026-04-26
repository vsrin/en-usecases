import { useEffect, useRef, useState } from 'react';

interface UseCaseHtmlViewerProps {
  htmlPath: string;
}

/**
 * ElevateNow Insights McKinsey-theme override injected into every legacy
 * use case HTML file. Because every legacy file uses the same `:root`
 * variable names (--ink, --paper, --accent, --border, --muted, plus --tool-blue
 * and --agent-green in some), overriding those at the end of <head> normalizes
 * all ten files to the editorial palette without touching any source file.
 *
 * Fonts are force-normalized to Source Serif 4 / Inter / JetBrains Mono.
 * The dark-gradient hero is flattened to paper-white with a serif headline.
 */
const INSIGHTS_OVERRIDE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ─────────────────────────────────────────────────────────────
   THEME TOKENS — Normalize all files to ElevateNow editorial
   ───────────────────────────────────────────────────────────── */
:root {
  --ink: #0A0A0A !important;
  --paper: #FFFFFF !important;
  --paper-2: #F5F5F3 !important;
  --accent: #0066A1 !important;
  --accent-light: #0066A1 !important;
  --accent-bg: #E5EEF4 !important;
  --tool-blue: #0066A1 !important;
  --agent-green: #0066A1 !important;
  --border: #D8D8D8 !important;
  --muted: #6B6B6B !important;
  --warning: #0066A1 !important;
  --warning-bg: #E5EEF4 !important;
  --shadow: none !important;
  --shadow-lg: none !important;
}

/* ─────────────────────────────────────────────────────────────
   GLOBAL BASE
   ───────────────────────────────────────────────────────────── */
html, body {
  font-family: 'Inter', -apple-system, system-ui, sans-serif !important;
  font-size: 15px !important;
  line-height: 1.6 !important;
  background: #FFFFFF !important;
  color: #0A0A0A !important;
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after {
  box-shadow: none !important;
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* ─────────────────────────────────────────────────────────────
   TYPOGRAPHY
   ───────────────────────────────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Source Serif 4', Georgia, serif !important;
  font-weight: 400 !important;
  letter-spacing: -0.015em !important;
  color: #0A0A0A !important;
  line-height: 1.15 !important;
}
h1 { font-weight: 300 !important; }
em, i { font-style: italic; }
.section-label, .hero-label, .lob-icon, .value-icon, .proof-badge,
.arch-box h4, .stat-label, code, pre {
  font-family: 'JetBrains Mono', 'Menlo', monospace !important;
  letter-spacing: 0.06em !important;
}
a { color: #0066A1 !important; text-decoration: none; }
strong { color: inherit; }

/* ─────────────────────────────────────────────────────────────
   HERO — flatten dark gradient to paper, scale typography down
   ───────────────────────────────────────────────────────────── */
.hero {
  min-height: auto !important;
  background: #F5F5F3 !important;
  color: #0A0A0A !important;
  padding: 72px 48px 64px !important;
  border-bottom: 1px solid #D8D8D8 !important;
  display: block !important;
}
.hero::before, .hero::after { display: none !important; }
.hero h1 {
  font-size: clamp(28px, 3.6vw, 46px) !important;
  font-weight: 300 !important;
  color: #0A0A0A !important;
  max-width: 820px !important;
  margin-bottom: 20px !important;
}
.hero h1 span { color: #0066A1 !important; }
.hero-label {
  font-size: 10.5px !important;
  letter-spacing: 0.14em !important;
  color: #6B6B6B !important;
  opacity: 1 !important;
  margin-bottom: 20px !important;
}
.hero-sub {
  font-size: 16px !important;
  color: #3D3D3D !important;
  opacity: 1 !important;
  max-width: 680px !important;
  margin-bottom: 32px !important;
  line-height: 1.65 !important;
}
.hero-meta {
  font-size: 11.5px !important;
  color: #6B6B6B !important;
  opacity: 1 !important;
  gap: 32px !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 0.05em !important;
}
.hero[style] { background: #F5F5F3 !important; }

/* ─────────────────────────────────────────────────────────────
   CONTAINER — consistent horizontal gutter
   ───────────────────────────────────────────────────────────── */
.container {
  padding-left: 48px !important;
  padding-right: 48px !important;
  padding-top: 0 !important;
}

/* ─────────────────────────────────────────────────────────────
   SECTIONS
   ───────────────────────────────────────────────────────────── */
.section {
  margin-bottom: 60px !important;
  padding-top: 60px !important;
  border-top: 1px solid #D8D8D8 !important;
}
.section:first-child { border-top: none !important; padding-top: 48px !important; }
.section-label {
  font-size: 10.5px !important;
  letter-spacing: 0.14em !important;
  color: #0066A1 !important;
  margin-bottom: 10px !important;
  font-weight: 500 !important;
  font-family: 'JetBrains Mono', monospace !important;
  text-transform: uppercase !important;
}
.section h2 {
  font-size: clamp(22px, 2.8vw, 34px) !important;
  font-weight: 300 !important;
  margin-bottom: 14px !important;
}
.section-intro {
  font-size: 15px !important;
  color: #6B6B6B !important;
  max-width: 700px !important;
  margin-bottom: 32px !important;
  line-height: 1.65 !important;
}

/* ─────────────────────────────────────────────────────────────
   PROBLEM SECTION — flatten warm-red tint to paper
   ───────────────────────────────────────────────────────────── */
.problem-backdrop {
  background: #F5F5F3 !important;
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  padding: 40px !important;
}
.stat-card {
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  border-left: 3px solid #0066A1 !important;
  box-shadow: none !important;
  background: #FFFFFF !important;
}
.stat-number {
  font-family: 'Source Serif 4', Georgia, serif !important;
  font-size: 38px !important;
  font-weight: 300 !important;
  color: #0066A1 !important;
  margin-bottom: 8px !important;
}
.stat-label {
  font-size: 11px !important;
  color: #6B6B6B !important;
  letter-spacing: 0.04em !important;
}
.problem-backdrop > p {
  font-size: 15px !important;
  color: #3D3D3D !important;
  line-height: 1.65 !important;
  margin-top: 24px !important;
}

/* ─────────────────────────────────────────────────────────────
   LOB CARDS
   ───────────────────────────────────────────────────────────── */
.lob-grid {
  gap: 16px !important;
}
.lob-card {
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 1px solid #D8D8D8 !important;
  border-top: 3px solid #0066A1 !important;
  padding: 28px 24px !important;
  background: #FFFFFF !important;
}
.lob-icon {
  border-radius: 0 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 10px !important;
  font-weight: 500 !important;
  letter-spacing: 0.1em !important;
  background: #E5EEF4 !important;
  color: #0066A1 !important;
  padding: 5px 10px !important;
  margin-bottom: 14px !important;
}
.lob-card h3 {
  font-size: 17px !important;
  font-weight: 400 !important;
  margin-bottom: 10px !important;
  line-height: 1.25 !important;
}
.lob-card p {
  font-size: 13.5px !important;
  line-height: 1.6 !important;
  color: #6B6B6B !important;
}
.lob-complexity {
  font-size: 12px !important;
  color: #0066A1 !important;
  font-weight: 500 !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 0.04em !important;
}

/* ─────────────────────────────────────────────────────────────
   DIFFERENTIATION GRID
   ───────────────────────────────────────────────────────────── */
.diff-grid { gap: 24px !important; }
.diff-column h4 {
  font-size: 14px !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em !important;
  border-bottom: 1px solid #D8D8D8 !important;
  padding-bottom: 10px !important;
  margin-bottom: 12px !important;
}
.diff-column.generic h4 { color: #6B6B6B !important; }
.diff-column.elevatenow h4 { color: #0066A1 !important; }
.diff-item {
  font-size: 13.5px !important;
  padding: 10px 0 !important;
  border-bottom: 1px solid #F0F0F0 !important;
  line-height: 1.5 !important;
}
.diff-column.generic .diff-item { color: #999 !important; }
.diff-column.elevatenow .diff-item { color: #0A0A0A !important; font-weight: 400 !important; }

/* ─────────────────────────────────────────────────────────────
   ARCHITECTURE DIAGRAM
   ───────────────────────────────────────────────────────────── */
.arch-diagram {
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  padding: 32px !important;
  margin: 32px 0 !important;
  background: #FAFAFA !important;
}
.arch-row { margin-bottom: 20px !important; gap: 16px !important; }
.arch-box {
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  border-left: 3px solid #0066A1 !important;
  background: #FFFFFF !important;
  padding: 20px !important;
}
.arch-box h4 {
  font-size: 10.5px !important;
  font-weight: 600 !important;
  letter-spacing: 0.1em !important;
  color: #0066A1 !important;
  margin-bottom: 6px !important;
  font-family: 'JetBrains Mono', monospace !important;
}
.arch-box p {
  font-size: 13px !important;
  color: #6B6B6B !important;
  line-height: 1.5 !important;
}
.arch-arrow { color: #D8D8D8 !important; font-size: 20px !important; }

/* ─────────────────────────────────────────────────────────────
   VALUE CARDS
   ───────────────────────────────────────────────────────────── */
.value-grid { gap: 16px !important; }
.value-card {
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 1px solid #D8D8D8 !important;
  border-top: 3px solid #0066A1 !important;
  padding: 28px 24px !important;
  background: #FFFFFF !important;
}
.value-icon {
  border-radius: 0 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 9.5px !important;
  font-weight: 500 !important;
  letter-spacing: 0.12em !important;
  background: #0066A1 !important;
  color: #FFFFFF !important;
  padding: 4px 10px !important;
  margin-bottom: 12px !important;
}
.value-card h4 {
  font-size: 17px !important;
  font-weight: 400 !important;
  margin-bottom: 10px !important;
}
.value-card p {
  font-size: 13.5px !important;
  color: #6B6B6B !important;
  line-height: 1.6 !important;
}
.value-metric {
  font-size: 11.5px !important;
  color: #0066A1 !important;
  font-weight: 500 !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 0.04em !important;
  padding-top: 12px !important;
  border-top: 1px solid #D8D8D8 !important;
}

/* ─────────────────────────────────────────────────────────────
   PROOF CARDS
   ───────────────────────────────────────────────────────────── */
.proof-grid { gap: 16px !important; }
.proof-card {
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 1px solid #D8D8D8 !important;
  border-top: 3px solid #0066A1 !important;
  padding: 28px 24px !important;
  background: #FFFFFF !important;
}
.proof-card.wc  { border-top-color: #0066A1 !important; }
.proof-card.auto { border-top-color: #0066A1 !important; }
.proof-card.cross { border-top-color: #0066A1 !important; }
.proof-badge {
  border-radius: 0 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 9.5px !important;
  font-weight: 500 !important;
  letter-spacing: 0.1em !important;
  background: #E5EEF4 !important;
  color: #0066A1 !important;
  padding: 4px 10px !important;
  margin-bottom: 12px !important;
}
.proof-card.wc .proof-badge,
.proof-card.auto .proof-badge,
.proof-card.cross .proof-badge {
  background: #E5EEF4 !important;
  color: #0066A1 !important;
}
.proof-card h3 {
  font-size: 17px !important;
  font-weight: 400 !important;
  margin-bottom: 10px !important;
}
.proof-card p {
  font-size: 13.5px !important;
  color: #6B6B6B !important;
  line-height: 1.6 !important;
}
.proof-result {
  font-size: 11.5px !important;
  color: #0066A1 !important;
  font-weight: 500 !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 0.03em !important;
  padding-top: 12px !important;
  border-top: 1px solid #D8D8D8 !important;
  line-height: 1.5 !important;
}

/* ─────────────────────────────────────────────────────────────
   CTA SECTION — flatten dark gradient to paper
   ───────────────────────────────────────────────────────────── */
.cta-section {
  background: #F5F5F3 !important;
  color: #0A0A0A !important;
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  padding: 56px 48px !important;
  margin: 0 0 60px !important;
}
.cta-section h2 {
  font-size: clamp(22px, 2.8vw, 32px) !important;
  font-weight: 300 !important;
  color: #0A0A0A !important;
  margin-bottom: 14px !important;
}
.cta-section p {
  font-size: 15px !important;
  color: #6B6B6B !important;
  opacity: 1 !important;
}
.btn {
  border-radius: 0 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 12px 28px !important;
  letter-spacing: 0.02em !important;
}
.btn-primary {
  background: #0066A1 !important;
  color: #FFFFFF !important;
  border: 1px solid #0066A1 !important;
}
.btn-secondary {
  background: transparent !important;
  color: #0066A1 !important;
  border: 1px solid #0066A1 !important;
}

/* ─────────────────────────────────────────────────────────────
   TABLES
   ───────────────────────────────────────────────────────────── */
table { border-collapse: collapse !important; border-top: 1px solid #0A0A0A !important; }
th, td { border-bottom: 1px solid #D8D8D8 !important; padding: 10px 12px !important; font-size: 13px !important; }
th {
  background: #F5F5F3 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 10px !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  color: #3D3D3D !important;
  font-weight: 600 !important;
}

/* ─────────────────────────────────────────────────────────────
   MISC
   ───────────────────────────────────────────────────────────── */
hr { border: none !important; border-top: 1px solid #D8D8D8 !important; margin: 32px 0 !important; }
blockquote {
  border-left: 2px solid #0066A1 !important;
  padding-left: 16px !important;
  margin: 16px 0 !important;
  font-family: 'Source Serif 4', Georgia, serif !important;
  font-style: italic !important;
  color: #1F1F1F !important;
}
.footer {
  font-size: 12px !important;
  color: #6B6B6B !important;
  border-top: 1px solid #D8D8D8 !important;
  padding: 32px 48px !important;
  text-align: center !important;
}
[style*="background:#0"], [style*="background: #0"],
[style*="background:rgb(0"], [style*="background: rgb(0"] {
  background: #F5F5F3 !important;
  color: #0A0A0A !important;
}
[class*="dark"], [class*="night"] {
  background: #FFFFFF !important;
  color: #0A0A0A !important;
}
`;

/**
 * Open external links in a new tab. Keep internal (hash, relative, same-origin)
 * links navigating the parent frame so cross-usecase links work.
 */
const LINK_HANDLER_SCRIPT = `
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (/^https?:\\/\\//.test(h) && h.indexOf(location.origin) !== 0) {
        a.target = '_blank'; a.rel = 'noopener noreferrer';
      } else if (h.startsWith('/')) {
        a.target = '_parent';
      }
    });
  });
<\/script>
`;

function prepareHtmlDocument(raw: string): string {
  // Inject override stylesheet as LAST item in <head> so it wins cascade.
  const overrideBlock = `<style data-insights-theme>${INSIGHTS_OVERRIDE_CSS}</style>${LINK_HANDLER_SCRIPT}`;
  if (/<\/head>/i.test(raw)) {
    return raw.replace(/<\/head>/i, `${overrideBlock}</head>`);
  }
  // Fallback: prepend a minimal head if none exists
  return `<!doctype html><html><head>${overrideBlock}</head><body>${raw}</body></html>`;
}

export default function UseCaseHtmlViewer({ htmlPath }: UseCaseHtmlViewerProps) {
  const [doc, setDoc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(2400);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/usecases/${htmlPath}`);
        if (!res.ok) throw new Error(`Failed to load: ${res.statusText}`);
        const raw = await res.text();
        if (cancelled) return;
        setDoc(prepareHtmlDocument(raw));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [htmlPath]);

  // Auto-resize iframe to content height
  useEffect(() => {
    const measure = () => {
      const d = iframeRef.current?.contentDocument;
      if (!d) return;
      const h = Math.max(d.documentElement.scrollHeight, d.body?.scrollHeight ?? 0);
      if (h > 0) setHeight(h);
    };
    const onLoad = () => {
      measure();
      // Measure again after fonts + images settle
      setTimeout(measure, 400);
      setTimeout(measure, 1500);
    };
    const el = iframeRef.current;
    const onResize = () => measure();
    if (el) el.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
    return () => {
      if (el) el.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
    };
  }, [doc]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">Loading</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-20 text-center">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mb-3">Error</p>
        <h2 className="assertion mb-3" style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>
          Failed to load this use case.
        </h2>
        <p className="subhead mx-auto mb-4">{error}</p>
        <p className="font-mono text-[11px] text-ink-4 mb-6">
          Expected file: <code className="bg-paper-2 px-2 py-0.5 rounded">/usecases/{htmlPath}</code>
        </p>
        <a href="/usecases" className="ink-link font-sans text-[14px]">← Back to library</a>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={doc}
      title={`Use case: ${htmlPath}`}
      className="w-full block bg-paper"
      style={{ height, border: 'none' }}
      sandbox="allow-same-origin allow-scripts allow-popups"
    />
  );
}
