'use client';

import { useState } from 'react';
import { Section, Reveal } from '@/components/ui/Section';
import { productConfig } from '@/content/product';
import { cn } from '@/lib/cn';

/**
 * The exploded view.
 *
 * Layers separate on hover and on focus, and the whole stack is a list of
 * buttons — so this works with a keyboard, and the separation is a progressive
 * enhancement rather than the only way to read the diagram.
 */
export function TechnologySection() {
  const [active, setActive] = useState<string | null>(null);
  const layers = productConfig.layers;

  return (
    <Section
      id="technology"
      index="16"
      eyebrow="Engineering"
      headline={
        <>
          Small enough to wear.
          <br />
          Complex enough to matter.
        </>
      }
      lede="Nine functional layers inside a band a few millimetres thick. The hard part of this product is not the software."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <Reveal>
          <ul
            className="flex flex-col gap-1.5"
            onMouseLeave={() => setActive(null)}
          >
            {layers.map((layer, i) => {
              const isActive = active === layer.id;
              return (
                <li key={layer.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(layer.id)}
                    onFocus={() => setActive(layer.id)}
                    onBlur={() => setActive(null)}
                    aria-pressed={isActive}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-4 rounded-md border px-4 py-3 text-left',
                      'transition-[transform,border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]',
                      isActive
                        ? 'border-signal/35 bg-signal/[0.06] sm:translate-x-2'
                        : 'border-[var(--line)] bg-ink-raised',
                    )}
                  >
                    <span className="label-z w-6 shrink-0 text-ti-800">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-paper">{layer.name}</span>
                      <span className="text-xs text-ti-600">{layer.note}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex h-full flex-col justify-center gap-8">
            {/* Cross-section: each layer as a band through the ring wall. */}
            <div
              className="flex flex-col gap-1 rounded-lg border border-[var(--line)] bg-ink-inset p-5"
              role="img"
              aria-label={`Cross-section of the ZWEAQ ONE band, from the outer surface inward: ${layers.map((l) => l.name).join(', ')}`}
            >
              {layers.map((layer, i) => {
                const isActive = active === layer.id;
                return (
                  <div
                    key={layer.id}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-[3px] px-3 transition-all duration-[var(--duration-medium)] ease-[var(--ease-out)]',
                      isActive ? 'bg-signal/15' : 'bg-ti-900/70',
                    )}
                    style={{
                      // Outer layers are physically thinner than the battery.
                      height: `${layer.id === 'battery' ? 34 : layer.id === 'mcu' ? 26 : 18}px`,
                      marginLeft: isActive ? '0.75rem' : 0,
                      marginRight: isActive ? '0.75rem' : 0,
                      opacity: active && !isActive ? 0.45 : 1,
                    }}
                  >
                    <span
                      className={cn(
                        'label-z truncate',
                        isActive ? 'text-signal' : 'text-ti-600',
                      )}
                    >
                      {layer.name}
                    </span>
                    <span className="label-z shrink-0 text-ti-800">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-sm leading-relaxed text-ti-600">
              Layer order and relative thickness are illustrative of the architecture.
              Physical stack-up is an engineering problem we have not finished solving,
              and this diagram is not a manufacturing drawing.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
