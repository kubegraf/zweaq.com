import { productConfig } from './product';

export interface ServiceTier {
  id: string;
  name: string;
  price: string;
  cadence?: string;
  summary: string;
  includes: string[];
  note?: string;
}

export const pricing = {
  hardware: productConfig.variants,

  /**
   * Everything the ring does on its own is a hardware function and stays one.
   * This list is deliberately short.
   */
  hardwareAlwaysIncluded: [
    'Time and display',
    'Vault access on the device',
    'Stored credentials and identity',
    'NFC',
    'Gestures and haptics',
    'On-device sensing',
  ],

  services: [
    {
      id: 'included',
      name: 'ZWEAQ Core',
      price: 'Included',
      summary: 'Everything the ring does on its own, with no account required.',
      includes: [
        'All on-device functions',
        'Companion app',
        'Local pairing and sync',
        'Firmware updates',
      ],
    },
    {
      id: 'plus',
      name: 'ZWEAQ Plus',
      price: 'Planned',
      cadence: 'optional',
      summary:
        'Optional services that cost money to run. Never required to use the ring.',
      includes: [
        'AI request routing',
        'Encrypted cloud backup',
        'Cross-device sync',
        'Extended AI memory',
        'Automation and rules',
      ],
      note: 'Pricing not set. ZWEAQ Plus will not gate any hardware function.',
    },
  ] satisfies ServiceTier[],

  disclaimer:
    'Prices are indicative target bands for planning, not retail prices. Final pricing depends on bill of materials, certification and manufacturing volume.',
} as const;
