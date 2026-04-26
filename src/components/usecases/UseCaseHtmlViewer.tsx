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

/* ── Normalize theme variables ────────────────────────────── */
:root {
  --ink: #0A0A0A !important;
  --ink-2: #1F1F1F !important;
  --ink-3: #3D3D3D !important;
  --ink-4: #6B6B6B !important;
  --paper: #FFFFFF !important;
  --paper-2: #F5F5F3 !important;
  --accent: #0066A1 !important;
  --accent-light: #0066A1 !important;
  --accent-2: #004A75 !important;
  --accent-bg: #E5EEF4 !important;
  --accent-soft: #E5EEF4 !important;
  --tool-blue: #0066A1 !important;
  --agent-green: #0066A1 !important;
  --border: #D8D8D8 !important;
  --border-2: #E8E8E8 !important;
  --rule: #D8D8D8 !important;
  --muted: #6B6B6B !important;
  --shadow: none !important;
  --shadow-lg: none !important;
}

/* ── Global reset ─────────────────────────────────────────── */
html, body {
  font-family: 'Inter', -apple-system, system-ui, sans-serif !important;
  font-size: 15px !important;
  line-height: 1.55 !important;
  background: #FFFFFF !important;
  color: #0A0A0A !important;
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after { box-shadow: none !important; }

/* ── Headings: serif, light weight, negative letter-spacing ── */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Source Serif 4', Georgia, serif !important;
  font-weight: 400 !important;
  letter-spacing: -0.015em !important;
  color: #0A0A0A !important;
  line-height: 1.15 !important;
}
h1 { font-weight: 300 !important; }

/* ── Strong emphasis uses serif italic medium ────────────── */
em, i { font-style: italic; font-weight: 500; }

/* ── Meta / mono labels across all files ─────────────────── */
.meta, .label, .category-tag, .section-label, .tag, .eyebrow,
[class*="badge"], [class*="label"], [class*="tag"], [class*="meta"],
code, pre {
  font-family: 'JetBrains Mono', 'Menlo', monospace !important;
}

