import type { UseCaseStatus } from '../../types/usecase';

interface StatusIndicatorProps {
  status: UseCaseStatus;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Coming Soon
    </span>
  );
}
