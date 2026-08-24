import { Section, Reveal } from '@/components/ui/Section';
import { roadmap, roadmapDisclaimer, type MilestoneStatus } from '@/content/roadmap';
import { cn } from '@/lib/cn';

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  complete: 'Done',
  'in-progress': 'In progress',
  planned: 'Planned',
};

const STATUS_MARK: Record<MilestoneStatus, string> = {
  complete: '✓',
  'in-progress': '◐',
  planned: '○',
};

export function RoadmapSection() {
  return (
    <Section
      id="roadmap"
      index="21"
      eyebrow="Roadmap"
      headline="What is planned, and when."
      lede="Nothing on this timeline is marked complete, because nothing is."
    >
      <ol className="mt-12 grid gap-4 lg:grid-cols-3">
        {roadmap.map((phase, i) => (
          <li key={phase.year}>
            <Reveal delay={i * 90}>
              <div
                className={cn(
                  'flex h-full flex-col gap-6 rounded-lg border p-6 sm:p-7',
                  phase.status === 'in-progress'
                    ? 'border-[var(--line-strong)] bg-ink-raised'
                    : 'border-[var(--line)]',
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-3xl text-paper">{phase.year}</span>
                  <span className="label-z text-ti-700">{STATUS_LABEL[phase.status]}</span>
                </div>

                <h3 className="text-[length:var(--text-heading)] text-ti-300">
                  {phase.title}
                </h3>

                <ul className="flex flex-col gap-3">
                  {phase.milestones.map((milestone) => (
                    <li key={milestone.label} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-0.5 w-3 shrink-0 text-center text-xs',
                          milestone.status === 'in-progress' ? 'text-signal' : 'text-ti-700',
                        )}
                      >
                        {STATUS_MARK[milestone.status]}
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm text-ti-300">
                          {milestone.label}
                          <span className="sr-only"> — {STATUS_LABEL[milestone.status]}</span>
                        </span>
                        {milestone.expansion ? (
                          <span className="text-xs text-ti-700">{milestone.expansion}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal delay={250}>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ti-600">
          {roadmapDisclaimer}
        </p>
      </Reveal>
    </Section>
  );
}
