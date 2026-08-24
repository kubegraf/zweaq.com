import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Panel({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  return <Tag className={cn('panel-z p-6 sm:p-7', className)}>{children}</Tag>;
}

/** A labelled node in a technical flow diagram. */
export function FlowNode({
  label,
  caption,
  emphasis = false,
  className,
}: {
  label: string;
  caption?: string;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-md border px-4 py-3 text-center',
        emphasis
          ? 'border-signal/35 bg-signal/[0.06]'
          : 'border-[var(--line)] bg-ink-raised',
        className,
      )}
    >
      <span className="label-z text-paper">{label}</span>
      {caption ? <span className="text-xs text-ti-600">{caption}</span> : null}
    </div>
  );
}

/**
 * The connector between flow nodes. Rotates to vertical on narrow screens,
 * where these diagrams stack.
 */
export function FlowArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex items-center justify-center text-ti-700', className)}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-90 sm:rotate-0">
        <path
          d="M4 12h14M13 7l5 5-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
