'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll reveal via IntersectionObserver.
 *
 * The observer only flips a data attribute; the transition itself is CSS (see
 * globals.css). That means zero per-frame JavaScript, and elements are
 * unobserved the moment they reveal so the observer list stays short.
 *
 * Elements start hidden only when JS is running, because the attribute that
 * hides them is set here rather than in the server HTML — so with JS disabled
 * or broken, content is fully visible instead of permanently invisible.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      for (const t of targets) t.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    for (const t of targets) observer.observe(t);
    return () => observer.disconnect();
  }, []);

  return ref;
}
