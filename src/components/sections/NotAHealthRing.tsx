import { Section, Reveal } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

/**
 * Positioning against the category, not against a competitor.
 *
 * The health-ring column describes what defines that category — measurement —
 * rather than picking a weak product to beat. Everything a health ring does
 * well is stated as a strength, because it is one.
 */

const COLUMNS = [
  {
    title: 'A health ring',
    role: 'Measures you',
    items: ['Measure', 'Track', 'Report'],
    note: 'Built to observe. It does that well, and ZWEAQ is not claiming otherwise.',
    emphasis: false,
  },
  {
    title: 'ZWEAQ',
    role: 'Interacts with you',
    items: ['Interact', 'Authenticate', 'Store', 'Assist', 'Connect'],
    note: 'Built to be used. Sensing is context for the interaction, not the product.',
    emphasis: true,
  },
];

export function NotAHealthRing() {
  return (
    <Section
      id="not-a-health-ring"
      index="02"
      eyebrow="Category"
      headline="Not another health ring."
      lede={
        <>
          Most smart rings are instruments: they measure you and hand the numbers to an
          app. ZWEAQ is designed as something you operate.
        </>
      }
    >
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {COLUMNS.map((column, i) => (
          <Reveal key={column.title} delay={i * 90}>
            <div
              className={cn(
                'flex h-full flex-col gap-6 rounded-lg border p-6 sm:p-8',
                column.emphasis
                  ? 'border-[var(--line-strong)] bg-ink-raised'
                  : 'border-[var(--line)]',
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="label-z text-ti-600">{column.title}</h3>
                <p
                  className={cn(
                    'text-[length:var(--text-heading)]',
                    column.emphasis ? 'text-paper' : 'text-ti-400',
                  )}
                >
                  {column.role}
                </p>
              </div>

              <ul className="flex flex-col gap-px">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-[var(--line)] py-3 last:border-0"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-1 w-1 shrink-0 rounded-full',
                        column.emphasis ? 'bg-signal' : 'bg-ti-700',
                      )}
                    />
                    <span
                      className={cn(
                        'text-lg',
                        column.emphasis ? 'text-paper' : 'text-ti-400',
                      )}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-auto text-sm leading-relaxed text-ti-600">{column.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
