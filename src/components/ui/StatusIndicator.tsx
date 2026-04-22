import type { UseCaseStatus } from '../../types/usecase';

interface StatusIndicatorProps {
  status: UseCaseStatus;
}

/**
 * Editorial status chip — mono, no color fills. Uses the single accent
 * only for the published dot.
 */
export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-4">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-5" />
      Coming soon
    </span>
  );
}
