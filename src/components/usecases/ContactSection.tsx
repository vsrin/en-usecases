/**
 * Editorial close-section — the "working session, not a demo" pattern from
 * the demoboard's final exhibit. Used as the closing exhibit on landing.
 */
export default function ContactSection() {
  return (
    <section className="max-w-[1180px] mx-auto px-6 md:px-12 py-20 border-t border-rule mt-8">
      <div className="exhibit-label">
        Close · Engagement
        <span className="line" />
      </div>

      <h2 className="assertion mb-4" style={{ fontSize: 'clamp(28px, 3vw, 38px)', maxWidth: '880px' }}>
        The goal of a first meeting is a <em>working session</em>, not a demo.
      </h2>

      <p className="font-serif font-light text-[18px] leading-[1.5] text-ink-2 max-w-[780px] mb-10">
        Share a data product, a claims workflow, or an audit response you want to stress-test against
        the ElevateNow stack. We arrive with a demoboard that argues a position. You arrive with the
        shape of your problem. Together, we decide whether there is an engagement worth the time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-ink border-l border-rule">
        <a
          href="mailto:gps@elevatenow.tech?subject=ElevateNow%20Insights%20%E2%80%94%20working%20session%20request"
          className="block p-6 border-r border-b border-rule bg-paper hover:bg-paper-2 transition-colors group"
        >
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent font-semibold mb-3">
            01 · Book a working session
          </p>
          <p className="font-serif text-[17px] text-ink leading-snug mb-2 group-hover:text-accent transition-colors">
            Send a short note to <em>gps@elevatenow.tech</em> with the data product, workflow, or audit question you want to test.
          </p>
          <p className="font-sans text-[12px] text-ink-4">We reply within two business days with a pre-read and two time options.</p>
        </a>
        <a
          href="https://elevatenow.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 border-r border-b border-rule bg-paper hover:bg-paper-2 transition-colors group"
        >
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent font-semibold mb-3">
            02 · Visit elevatenow.tech
          </p>
          <p className="font-serif text-[17px] text-ink leading-snug mb-2 group-hover:text-accent transition-colors">
            The company site — platform overview, positioning, and the broader story.
          </p>
          <p className="font-sans text-[12px] text-ink-4">ElevateNow Insights is the publication arm; elevatenow.tech is the brand home.</p>
        </a>
      </div>
    </section>
  );
}
