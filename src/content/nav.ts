export interface NavItem {
  label: string;
  href: string;
  /** Short line shown in the mobile menu so nav items aren't bare words. */
  hint: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/product', hint: 'Hardware, display, vault, identity' },
  { label: 'Technology', href: '/technology', hint: 'Architecture, firmware, power' },
  { label: 'Security', href: '/security', hint: 'Keys, secure element, privacy' },
  { label: 'Developers', href: '/developers', hint: 'SDK surface and early access' },
  { label: 'Roadmap', href: '/#roadmap', hint: 'What is planned, and when' },
];

export const footerNav = [
  {
    title: 'Product',
    items: [
      { label: 'ZWEAQ ONE', href: '/product' },
      { label: 'Technology', href: '/technology' },
      { label: 'Security', href: '/security' },
      { label: 'Developers', href: '/developers' },
      { label: 'Roadmap', href: '/#roadmap' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/#not-a-health-ring' },
      { label: 'Contact', href: '/#waitlist' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
] as const;
