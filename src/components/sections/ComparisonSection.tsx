import { Section, Reveal } from '@/components/ui/Section';
import {
  comparisonColumns,
  comparisonRows,
  comparisonNote,
  supportMeta,
  type Support,
} from '@/content/comparison';
import { cn } from '@/lib/cn';

/**
 * Category comparison.
 *
 * Every cell carries a symbol AND a text label — never a bare tick that means
 * something different depending on which column it is in, and never colour as
 * the only difference between two states.
 */
function Cell({ support, emphasis }: { support: Support; emphasis?: boolean }) {
  const meta = supportMeta[support];
  return (
    <td className="border-t border-[var(--line)] px-3 py-4 align-middle sm:px-4">
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'text-sm',
            support === 'core' && (emphasis ? 'text-signal' : 'text-ti-300'),
            support === 'designed' && 'text-signal',
            support === 'varies' && 'text-ti-600',
            support === 'none' && 'text-ti-800',
          )}
        >
          {meta.symbol}
        </span>
        <span
          className={cn(
            'text-xs leading-tight',
            support === 'none' ? 'text-ti-700' : 'text-ti-400',
          )}
        >
          {meta.label}
        </span>
      </span>
    </td>
  );
}

export function ComparisonSection() {
  return (
    <Section
      id="comparison"
      index="19"
      eyebrow="Comparison"
      headline="Where ZWEAQ sits."
      lede="Categories, not products — because the point is that ZWEAQ is not competing inside an existing category."
      wide
    >
      <Reveal>
        <div className="mt-12 -mx-[var(--spacing-gutter)] overflow-x-auto px-[var(--spacing-gutter)]">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              ZWEAQ compared with health rings, voice AI wearables and smart-glass
              controllers, by feature
            </caption>
            <thead>
              <tr>
                <th scope="col" className="label-z py-3 pr-4 text-ti-600">Feature</th>
                {comparisonColumns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      'label-z px-3 py-3 sm:px-4',
                      col.emphasis ? 'text-paper' : 'text-ti-600',
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <th
                    scope="row"
                    className="border-t border-[var(--line)] py-4 pr-4 text-left font-normal text-paper"
                  >
                    {row.feature}
                  </th>
                  <Cell support={row.zweaq} emphasis />
                  <Cell support={row.health} />
                  <Cell support={row.voice} />
                  <Cell support={row.glasses} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ti-600">{comparisonNote}</p>
      </Reveal>
    </Section>
  );
}
