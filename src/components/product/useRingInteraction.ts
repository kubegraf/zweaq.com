'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Drives the hero ring: display state, rotation from scroll, and key-light
 * position from the pointer.
 *
 * Three rules this obeys:
 *
 *   1. Reduced motion stops the work, not just the paint. No interval is
 *      scheduled, no scroll listener is attached, and no rAF is queued.
 *   2. The pointer never drives React state directly — it writes to a ref and a
 *      single rAF commits at most one update per frame.
 *   3. The moment a person interacts, the automatic cycle stops for good.
 *      Continuing to animate under someone's hand is the fastest way to make an
 *      interactive object feel like a decoration.
 */

export interface RingState {
  displayText: string;
  /** Human-readable description of what the display currently shows. */
  displayMeaning: string;
  rotation: number;
  light: { x: number; y: number };
  index: number;
  hasInteracted: boolean;
}

export interface RingFrame {
  text: string;
  meaning: string;
}

export function useRingInteraction(frames: RingFrame[], intervalMs = 2600) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [light, setLight] = useState({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef<number | null>(null);

  /** Automatic display cycle. Stops permanently once the user takes over. */
  useEffect(() => {
    if (reduced || hasInteracted || frames.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % frames.length),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [reduced, hasInteracted, frames.length, intervalMs]);

  /** Scroll rotation, bounded so the display never spins out of view. */
  useEffect(() => {
    if (reduced) return;

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // -1 (element below the fold) to 1 (scrolled past).
        const progress = (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight;
        setRotation(clamp(progress, -1, 1) * 26);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Coarse pointers have no hover, and a touch "move" here is a scroll.
      if (reduced || event.pointerType !== 'mouse') return;

      const rect = event.currentTarget.getBoundingClientRect();
      pending.current = {
        x: clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        y: clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      };

      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        if (pending.current) setLight(pending.current);
      });
    },
    [reduced],
  );

  const onPointerLeave = useCallback(() => {
    pending.current = null;
    setLight({ x: 0, y: 0 });
  }, []);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const advance = useCallback(
    (to?: number) => {
      setHasInteracted(true);
      setIndex((i) => (typeof to === 'number' ? to : (i + 1) % Math.max(1, frames.length)));
    },
    [frames.length],
  );

  const current = frames[index] ?? frames[0] ?? { text: '', meaning: '' };

  return {
    containerRef,
    onPointerMove,
    onPointerLeave,
    advance,
    state: {
      displayText: current.text,
      displayMeaning: current.meaning,
      rotation,
      light,
      index,
      hasInteracted,
    } satisfies RingState,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
