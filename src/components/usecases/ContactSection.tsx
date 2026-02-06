import { motion } from 'framer-motion';
import { Mail, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ContactSection() {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 px-6 ${isDark ? 'bg-en-navy-light' : 'bg-lt-bg-secondary'}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-[3px] uppercase mb-4 text-en-blue">
            Ready to Transform Your Operations?
          </p>
          <h2 className={`font-display text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-en-white' : 'text-lt-text'
          }`}>
            Let's Discuss Your Use Case
          </h2>
          <p className={`text-lg mb-10 max-w-2xl mx-auto ${
            isDark ? 'text-en-muted' : 'text-lt-text-secondary'
          }`}>
            ElevateNow's agentic AI platform is designed to solve complex insurance challenges
            with governance-first architecture. Schedule a conversation with our team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:gps@elevatenow.tech"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-en-blue text-white font-semibold hover:bg-en-blue-light transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Mail size={20} />
              Get in Touch
            </a>
            <a
              href="https://calendly.com/elevatenow"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-white/10 text-en-white border border-en-border hover:bg-white/15'
                  : 'bg-white text-lt-text border-2 border-lt-border hover:bg-lt-bg-tertiary'
              }`}
            >
              <Calendar size={20} />
              Schedule Demo
            </a>
          </div>

          <p className={`text-xs mt-8 ${isDark ? 'text-en-muted' : 'text-lt-text-muted'}`}>
            Trusted by leading insurance carriers and technology partners
          </p>
        </motion.div>
      </div>
    </section>
  );
}
