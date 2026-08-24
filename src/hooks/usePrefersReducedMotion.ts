'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks prefers-reduced-motion, live.
 *
 * Returns `true` during SSR and first paint so that any animation gated on it
 * starts stopped and only begins once we have confirmed the user is happy with
 * motion — failing safe rather than flashing a frame of animation at someone
 * who asked for none.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return reduced;
}
