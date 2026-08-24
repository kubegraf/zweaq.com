import { cn } from '@/lib/cn';

/**
 * A ring micro-display readout, out of context.
 *
 * Used throughout the page so the same visual object keeps appearing at
 * different scales — it is the cheapest way to make twenty sections feel like
 * one product rather than twenty feature blocks.
 */
export function DisplayChip({
  children,
  tone = 'default',
  size = 'md',
  className,
}: {
  children: React.ReactNode;
  tone?: 'default' | 'verify';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[0.3rem] border font-mono tabular-nums',
        'bg-[#070b10] shadow-[inset_0_1px_0_rgba(223,243,255,0.06)]',
        tone === 'verify'
          ? 'border-verify/25 text-verify'
          : 'border-[var(--line-strong)] text-display',
        size === 'sm' && 'px-2 py-1 text-[0.7rem] tracking-[0.1em]',
        size === 'md' && 'px-3 py-1.5 text-sm tracking-[0.12em]',
        size === 'lg' && 'px-4 py-2.5 text-base tracking-[0.14em] sm:text-lg',
        className,
      )}
    >
      {children}
    </span>
  );
}