/* ── Kill dark gradient heros across every file, restyle as paper ── */
.hero, [class*="hero"], section.hero {
  min-height: auto !important;
  background: #F5F5F3 !important;
  color: #0A0A0A !important;
  padding: 64px 48px !important;
  border-bottom: 1px solid #D8D8D8 !important;
}
.hero::before, .hero::after,
[class*="hero"]::before, [class*="hero"]::after { display: none !important; }
.hero h1, .hero h2, .hero h3, .hero h4,
[class*="hero"] h1, [class*="hero"] h2, [class*="hero"] h3, [class*="hero"] h4 {
  color: #0A0A0A !important;
}
.hero p, .hero span, .hero .subtitle, .hero .tagline,
[class*="hero"] p, [class*="hero"] .subtitle {
  color: #1F1F1F !important;
}
.hero strong, [class*="hero"] strong { color: #0066A1 !important; }

/* Strip any inline-style gradient/solid-dark bg on the hero */
.hero[style], [class*="hero"][style] {
  background: #F5F5F3 !important;
}

/* ── Color accents: all previously-colorful accents become editorial blue ── */
a { color: #0066A1 !important; }
a:hover { color: #004A75 !important; }
.accent, .highlight, [class*="accent"], .text-accent { color: #0066A1 !important; }

/* ── Buttons: outline style, no dark fill ───────────────── */
button, .btn, .cta, a.btn, .button, [class*="button"] {
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* ── Cards: flatten shadows, use hairline rules ─────────── */
.card, [class*="card"], .panel, [class*="panel"], .tile, [class*="tile"] {
  box-shadow: none !important;
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  background: #FFFFFF !important;
}

/* ── Tables: editorial style ────────────────────────────── */
table {
  border-collapse: collapse !important;
  border-top: 1px solid #0A0A0A !important;
}
th, td {
  border-bottom: 1px solid #D8D8D8 !important;
  padding: 10px 12px !important;
  font-size: 13.5px !important;
}
th {
  background: #F5F5F3 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 10.5px !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  color: #3D3D3D !important;
  font-weight: 600 !important;
}

/* ── Horizontal rules: hairline ─────────────────────────── */
hr { border: none !important; border-top: 1px solid #D8D8D8 !important; margin: 32px 0 !important; }

/* ── Blockquotes: left-bar editorial ─────────────────────── */
blockquote {
  border-left: 2px solid #0066A1 !important;
  padding-left: 16px !important;
  margin: 16px 0 !important;
  font-family: 'Source Serif 4', Georgia, serif !important;
  font-style: italic !important;
  color: #1F1F1F !important;
}

/* ── Muted stat numbers keep large serif ─────────────────── */
.number, .metric, .stat, [class*="number"], [class*="metric"], [class*="stat"] {
  font-family: 'Source Serif 4', Georgia, serif !important;
  font-weight: 300 !important;
}

/* ── Section dividers hairline ─────────────────────────── */
section { border-bottom: 1px solid #D8D8D8; }
section:last-child { border-bottom: none; }

/* ── Sanitize any dark-background sections past the hero ─── */
[style*="background:#0"], [style*="background: #0"],
[style*="background:rgb(0"], [style*="background: rgb(0"] {
  background: #F5F5F3 !important;
  color: #0A0A0A !important;
}

/* ── Soften hardcoded dark-mode color classes ─────────── */
[class*="dark"], [class*="night"] {
  background: #FFFFFF !important;
  color: #0A0A0A !important;
}

/* ── Normalize container horizontal padding ──────────── */
.container {
  padding-left: 48px !important;
  padding-right: 48px !important;
}

/* ── Kill all hover transforms and transitions ────────── */
*, *::before, *::after {
  transition: none !important;
  animation: none !important;
}
.lob-card:hover, .value-card:hover, .proof-card:hover,
.btn:hover, .btn-primary:hover, .btn-secondary:hover,
a:hover, [class*="card"]:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* ── Flatten .problem-backdrop ────────────────────────── */
.problem-backdrop, [class*="problem"] {
  background: #F5F5F3 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 1px solid #D8D8D8 !important;
  padding: 40px !important;
}

/* ── Stat cards — editorial left rule ────────────────── */
.stat-card {
  border-radius: 0 !important;
  border-left: 3px solid #0066A1 !important;
  box-shadow: none !important;
}
.stat-number { color: #0066A1 !important; }

/* ── Flatten CTA section — paper style ───────────────── */
.cta-section {
  background: #F5F5F3 !important;
  color: #0A0A0A !important;
  border-radius: 0 !important;
  border: 1px solid #D8D8D8 !important;
  padding: 56px 48px !important;
  box-shadow: none !important;
}
.cta-section h2 { color: #0A0A0A !important; font-size: clamp(22px, 2.8vw, 34px) !important; }
.cta-section p { color: #3D3D3D !important; opacity: 1 !important; }
.btn-primary {
  background: #0066A1 !important;
  color: #FFFFFF !important;
  border: none !important;
}
.btn-secondary {
  background: transparent !important;
  color: #0066A1 !important;
  border: 1px solid #0066A1 !important;
}

/* ── Architecture diagram — flatten ─────────────────── */
.arch-diagram {
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 1px solid #D8D8D8 !important;
  padding: 32px !important;
}
.arch-box {
  border-radius: 0 !important;
  border-left: 3px solid #0066A1 !important;
}

/* ── LOB / value / proof cards — no border-radius ────── */
.lob-card, .value-card, .proof-card {
  border-radius: 0 !important;
}
.lob-icon, .value-icon, .proof-badge {
  border-radius: 0 !important;
}

/* ── Section headings — editorial scale ─────────────── */
.section h2 {
  font-size: clamp(22px, 2.8vw, 34px) !important;
  font-weight: 300 !important;
}
.section-intro {
  font-size: 15px !important;
  line-height: 1.6 !important;
}

/* ── Diff grid labels ─────────────────────────────────── */
.diff-column.generic h4 { color: #6B6B6B !important; }
.diff-column.elevatenow h4 { color: #0066A1 !important; }
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
