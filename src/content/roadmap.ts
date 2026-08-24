/**
 * Roadmap. Every entry is a planned target — `status` never claims a milestone
 * has been reached unless it actually has. Nothing here is marked 'complete'.
 */

export type MilestoneStatus = 'complete' | 'in-progress' | 'planned';

export interface RoadmapPhase {
  year: string;
  title: string;
  status: MilestoneStatus;
  milestones: { label: string; expansion?: string; status: MilestoneStatus }[];
}

export const roadmap: RoadmapPhase[] = [
  {
    year: '2026',
    title: 'Concept and engineering',
    status: 'in-progress',
    milestones: [
      { label: 'Product definition', status: 'in-progress' },
      { label: 'Industrial design', status: 'in-progress' },
      { label: 'Bench prototypes', expansion: 'Radio, NFC and sensor stacks on breadboard hardware', status: 'in-progress' },
      { label: 'Security architecture', status: 'planned' },
    ],
  },
  {
    year: '2027',
    title: 'Prototype and validation',
    status: 'planned',
    milestones: [
      { label: 'Ring-form prototype', status: 'planned' },
      { label: 'Developer program', status: 'planned' },
      { label: 'EVT', expansion: 'Engineering validation test', status: 'planned' },
      { label: 'DVT', expansion: 'Design validation test', status: 'planned' },
    ],
  },
  {
    year: '2028',
    title: 'Production and launch',
    status: 'planned',
    milestones: [
      { label: 'PVT and production tooling', expansion: 'Production validation test', status: 'planned' },
      { label: 'Certification', expansion: 'Radio, safety and market approvals', status: 'planned' },
      { label: 'First customer shipments', status: 'planned' },
      { label: 'Developer platform', status: 'planned' },
    ],
  },
];

/** Dates are planned targets, and the UI says so wherever the roadmap appears. */
export const roadmapDisclaimer =
  'Dates are planned targets for a product in development, not commitments. Hardware schedules move. We will publish revisions here rather than quietly changing them.';
