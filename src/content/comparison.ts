/**
 * Category comparison.
 *
 * Rules this table follows, because the alternative is defaming competitors:
 *   1. Columns are *device categories*, never named products.
 *   2. Every ZWEAQ cell is claim-gated — 'designed' means designed, not shipped.
 *   3. Other categories are described by what defines the category, not by
 *      cherry-picking a weak example.
 */

export type Support = 'core' | 'designed' | 'varies' | 'none';

export const supportMeta: Record<Support, { label: string; symbol: string }> = {
  core: { label: 'Core function', symbol: '●' },
  designed: { label: 'Designed for', symbol: '◐' },
  varies: { label: 'Varies by product', symbol: '○' },
  none: { label: 'Not a function of this category', symbol: '–' },
};

export interface ComparisonColumn {
  id: string;
  label: string;
  emphasis?: boolean;
}

export const comparisonColumns: ComparisonColumn[] = [
  { id: 'zweaq', label: 'ZWEAQ', emphasis: true },
  { id: 'health', label: 'Health ring' },
  { id: 'voice', label: 'Voice AI wearable' },
  { id: 'glasses', label: 'Smart-glass controller' },
];

export interface ComparisonRow {
  feature: string;
  zweaq: Support;
  health: Support;
  voice: Support;
  glasses: Support;
}

export const comparisonRows: ComparisonRow[] = [
  { feature: 'AI interaction',      zweaq: 'designed', health: 'none',   voice: 'core',   glasses: 'varies' },
  { feature: 'On-device display',   zweaq: 'designed', health: 'none',   voice: 'varies', glasses: 'none'   },
  { feature: 'Encrypted storage',   zweaq: 'designed', health: 'none',   voice: 'none',   glasses: 'none'   },
  { feature: 'NFC',                 zweaq: 'designed', health: 'varies', voice: 'none',   glasses: 'none'   },
  { feature: 'Device identity',     zweaq: 'designed', health: 'none',   voice: 'none',   glasses: 'none'   },
  { feature: 'Gesture input',       zweaq: 'designed', health: 'varies', voice: 'varies', glasses: 'core'   },
  { feature: 'Haptic feedback',     zweaq: 'designed', health: 'varies', voice: 'varies', glasses: 'varies' },
  { feature: 'Wellness sensing',    zweaq: 'designed', health: 'core',   voice: 'none',   glasses: 'none'   },
  { feature: 'Works offline',       zweaq: 'designed', health: 'core',   voice: 'none',   glasses: 'varies' },
  { feature: 'Laptop integration',  zweaq: 'designed', health: 'none',   voice: 'none',   glasses: 'none'   },
];

export const comparisonNote =
  'Categories, not products. Individual devices vary widely — “varies by product” means exactly that. ZWEAQ rows read “designed for” because ZWEAQ ONE is in development and none of its functions are production validated.';
