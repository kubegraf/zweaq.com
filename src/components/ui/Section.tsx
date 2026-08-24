'use client';

import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';

/**
 * Section shell.
 *
 * Every section is numbered like a page in an engineering document. That is the
 * organising idea of the whole site: this is a technical dossier for a product
 * in development, not a marketing funnel with headings.
 *
 * The shell also owns scroll reveal, so no section wires up its own observer.
 */

export interface SectionProps {
  id: string;
  /** Two-digit index shown in the eyebrow. */
  index?: string;
  eyebrow?: string;
  headline?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Wider than the default measure, for tables and diagrams. */
  wide?: boolean;
  /** Renders the headline block centred. Used sparingly. */
  centered?: boolean;
  as?: 'section' | 'div';
}

export function Section({
  id,
  index,
  eyebrow,
  headline,
  lede,
  children,
  className,
  wide = false,
  centered = false,
}: SectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      // scroll-margin so the sticky nav never covers a section heading.
      className={cn('scroll-mt-[calc(var(--nav-h)+2rem)] py-section', className)}
      aria-labelledby={headline ? `${id}-heading` : undefined}
    >
      <div className={cn('container-z', wide ? 'max-w-none' : undefined)}>
        {(eyebrow || headline || lede) && (
          <header
            className={cn(
              'flex flex-col gap-5',
              centered ? 'items-center text-center' : 'max-w-3xl',
            )}
          >
            {eyebrow && (
              <p data-reveal className="label-z flex items-center gap-3 text-ti-600">
                {index && <span className="text-ti-800">{index}</span>}
                <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            {headline && (
              <h2
                id={`${id}-heading`}
                data-reveal
                style={{ ['--reveal-delay' as string]: '60ms' }}
                className="text-[length:var(--text-display-3)] leading-[1.02] text-paper"
              >
                {headline}
              </h2>
            )}
            {lede && (
              <div
                data-reveal
                style={{ ['--reveal-delay' as string]: '120ms' }}
                className="max-w-2xl text-base leading-relaxed text-ti-400 sm:text-lg"
              >
                {lede}
              </div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Mounts the reveal observer around arbitrary markup.
 *
 * `Section` already does this for anything inside it. Use `RevealRoot` only for
 * sections that need a layout `Section` cannot express — it keeps the client
 * boundary at the wrapper, so the content inside stays a server component.
 */
export function RevealRoot({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}

/** Applies the reveal transition to an arbitrary child. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
      className={className}
    >
      {children}
    </div>
  );
}
