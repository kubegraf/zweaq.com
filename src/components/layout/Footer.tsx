import Link from 'next/link';
import { footerNav } from '@/content/nav';
import { siteConfig } from '@/content/site';
import { Mark } from '@/components/ui/Logo';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';

/**
 * Footer.
 *
 * Social links render only when a real URL is configured — see
 * siteConfig.links. Empty entries produce nothing at all rather than a dead
 * `#` link, because a footer full of links that go nowhere is the clearest
 * possible signal that a site is a template.
 */
export function Footer() {
  const social = Object.entries(siteConfig.links).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
  );

  return (
    <footer className="border-t border-[var(--line)] py-16">
      <div className="container-z">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="-my-2 flex h-11 w-fit items-center gap-2.5 text-paper" aria-label="ZWEAQ — home">
              <Mark className="h-7 w-7" />
              <span className="text-base font-semibold tracking-[0.3em]">ZWEAQ</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ti-500">
              {siteConfig.tagline}
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-ti-700">
              ZWEAQ ONE is a product in development. Specifications on this site are
              design targets, not validated measurements.
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col gap-4">
              <h2 className="label-z text-ti-700">{group.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-ti-400 transition-colors hover:text-paper"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-[var(--line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-sm text-ti-700">
            <p>© {new Date().getFullYear()} ZWEAQ. All rights reserved.</p>
            <p>
              General enquiries: <ObfuscatedEmail {...siteConfig.contact.general} />
            </p>
          </div>

          {social.length > 0 && (
            <ul className="flex items-center gap-5">
              {social.map(([name, href]) => (
                <li key={name}>
                  <a
                    href={href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="label-z text-ti-600 transition-colors hover:text-paper"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
