/**
 * FAQ. Every answer must place the capability on the claim ladder:
 * planned · prototype · validated · available. An answer that leaves a reader
 * unsure which of those applies is a bug.
 */

import type { ClaimLevel } from './claims';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Where this capability sits today. Rendered as a badge next to the answer. */
  level: ClaimLevel;
  /** Groups the FAQ so 17 questions don't arrive as one wall. */
  group: 'product' | 'capability' | 'commercial' | 'data';
}

export const faqGroups = [
  { id: 'product', label: 'The product' },
  { id: 'capability', label: 'What it does' },
  { id: 'commercial', label: 'Buying it' },
  { id: 'data', label: 'Your data' },
] as const;

export const faq: FaqItem[] = [
  {
    id: 'what-is-zweaq',
    group: 'product',
    level: 'concept',
    question: 'What is ZWEAQ?',
    answer:
      'ZWEAQ ONE is a small computer worn on your finger. It combines AI interaction, encrypted personal storage, a hardware-backed digital identity, NFC, a micro-display, touch and gesture input, haptics and context sensors. The intent is that small interactions — a glance, a confirmation, a tap — stop requiring you to take out a phone.',
  },
  {
    id: 'health-ring',
    group: 'product',
    level: 'concept',
    question: 'Is ZWEAQ a health ring?',
    answer:
      'No. ZWEAQ includes wellness sensors, but sensing is there to give the ring context — not to be the product. A health ring is built to measure you and report. ZWEAQ is built for you to interact with: authenticate, store, ask, tap, confirm. ZWEAQ is not a medical device and makes no medical claims.',
  },
  {
    id: 'storage',
    group: 'capability',
    level: 'concept',
    question: 'How much storage does it have?',
    answer:
      'The target is 32 GB of encrypted, user-accessible storage. That figure is a design target for hardware that has not yet been built, so treat it as a target and not a specification. We will publish the measured figure once we have engineering builds to measure.',
  },
  {
    id: 'laptop',
    group: 'capability',
    level: 'concept',
    question: 'Can I connect it to a laptop?',
    answer:
      'That is the design intent, over Bluetooth LE for control and identity, and over the planned ZWEAQ Dock for bulk data. Compatibility will be published per platform as it is validated. We are not claiming universal compatibility.',
  },
  {
    id: 'transfer',
    group: 'capability',
    level: 'concept',
    question: 'Can I transfer files?',
    answer:
      'Yes, that is what the vault is for — but be realistic about speed. Bluetooth LE is appropriate for documents, notes, credentials and keys, not for moving gigabytes. Fast bulk transfer is a planned function of the ZWEAQ Dock, which is a later accessory and is not production validated.',
  },
  {
    id: 'offline',
    group: 'capability',
    level: 'concept',
    question: 'Does it work without internet?',
    answer:
      'The parts that live on the ring are designed to keep working with no connection: time, stored credentials, vault contents already on the device, selected reminders and sensor logging. Anything that needs a model or a service — a new AI request, cloud backup — needs a connection. When you reconnect, the ring syncs.',
  },
  {
    id: 'ai',
    group: 'capability',
    level: 'concept',
    question: 'Does it use AI?',
    answer:
      'Yes, as an interaction layer. You hold the ring, make a request, and get back a short confirmation on the display plus a haptic pulse. The ring is the input and the acknowledgement.',
  },
  {
    id: 'local-llm',
    group: 'capability',
    level: 'concept',
    question: 'Does the ring run AI locally?',
    answer:
      'No, and we will not claim otherwise. A device this size does not have the power or thermal budget to run a large language model. Small on-device models handle things like gesture and wake detection. Anything larger runs on your phone or a connected device, and the ring handles capture, confirmation and display.',
  },
  {
    id: 'nfc',
    group: 'capability',
    level: 'concept',
    question: 'Does it support NFC?',
    answer:
      'NFC is part of the hardware design, in both reader and card-emulation modes, for pairing, access credentials and digital cards. The antenna is designed into the band.',
  },
  {
    id: 'payments',
    group: 'capability',
    level: 'concept',
    question: 'Can it make payments?',
    answer:
      'No. ZWEAQ is designed for future payment and credential integrations, but payment functionality requires certification with payment networks and issuers that we have not completed. We will not describe ZWEAQ as a payment device until that work is done and certified.',
  },
  {
    id: 'battery',
    group: 'capability',
    level: 'concept',
    question: 'How long does the battery last?',
    answer:
      'The target is up to 7 days of mixed use, with the display off between glances. That is a design target, not a measured result. Real battery life depends on how often the display wakes, how much you use NFC and how frequently sensors sample.',
  },
  {
    id: 'waterproof',
    group: 'capability',
    level: 'concept',
    question: 'Is it waterproof?',
    answer:
      'The design target is 5 ATM water resistance. It is not certified, because there is no production hardware to certify. We will publish the rating once it has been tested by an accredited lab.',
  },
  {
    id: 'phones',
    group: 'capability',
    level: 'concept',
    question: 'What phones are supported?',
    answer:
      'iOS and Android are both in scope, over Bluetooth LE. Minimum OS versions will be published when the companion app enters beta. Some capabilities depend on platform APIs that differ between iOS and Android, and we will document those differences rather than paper over them.',
  },
  {
    id: 'ship',
    group: 'commercial',
    level: 'concept',
    question: 'When will ZWEAQ ship?',
    answer:
      'The plan targets first customer shipments in 2028, following prototype and validation work through 2027. These are planned targets for a hardware product in development, not commitments — hardware schedules move, and we will publish revisions rather than quietly changing the dates.',
  },
  {
    id: 'price',
    group: 'commercial',
    level: 'concept',
    question: 'How much will it cost?',
    answer:
      'The indicative target is from £199 for ZWEAQ ONE, with HEALTH and PRO variants above that. These are target price bands used for planning, not retail prices. Final pricing depends on the bill of materials, certification and manufacturing volume.',
  },
  {
    id: 'subscription',
    group: 'commercial',
    level: 'concept',
    question: 'Is there a subscription?',
    answer:
      'The ring works without one. Time, display, vault access, stored credentials, identity, NFC, gestures, haptics and on-device sensing are hardware functions and stay hardware functions. ZWEAQ Plus is planned as an optional service for things that genuinely cost money to run — cloud backup, cross-device sync, longer AI memory. We are not putting basic ring functionality behind a subscription.',
  },
  {
    id: 'data-protection',
    group: 'data',
    level: 'concept',
    question: 'How is my data protected?',
    answer:
      'The architecture is designed around hardware-backed security: keys generated in and never leaving a secure element, vault contents encrypted before they are written, verified boot, and signed firmware updates. We have not completed third-party security certification, so we describe the design rather than claiming a certification we do not hold. Nothing is unhackable, and any company that tells you otherwise is selling something.',
  },
];
