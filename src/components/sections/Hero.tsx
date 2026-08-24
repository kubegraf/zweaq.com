'use client';

import { useState } from 'react';
import { ProductViewer } from '@/components/product/ProductViewer';
import { useRingInteraction, type RingFrame } from '@/components/product/useRingInteraction';
import { ButtonLink } from '@/components/ui/Button';
import { track } from '@/lib/analytics';

/**
 * Hero.
 *
 * The job is to make the category legible in about five seconds: a name, one
 * sentence, and an object you can immediately touch. Everything else on the
 * page is elaboration.
 *
 * The ring is a real control, not a decoration — it is a button, it is
 * keyboard-operable, and what it currently shows is announced politely rather
 * than silently animated at people using a screen reader.
 */

/** Glanceable states, in the order a day might actually produce them. */
const FRAMES: RingFrame[] = [
  { text: '12:30', meaning: 'The time' },
  { text: 'OTP 583921', meaning: 'A one-time passcode' },
  { text: 'GATE B42', meaning: 'A boarding gate' },
  { text: '£18.40', meaning: 'A payment amount' },
  { text: '✓ SAVED', meaning: 'A file saved to the vault' },
  { text: 'AI READY', meaning: 'Ready to take a request' },
];

export function Hero() {
  const { containerRef, onPointerMove, onPointerLeave, advance, state } =
    useRingInteraction(FRAMES);
  const [announce, setAnnounce] = useState('');

  const handleActivate = (via: 'click' | 'keyboard') => {
    advance();
    const next = FRAMES[(state.index + 1) % FRAMES.length];
    setAnnounce(next ? `Display shows ${next.text}. ${next.meaning}.` : '');
    track({ name: 'hero_interaction', mode: next?.text ?? '', via });
  };

  return (
    <section
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Substrate. Static, GPU-cheap, and clipped by the section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid-z opacity-[0.55]"
      />

      {/*
        A three-cell grid rather than two columns, so the product can sit
        between the headline and the call to action on a phone. Stacking the
        whole text column above the ring pushes a £200–£400 object below the
        fold, which is the one thing a hardware hero cannot do.
      */}
      <div className="container-z grid gap-x-8 gap-y-8 pb-16 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-y-6 lg:pb-24 lg:pt-16">
        <div className="flex flex-col gap-5 lg:col-start-1 lg:row-start-1">
          <p className="label-z flex items-center gap-3 text-ti-600">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            Wearable personal computer
          </p>

          <h1
            id="hero-heading"
            className="text-[length:var(--text-display-1)] font-medium leading-[0.94] tracking-[-0.045em]"
          >
            <span className="block text-paper">The personal</span>
            <span className="block text-paper">computer</span>
            <span className="metal-text">you wear.</span>
          </h1>
        </div>

        <div
          ref={containerRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto w-full max-w-[30rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none"
        >
          <button
            type="button"
            onClick={() => handleActivate('click')}
            className="group w-full cursor-pointer rounded-xl"
            aria-describedby="hero-ring-help"
          >
            <span className="sr-only">
              Change what the ring display shows. Currently: {state.displayText}.{' '}
              {state.displayMeaning}.
            </span>
            <ProductViewer
              title={`ZWEAQ ONE concept render. The micro-display reads ${state.displayText}.`}
              displayText={state.displayText}
              rotation={state.rotation}
              light={state.light}
              className="w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-transform duration-[var(--duration-medium)] ease-[var(--ease-out)] group-active:scale-[0.99]"
            />
          </button>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <p id="hero-ring-help" className="label-z text-ti-700">
              Tap the ring to change the display
            </p>
            <p className="label-z rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
              Concept render
            </p>
          </div>

          {/* Politely announced, so the automatic cycle stays quiet but a
              deliberate interaction is still reported. */}
          <p aria-live="polite" className="sr-only">
            {announce}
          </p>
        </div>

        <div className="flex flex-col gap-7 lg:col-start-1 lg:row-start-2">
          <p className="max-w-md text-lg leading-relaxed text-ti-300 sm:text-xl">
            <span className="text-paper">AI. Identity. Storage. Information.</span>{' '}
            On your finger.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/#waitlist" size="lg">
              Join early access
            </ButtonLink>
            <ButtonLink href="/product" size="lg" variant="secondary">
              Explore the ring
            </ButtonLink>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-ti-600">
            ZWEAQ ONE is in development. Every figure on this site carries how much is
            actually known about it — target, prototype, or validated.
          </p>
        </div>
      </div>
    </section>
  );
}
