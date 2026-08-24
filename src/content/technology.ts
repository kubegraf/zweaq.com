/**
 * Technology page content.
 *
 * Written to be readable by an engineer without insulting them, and by an
 * investor without misleading them. Where something is unresolved, it says so —
 * an architecture page that claims every decision is settled two years before
 * EVT is not a credible architecture page.
 */

export interface ArchitectureBlock {
  id: string;
  title: string;
  summary: string;
  points: { label: string; detail: string }[];
  open?: string;
}

export const architecture: ArchitectureBlock[] = [
  {
    id: 'hardware',
    title: 'Hardware',
    summary:
      'A low-power application MCU, a certified secure element, encrypted flash, a monochrome micro-display, a segmented capacitive band, an NFC front-end with the antenna wound into the ring, a sensor stack and a haptic actuator — around a curved cell.',
    points: [
      { label: 'Processor', detail: 'Low-power MCU chosen for deep-sleep current, not benchmark scores. The ring is asleep almost all of the time and that is the number that decides battery life.' },
      { label: 'Secure element', detail: 'A separate certified part, not a software enclave on the application processor. Vendor selection is in progress.' },
      { label: 'Antenna', detail: 'The NFC coil is wound into the band. This constrains the metal choice more than the aesthetics do.' },
      { label: 'Power', detail: 'Wireless charging only. No port means no ingress path and no connector to fatigue.' },
    ],
    open: 'Antenna performance in a titanium body is the single hardest open problem in this design. It is why the inner band is ceramic.',
  },
  {
    id: 'firmware',
    title: 'Firmware',
    summary:
      'A small real-time core that owns power, radio and sensors, and an application layer above it that owns interaction. Verified boot at every stage, and updates that must be signed to be applied.',
    points: [
      { label: 'Boot', detail: 'Each stage verifies the next before handing over. A ring that cannot verify its own firmware is designed to refuse to run it.' },
      { label: 'Updates', detail: 'Signed, delivered over the companion app, applied atomically with a rollback path.' },
      { label: 'Power management', detail: 'Aggressive duty cycling. The display is off by default; sensors sample on a schedule, not continuously.' },
    ],
  },
  {
    id: 'security',
    title: 'Security architecture',
    summary:
      'Keys are generated inside the secure element and designed never to leave it. Vault contents are encrypted before they are written to flash. Every ring has its own identity.',
    points: [
      { label: 'Key custody', detail: 'Generated on device, held in the secure element, never transmitted.' },
      { label: 'At rest', detail: 'Vault encryption happens before the write, so flash never sees plaintext.' },
      { label: 'Revocation', detail: 'A lost ring’s credentials can be revoked from a paired device without the ring being present.' },
    ],
    open: 'We hold no third-party security certification. There is no production hardware to certify. This is architecture, not audit.',
  },
  {
    id: 'storage',
    title: 'Storage',
    summary:
      'An encrypted vault partition with a filesystem designed for a device that can lose power at any moment, because a ring can.',
    points: [
      { label: 'Integrity', detail: 'Power-loss-safe writes. Interrupting a transfer should cost you the transfer, not the vault.' },
      { label: 'Sync', detail: 'Reconciliation on reconnect, with the ring as a first-class replica rather than a cache.' },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    summary:
      'The ring captures a request, hands it to a device that can actually compute, and renders the confirmation. Small on-device models handle wake and gesture detection only.',
    points: [
      { label: 'On device', detail: 'Wake detection and gesture classification. Small, fixed-function models.' },
      { label: 'Off device', detail: 'Anything involving a language model. Routed through your phone or a connected device.' },
      { label: 'What comes back', detail: 'A short confirmation and a haptic pulse. Not a paragraph on a 0.28in screen.' },
    ],
    open: 'Which requests can be answered without leaving your own devices is an open design question, and the answer materially affects privacy.',
  },
  {
    id: 'connectivity',
    title: 'Connectivity',
    summary:
      'Bluetooth LE for control, identity and document-scale transfer. NFC for proximity. A planned dock for anything bulk.',
    points: [
      { label: 'Bluetooth LE', detail: 'The right radio for a coin-cell power budget, and the wrong one for gigabytes.' },
      { label: 'NFC', detail: 'Reader and card-emulation modes, on existing standards.' },
      { label: 'Bulk', detail: 'A dock function. Not something we will claim Bluetooth LE can do.' },
    ],
  },
];

export const powerBudget = [
  { state: 'Deep sleep', share: 'Most of the day', note: 'Radio idle, display off, sensors on a schedule' },
  { state: 'Glance', share: 'Seconds at a time', note: 'Display on, MCU awake' },
  { state: 'Interaction', share: 'Rare', note: 'Radio active, haptic firing, display on' },
  { state: 'NFC', share: 'Rare', note: 'Field-powered where the reader supplies it' },
];
