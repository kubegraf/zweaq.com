"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/content/nav";
import { Wordmark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Sticky navigation. Transparent over the hero, solid once scrolled.
 *
 * The scroll listener is passive and only ever flips one boolean, so it cannot
 * become a scroll-jank source. The mobile menu is a real dialog: focus is
 * trapped while open, Escape closes it, and background scroll is locked.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change closes the menu — otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#")
      ? false
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter]",
        "duration-[var(--duration-medium)] ease-[var(--ease-out)]",
        scrolled || open
          ? "border-b border-[var(--line)] bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/*
        The mobile panel lives inside this <nav>, not beside it. Rendering it as
        a sibling leaves phone users with a "Primary" navigation landmark that
        contains no primary navigation.
      */}
      <nav aria-label="Primary">
        <div className="container-z flex h-[var(--nav-h)] items-center justify-between gap-4">
          <Link
            href="/"
            className="-my-2 flex h-11 shrink-0 items-center text-paper transition-opacity hover:opacity-80"
            aria-label="ZWEAQ — home"
          >
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "label-z rounded-full px-3.5 py-2.5 transition-colors",
                    isActive(item.href)
                      ? "text-paper"
                      : "text-ti-500 hover:text-paper",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* One button, two labels. Putting `hidden sm:inline-flex` on the
              button itself would lose to the base `inline-flex`, because CSS
              resolves by stylesheet order, not class-attribute order. */}
            <ButtonLink href="/#waitlist" size="md" className="px-4 sm:px-5">
              <span className="sm:hidden">Join</span>
              <span className="hidden sm:inline">Join early access</span>
            </ButtonLink>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-paper lg:hidden"
            >
              <span className="sr-only">
                {open ? "Close menu" : "Open menu"}
              </span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                {open ? (
                  <path
                    d="M5 5 19 19 M19 5 5 19"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 7h18 M3 17h18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-t border-[var(--line)] bg-ink lg:hidden"
          >
            <ul className="container-z flex flex-col py-2">
              {primaryNav.map((item) => (
                <li
                  key={item.href}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  <Link
                    href={item.href}
                    className="flex flex-col gap-1 py-4 text-paper"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span className="text-lg">{item.label}</span>
                    <span className="text-sm text-ti-600">{item.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
