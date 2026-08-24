import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveDemo } from '@/components/sections/InteractiveDemo';
import { FaqSection } from '@/components/sections/FaqSection';
import { Hero } from '@/components/sections/Hero';
import { productConfig } from '@/content/product';
import { faq } from '@/content/faq';

describe('<InteractiveDemo>', () => {
  it('is a real tablist with one tab per capability', () => {
    render(<InteractiveDemo />);
    const tablist = screen.getByRole('tablist', { name: /capabilities/i });
    expect(tablist).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(productConfig.modes.length);
  });

  it('uses a roving tabindex so the whole control is one tab stop', () => {
    render(<InteractiveDemo />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.filter((tab) => tab.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('moves selection with arrow keys and wraps at both ends', async () => {
    const user = userEvent.setup();
    render(<InteractiveDemo />);
    const tabs = screen.getAllByRole('tab');

    tabs[0]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true');
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    render(<InteractiveDemo />);
    const tabs = screen.getAllByRole('tab');

    tabs[0]!.focus();
    await user.keyboard('{End}');
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('shows the selected capability and updates the ring display', async () => {
    const user = userEvent.setup();
    render(<InteractiveDemo />);

    const vault = productConfig.modes.find((m) => m.id === 'vault')!;
    await user.click(screen.getByRole('tab', { name: vault.label }));

    expect(await screen.findByText(vault.headline)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: new RegExp(`display reads ${vault.display}`, 'i') }),
    ).toBeInTheDocument();
  });

  it('associates each panel with the tab that controls it', async () => {
    const user = userEvent.setup();
    render(<InteractiveDemo />);
    const tab = screen.getAllByRole('tab')[2]!;

    await user.click(tab);
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(tab).toHaveAttribute('aria-controls', panel.id);
  });
});

describe('<FaqSection>', () => {
  it('renders every question', () => {
    render(<FaqSection />);
    for (const item of faq) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  /*
   * The answers must exist in the DOM even when collapsed, so browser
   * find-in-page and search-engine crawlers can both reach them.
   */
  it('keeps every answer in the document while collapsed', () => {
    render(<FaqSection />);
    for (const item of faq) {
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    }
  });

  it('answers the local-AI question with a plain no', () => {
    render(<FaqSection />);
    const answer = faq.find((item) => item.id === 'local-llm')!.answer;
    expect(answer).toMatch(/^No\b/);
    expect(screen.getByText(answer)).toBeInTheDocument();
  });

  it('answers the payments question with a plain no', () => {
    const answer = faq.find((item) => item.id === 'payments')!.answer;
    expect(answer).toMatch(/^No\./);
  });
});

describe('<Hero>', () => {
  it('states the product promise in a single top-level heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/The personal\s*computer\s*you wear\./i);
  });

  it('labels the ring render as a concept, visibly and in its description', () => {
    render(<Hero />);
    // Once as a visible badge next to the render, and once inside the SVG's
    // own accessible name — a sighted visitor and a screen reader both get it.
    expect(screen.getByText('Concept render')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /concept render/i }),
    ).toBeInTheDocument();
  });

  it('lets a keyboard user change the display and announces the change', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const ring = screen.getByRole('button', { name: /change what the ring display shows/i });
    ring.focus();
    await user.keyboard('{Enter}');

    const live = document.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toMatch(/Display shows/i);
  });

  it('stops the automatic cycle when the user prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const setInterval = vi.spyOn(window, 'setInterval');

    render(<Hero />);
    expect(setInterval).not.toHaveBeenCalled();
  });
});
