import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistSection } from '@/components/sections/WaitlistSection';

/** Fills the form with a valid submission. */
async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First name'), 'Ada');
  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.selectOptions(screen.getByLabelText('Country'), 'GB');
  await user.click(screen.getByRole('checkbox'));
}

describe('<WaitlistSection>', () => {
  beforeEach(() => {
    window.localStorage.clear();

    /*
     * The form rejects submissions completed in under 1.2s as automated, and a
     * test runs far faster than a person reads. Rather than weakening that
     * check, advance the clock on every read so any mount-then-submit pair is
     * separated by well over the threshold — including tests that mount twice.
     */
    let clock = Date.now();
    vi.spyOn(Date, 'now').mockImplementation(() => {
      clock += 5_000;
      return clock;
    });
  });

  it('renders every field with an accessible label', () => {
    render(<WaitlistSection />);
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /interested in/i })).toBeInTheDocument();
  });

  it('reports validation errors and links them to their fields', async () => {
    const user = userEvent.setup();
    render(<WaitlistSection />);

    await user.click(screen.getByRole('button', { name: /join early access/i }));

    expect(await screen.findByText('Enter your first name.')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument();

    const email = screen.getByLabelText('Email');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription(/enter your email address/i);
  });

  it('distinguishes a missing address from a malformed one', async () => {
    const user = userEvent.setup();
    render(<WaitlistSection />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /join early access/i }));

    expect(
      await screen.findByText('That does not look like an email address.'),
    ).toBeInTheDocument();
  });

  it('moves focus to the first field that needs fixing', async () => {
    const user = userEvent.setup();
    render(<WaitlistSection />);

    await user.click(screen.getByRole('button', { name: /join early access/i }));
    await waitFor(() => expect(screen.getByLabelText('First name')).toHaveFocus());
  });

  it('requires explicit consent before it will submit', async () => {
    const user = userEvent.setup();
    render(<WaitlistSection />);

    await user.type(screen.getByLabelText('First name'), 'Ada');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText('Country'), 'GB');
    await user.click(screen.getByRole('button', { name: /join early access/i }));

    expect(
      await screen.findByText('We need your permission before we can email you.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/on the list/i)).not.toBeInTheDocument();
  });

  it('clears an error once the field is corrected', async () => {
    const user = userEvent.setup();
    render(<WaitlistSection />);

    await user.click(screen.getByRole('button', { name: /join early access/i }));
    expect(await screen.findByText('Enter your first name.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('First name'), 'Ada');
    await user.tab();

    await waitFor(() =>
      expect(screen.queryByText('Enter your first name.')).not.toBeInTheDocument(),
    );
  });

  it('confirms a successful signup', async () => {
    const user = userEvent.setup();
    render(<WaitlistSection />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /join early access/i }));

    expect(await screen.findByText('You’re on the list.')).toBeInTheDocument();
  });

  it('reports a duplicate rather than pretending it is a new signup', async () => {
    const user = userEvent.setup();
    const first = render(<WaitlistSection />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /join early access/i }));
    await screen.findByText('You’re on the list.');
    first.unmount();

    render(<WaitlistSection />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /join early access/i }));

    expect(await screen.findByText('You’re already on the list.')).toBeInTheDocument();
  });

  it('does not disable the submit button while the form is incomplete', () => {
    render(<WaitlistSection />);
    // A disabled button with no explanation is the most common dead end in a
    // signup form; the form explains what is wrong instead.
    expect(screen.getByRole('button', { name: /join early access/i })).toBeEnabled();
  });

  it('hides the honeypot from sight and from assistive technology', () => {
    const { container } = render(<WaitlistSection />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot?.closest('[aria-hidden="true"]')).toBeTruthy();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  it('silently accepts a bot submission without recording it', async () => {
    const user = userEvent.setup();
    const { container } = render(<WaitlistSection />);

    await fillValid(user);
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement;
    await user.type(honeypot, 'Acme Corp');
    await user.click(screen.getByRole('button', { name: /join early access/i }));

    expect(await screen.findByText('You’re on the list.')).toBeInTheDocument();
    // Nothing persisted, so a real person on this address can still sign up.
    expect(window.localStorage.getItem('zweaq:waitlist:local')).toBeNull();
  });
});
