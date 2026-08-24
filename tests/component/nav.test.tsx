import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from '@/components/layout/Nav';
import { primaryNav } from '@/content/nav';

describe('<Nav>', () => {
  it('exposes a labelled primary navigation landmark', () => {
    render(<Nav />);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('links every primary destination', () => {
    render(<Nav />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of primaryNav) {
      expect(within(nav).getAllByRole('link', { name: item.label }).length).toBeGreaterThan(0);
    }
  });

  /*
   * The mobile panel must live inside the navigation landmark. Rendering it as
   * a sibling leaves phone users with a "Primary" nav containing no primary
   * navigation at all.
   */
  it('keeps the mobile menu inside the primary navigation landmark', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    expect(within(nav).getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    for (const item of primaryNav) {
      expect(within(nav).getAllByRole('link', { name: new RegExp(item.label, 'i') }).length)
        .toBeGreaterThan(0);
    }
  });

  it('opens and closes the mobile menu, reporting state to assistive tech', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(toggle);
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the mobile menu on Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    const toggle = screen.getByRole('button', { name: /open menu/i });
    await user.click(toggle);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveFocus();
  });

  it('locks background scroll while the menu is open', async () => {
    const user = userEvent.setup();
    render(<Nav />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('keeps the waitlist call to action reachable at every width', () => {
    render(<Nav />);
    // One button, two labels — the narrow one and the wide one.
    const cta = screen.getAllByRole('link', { name: /join/i });
    expect(cta.length).toBeGreaterThan(0);
    expect(cta.some((el) => el.getAttribute('href')?.includes('#waitlist'))).toBe(true);
  });
});
