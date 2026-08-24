import type { ReactNode } from 'react';
import { Reveal, RevealRoot } from '@/components/ui/Section';

export function PageHeader({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <RevealRoot className="border-b border-[var(--line)] py-section" labelledBy="page-title">
      <div className="container-z grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
        <div className="flex flex-col gap-6">
          <Reveal>
            <p className="label-z flex items-center gap-3 text-ti-600">
              <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1
              id="page-title"
              className="text-[length:var(--text-display-2)] leading-[1.02] tracking-[-0.04em] text-paper"
            >
              {title}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="max-w-2xl text-base leading-relaxed text-ti-400 sm:text-lg">
              {lede}
            </div>
          </Reveal>
        </div>
        {aside ? <Reveal delay={180}>{aside}</Reveal> : null}
      </div>
    </RevealRoot>
  );
}
