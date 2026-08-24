'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductViewer } from '@/components/product/ProductViewer';
import { Section } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { productConfig, type ProductModeId } from '@/content/product';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

/**
 * "See what ZWEAQ can do."
 *
 * A real tablist — arrow keys move between tabs, Home and End jump to the ends,
 * and the panel is associated with its tab. Roving tabindex, so the whole
 * control is one tab stop rather than six.
 *
 * This is the one place on the page where Framer Motion earns its weight:
 * switching modes needs an interruptible cross-fade that survives being
 * changed mid-flight, which a CSS transition on a keyed element cannot do.
 */
export function InteractiveDemo() {
  const modes = productConfig.modes;
  const [active, setActive] = useState<ProductModeId>(modes[0].id);
  const reduced = usePrefersReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const index = modes.findIndex((m) => m.id === active);
  const mode = modes[index] ?? modes[0];

  const select = (next: ProductModeId) => {
    setActive(next);
    track({ name: 'demo_mode_change', mode: next });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = modes.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;

    if (next === null) return;
    event.preventDefault();
    const target = modes[next];
    if (!target) return;
    select(target.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section
      id="demo"
      index="01"
      eyebrow="Interaction"
      headline="See what ZWEAQ can do."
      lede="Six things the ring is designed to handle without you taking out a phone. Pick one."
    >
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
        <div className="order-2 flex flex-col gap-8 lg:order-1">
          <div
            role="tablist"
            aria-label="ZWEAQ capabilities"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-2"
          >
            {modes.map((m, i) => {
              const selected = m.id === active;
              return (
                <button
                  key={m.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`demo-tab-${m.id}`}
                  aria-selected={selected}
                  aria-controls={`demo-panel-${m.id}`}
                  // Roving tabindex: one tab stop for the whole control.
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(m.id)}
                  className={cn(
                    'label-z h-11 cursor-pointer rounded-full border px-4 transition-colors duration-[var(--duration-fast)]',
                    selected
                      ? 'border-paper bg-paper text-ink'
                      : 'border-[var(--line-strong)] text-ti-400 hover:border-ti-600 hover:text-paper',
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`demo-panel-${mode.id}`}
            aria-labelledby={`demo-tab-${mode.id}`}
            tabIndex={0}
            className="min-h-[10rem] rounded-lg"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode.id}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <DisplayChip size="lg">{mode.display}</DisplayChip>
                  <span className="label-z text-ti-700">on the ring</span>
                </div>
                <h3 className="text-[length:var(--text-heading)] text-paper">
                  {mode.headline}
                </h3>
                <p className="max-w-lg leading-relaxed text-ti-400">{mode.blurb}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]">
            <ProductViewer
              title={`ZWEAQ ONE concept render, ${mode.label} mode. The display reads ${mode.display}.`}
              displayText={mode.display}
              className="w-full drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
