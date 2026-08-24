import { CLAIM_META, type ClaimLevel } from '@/content/claims';
import { cn } from '@/lib/cn';

/**
 * Marks how much is actually known about a capability.
 *
 * The badge carries a text label, never colour alone, and its `title` gives the
 * full definition — so the meaning is available to a screen reader, to someone
 * who cannot distinguish the colours, and to anyone who hovers it.
 */

const tone: Record<ClaimLevel, string> = {
  concept: 'border-ti-800 text-ti-500',
  prototype: 'border-ti-700 text-ti-400',
  engineering: 'border-signal/40 text-signal',
  production: 'border-verify/40 text-verify',
  available: 'border-verify/60 text-verify',
};

export function ClaimBadge({
  level,
  className,
}: {
  level: ClaimLevel;
  className?: string;
}) {
  const meta = CLAIM_META[level];
  return (
    <span
      className={cn(
        'label-z inline-flex shrink-0 items-center rounded-full border px-2.5 py-1',
        tone[level],
        className,
      )}
      title={meta.definition}
    >
      {meta.label}
    </span>
  );
}
