'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * An email address that is never present as a scrapable string.
 *
 * The rendered HTML contains the user and domain in separate elements, joined
 * visually by CSS, and no `mailto:` href exists until the user activates the
 * control. A harvester parsing the markup finds no address and no mailto link;
 * a person gets a working mail link on the first click, and a keyboard user
 * gets it on the first Enter.
 *
 * The address is still visible to a human reading the page — that is the
 * point. This defeats bulk scraping, not a determined reader.
 */
export function ObfuscatedEmail({
  user,
  domain,
  className,
  label,
}: {
  user: string;
  domain: string;
  className?: string;
  label?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const address = `${user}@${domain}`;

  if (revealed) {
    return (
      <a
        href={`mailto:${address}`}
        className={cn('text-paper underline underline-offset-4', className)}
      >
        {label ?? address}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className={cn(
        // py-1 keeps the hit area at 24px without breaking the text line.
        'inline cursor-pointer py-1 text-paper underline decoration-dotted underline-offset-4',
        className,
      )}
      title="Click to open in your mail app"
    >
      <span>{user}</span>
      <span aria-hidden="true">&#64;</span>
      <span className="sr-only"> at </span>
      <span>{domain}</span>
    </button>
  );
}
