/**
 * ZWEAQ ONE product configuration.
 *
 * Every number here is a `Claim`, not a string. That is not ceremony — it is
 * the mechanism that stops the site printing "32 GB" as though it were a fact
 * about hardware that has not been built. See src/content/claims.ts.
 */

import { type Claim, target, prototyped } from './claims';

export interface Variant {
  id: string;
  name: string;
  positioning: string;
  /** Indicative target price band. Not a retail price. */
  priceFrom: number;
  priceTo: number;
  features: string[];
  status: 'planned' | 'in-development';
  emphasis?: boolean;
}

export interface SensorSpec {
  id: string;
  name: string;
  expansion: string;
  purpose: string;
  claim: Claim;
}

export const productConfig = {
  name: 'ZWEAQ ONE',
  category: 'Wearable personal computer',

  /** Headline specifications. All claim-gated. */
  specs: {
    storage: target('32 GB', 'Encrypted user-accessible capacity'),
    battery: target('up to 7 days', 'Mixed use, display off between glances'),
    display: target('0.28 in monochrome micro-display', 'Always-off by default'),
    weight: target('under 5 g', 'Size 10, titanium body'),
    waterResistance: target('5 ATM', 'Target rating, not yet certified'),
    connectivity: prototyped('Bluetooth LE 5.4', 'Bench-validated radio stack'),
    nfc: target('ISO/IEC 14443 Type A/B', 'Reader and card-emulation modes'),
    secureElement: target('Certified secure element', 'Vendor selection in progress'),
    materials: target('Grade 5 titanium, ceramic inner band'),
    sizes: target('US 6 – 13', 'Sizing kit shipped before production'),
  } satisfies Record<string, Claim>,

  /**
   * Interaction modes. These drive the hero, the interactive demo, and the
   * ring display everywhere on the site — one list, one source of truth.
   */
  modes: [
    {
      id: 'ai',
      label: 'AI',
      display: 'ASK',
      headline: 'AI, one tap away.',
      blurb:
        'Hold to ask. The ring captures the request and hands it to your phone or a connected device, then shows you the part of the answer that fits on your finger.',
    },
    {
      id: 'vault',
      label: 'Vault',
      display: 'SAVED',
      headline: 'Storage that stays with you.',
      blurb:
        'Encrypted personal storage on the ring itself. Files are encrypted before they are written, with keys held in the secure element.',
    },
    {
      id: 'id',
      label: 'Identity',
      display: 'VERIFY',
      headline: 'A key you wear.',
      blurb:
        'A hardware-backed credential you cannot leave on a desk. Designed to authenticate to compatible devices and services with a deliberate physical confirmation.',
    },
    {
      id: 'nfc',
      label: 'NFC',
      display: 'TAP',
      headline: 'Tap into the physical world.',
      blurb:
        'Pair a device, open a door, hand over a digital card. Designed for future payment and credential integrations.',
    },
    {
      id: 'display',
      label: 'Display',
      display: 'B42',
      headline: 'A screen that knows when to stay quiet.',
      blurb:
        'A micro-display that is off almost all of the time. It shows the one thing you need, then goes dark again.',
    },
    {
      id: 'health',
      label: 'Sensors',
      display: '72 BPM',
      headline: 'Aware, not intrusive.',
      blurb:
        'Motion and wellness sensing for context, not diagnosis. ZWEAQ is not a medical device and makes no medical claims.',
    },
  ] as const,

  sensors: [
    {
      id: 'imu',
      name: 'IMU',
      expansion: 'Inertial measurement unit',
      purpose: 'Gesture recognition, orientation, activity and step context.',
      claim: target('6-axis accelerometer + gyroscope'),
    },
    {
      id: 'ppg',
      name: 'PPG',
      expansion: 'Photoplethysmography',
      purpose: 'Pulse and wellness trends. Not a diagnostic instrument.',
      claim: target('Multi-wavelength optical sensor'),
    },
    {
      id: 'temp',
      name: 'Skin temperature',
      expansion: 'Thermistor array',
      purpose: 'Relative temperature trend over time.',
      claim: target('±0.1 °C relative resolution'),
    },
    {
      id: 'cap',
      name: 'Capacitive touch',
      expansion: 'Touch and wear detection',
      purpose: 'Tap, double-tap, hold and swipe input. On-finger detection.',
      claim: prototyped('Segmented capacitive ring'),
    },
  ] satisfies SensorSpec[],

  /** Physical layers, outer to inner. Drives the exploded-view diagram. */
  layers: [
    { id: 'display', name: 'Micro-display', note: 'Monochrome, always-off by default' },
    { id: 'touch', name: 'Capacitive touch ring', note: 'Segmented input surface' },
    { id: 'mcu', name: 'MCU', note: 'Low-power application processor' },
    { id: 'storage', name: 'Encrypted storage', note: 'Vault partition' },
    { id: 'se', name: 'Secure element', note: 'Key storage and device identity' },
    { id: 'nfc', name: 'NFC front-end', note: 'Antenna wrapped in the band' },
    { id: 'sensors', name: 'Sensor stack', note: 'IMU, PPG, temperature' },
    { id: 'haptic', name: 'Haptic actuator', note: 'Silent confirmation' },
    { id: 'battery', name: 'Battery', note: 'Curved cell, wireless charge only' },
  ],

  variants: [
    {
      id: 'one',
      name: 'ZWEAQ ONE',
      positioning: 'The full platform. AI, vault, identity, display, NFC, sensors.',
      priceFrom: 199,
      priceTo: 249,
      features: ['AI interaction', 'Encrypted vault', 'Device identity', 'Micro-display', 'NFC', 'Motion and wellness sensing'],
      status: 'in-development',
      emphasis: true,
    },
    {
      id: 'health',
      name: 'ZWEAQ HEALTH',
      positioning: 'ONE, plus an expanded wellness sensing stack.',
      priceFrom: 249,
      priceTo: 299,
      features: ['Everything in ONE', 'Extended optical sensing', 'Continuous temperature trend', 'Longer on-device sensor history'],
      status: 'planned',
    },
    {
      id: 'pro',
      name: 'ZWEAQ PRO',
      positioning: 'Advanced identity, enterprise management and developer access.',
      priceFrom: 299,
      priceTo: 399,
      features: ['Everything in ONE', 'Advanced identity profiles', 'Enterprise provisioning', 'Developer APIs', 'Extended vault capacity'],
      status: 'planned',
    },
  ] satisfies Variant[],
} as const;

export type ProductMode = (typeof productConfig.modes)[number];
export type ProductModeId = ProductMode['id'];
