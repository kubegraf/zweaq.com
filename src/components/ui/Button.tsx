import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-mono uppercase ' +
  'tracking-[0.14em] whitespace-nowrap transition-[background-color,color,border-color,transform] ' +
  'duration-[var(--duration-fast)] ease-[var(--ease-out)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary:
    'bg-paper text-ink hover:bg-ti-100 border border-transparent ' +
    // A single warm underline on hover: the only place the accent touches a button.
    'shadow-[0_0_0_0_transparent] hover:shadow-[0_3px_0_-1px_var(--color-signal)]',
  secondary:
    'border border-[var(--line-strong)] text-paper hover:border-ti-400 hover:bg-white/[0.04]',
  ghost: 'text-ti-400 hover:text-paper',
};

const sizes: Record<Size, string> = {
  // 44px and 52px tall — both clear the 44px minimum touch target.
  md: 'h-11 px-5 text-[0.6875rem]',
  lg: 'h-13 px-7 text-xs',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<'button'>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
