import { Section, Reveal } from '@/components/ui/Section';
import { productConfig } from '@/content/product';
import { pricing } from '@/content/pricing';
import { cn } from '@/lib/cn';

export function VariantsSection() {
  return (
    <Section
      id="variants"
      index="17"
      eyebrow="Range"
      headline="Three rings, one platform."
      lede="Every variant runs the same platform. The differences are in sensing and identity, not in artificially withheld software."
    >
      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        {productConfig.variants.map((variant, i) => (
          <li key={variant.id}>
            <Reveal delay={i * 80}>
              <article
                className={cn(
                  'flex h-full flex-col gap-6 rounded-lg border p-6 sm:p-7',
                  variant.emphasis
                    ? 'border-[var(--line-strong)] bg-ink-raised'
                    : 'border-[var(--line)]',
                )}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[length:var(--text-heading)] text-paper">
                      {variant.name}
                    </h3>
                    <span className="label-z shrink-0 rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
                      {variant.status === 'in-development' ? 'In development' : 'Planned'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ti-500">{variant.positioning}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="label-z text-ti-700">Indicative target</span>
                  <span className="font-mono text-2xl text-paper">
                    £{variant.priceFrom}
                    <span className="text-ti-600">–£{variant.priceTo}</span>
                  </span>
                </div>

                <ul className="mt-auto flex flex-col gap-2.5">
                  {variant.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ti-400">
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ti-700" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={200}>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ti-600">
          {pricing.disclaimer}
        </p>
      </Reveal>
    </Section>
  );
}
