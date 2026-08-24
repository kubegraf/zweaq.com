'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { countries } from '@/content/countries';
import { INTERESTS, INTEREST_LABELS, type Interest, type WaitlistResult } from '@/lib/waitlist/types';
import { submitWaitlist, isLocalOnly } from '@/lib/waitlist/client';
import { validateSubmission } from '@/lib/waitlist/validate';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type FieldErrors = NonNullable<WaitlistResult['errors']>;

/**
 * Waitlist.
 *
 * Conversion decisions, and why:
 *   - Four fields. Every extra field costs signups, and none of these is
 *     optional to the thing we are actually doing with it.
 *   - Errors appear on submit and then live-clear as you fix them. Validating
 *     on every keystroke tells people they are wrong before they have finished
 *     being right.
 *   - The submit button never disables on "incomplete". A disabled button with
 *     no explanation is the single most common dead end in a signup form.
 *   - Errors are announced, focus moves to the first bad field, and each field
 *     is wired to its message with aria-describedby.
 */
export function WaitlistSection() {
  const uid = useId().replace(/:/g, '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [touched, setTouched] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const startTracked = useRef(false);

  // Resolved on the client: transport depends on env available at runtime.
  useEffect(() => setLocalOnly(isLocalOnly()), []);

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  const onFirstInput = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    track({ name: 'waitlist_start' });
  };

  const readForm = () => {
    const data = new FormData(formRef.current!);
    return {
      firstName: String(data.get('firstName') ?? ''),
      email: String(data.get('email') ?? ''),
      country: String(data.get('country') ?? ''),
      interest: String(data.get('interest') ?? '') as Interest,
      consent: data.get('consent') === 'on',
      company: String(data.get('company') ?? ''),
      elapsedMs: Date.now() - startedAt,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setTouched(true);
    const submission = readForm();

    const invalid = validateSubmission(submission);
    if (invalid?.errors) {
      setErrors(invalid.errors);
      setResult(null);
      focusFirstError(invalid.errors);
      track({ name: 'waitlist_error', reason: 'validation' });
      return;
    }

    setErrors({});
    setSubmitting(true);
    const response = await submitWaitlist(submission);
    setSubmitting(false);
    setResult(response);

    if (response.status === 'success') {
      track({ name: 'waitlist_complete', interest: submission.interest });
      if (submission.interest === 'developer') track({ name: 'developer_signup' });
      formRef.current?.reset();
    } else if (response.status === 'validation_error' && response.errors) {
      setErrors(response.errors);
      focusFirstError(response.errors);
    } else if (response.status !== 'already_registered') {
      track({ name: 'waitlist_error', reason: response.status });
    }
  };

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const first = Object.keys(fieldErrors)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  };

  /** Clears a field's error as soon as it becomes valid, but only after a submit. */
  const revalidate = () => {
    if (!touched) return;
    const next = validateSubmission(readForm());
    setErrors(next?.errors ?? {});
  };

  if (result?.status === 'success' || result?.status === 'already_registered') {
    return (
      <Section id="waitlist" index="23" eyebrow="Early access">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-8 text-center">
          <DisplayChip size="lg" tone="verify">
            {result.status === 'success' ? '✓ ON THE LIST' : '✓ ALREADY IN'}
          </DisplayChip>
          <h2 className="text-[length:var(--text-display-3)] text-paper">
            {result.status === 'success' ? 'You’re on the list.' : 'You’re already on the list.'}
          </h2>
          <p className="leading-relaxed text-ti-400" role="status">
            {result.status === 'success'
              ? 'We’ll keep you posted — infrequently, and only when something has actually changed.'
              : 'That address is already registered. No need to sign up twice.'}
          </p>
          {localOnly && (
            <p className="max-w-md text-xs leading-relaxed text-ti-700">
              This deployment has no signup backend configured, so your address was
              recorded in this browser only and was not sent anywhere.
            </p>
          )}
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="waitlist"
      index="23"
      eyebrow="Early access"
      headline="Be first to wear what’s next."
      lede="No launch countdown, no drip campaign. We’ll write when there is something worth reading — a prototype that works, a date that has moved, a decision that changed."
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="mt-12 grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]"
      >
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id={fieldId('firstName')}
              errorId={errorId('firstName')}
              name="firstName"
              label="First name"
              autoComplete="given-name"
              error={errors.firstName}
              onInput={onFirstInput}
              onBlur={revalidate}
            />
            <Field
              id={fieldId('email')}
              errorId={errorId('email')}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              inputMode="email"
              error={errors.email}
              onInput={onFirstInput}
              onBlur={revalidate}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={fieldId('country')} className="label-z text-ti-600">
              Country
            </label>
            <select
              id={fieldId('country')}
              name="country"
              defaultValue=""
              autoComplete="country"
              onChange={revalidate}
              aria-invalid={errors.country ? true : undefined}
              aria-describedby={errors.country ? errorId('country') : undefined}
              className={cn(
                'h-12 w-full rounded-md border bg-ink-raised px-3 text-paper',
                'transition-colors duration-[var(--duration-fast)]',
                errors.country ? 'border-signal' : 'border-[var(--line-strong)]',
              )}
            >
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <FieldError id={errorId('country')} message={errors.country} />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="label-z mb-1 text-ti-600">Interested in</legend>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest, i) => (
                <label
                  key={interest}
                  className="label-z inline-flex h-11 cursor-pointer items-center rounded-full border border-[var(--line-strong)] px-4 text-ti-400 transition-colors has-[:checked]:border-paper has-[:checked]:bg-paper has-[:checked]:text-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal"
                >
                  <input
                    type="radio"
                    name="interest"
                    value={interest}
                    defaultChecked={i === 0}
                    onChange={revalidate}
                    className="sr-only"
                  />
                  {INTEREST_LABELS[interest]}
                </label>
              ))}
            </div>
            <FieldError id={errorId('interest')} message={errors.interest} />
          </fieldset>

          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ti-400">
              <input
                type="checkbox"
                name="consent"
                onChange={revalidate}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? errorId('consent') : undefined}
                className="mt-px h-6 w-6 shrink-0 accent-[var(--color-signal)]"
              />
              <span>
                Email me about ZWEAQ. We will not sell, rent or share your address, and
                every email has a one-click unsubscribe.
              </span>
            </label>
            <FieldError id={errorId('consent')} message={errors.consent} />
          </div>

          {/* Honeypot. Hidden from sight and from assistive technology; only an
              automated form-filler ever populates it. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
            <label htmlFor={fieldId('company')}>Company (leave blank)</label>
            <input
              id={fieldId('company')}
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" className="self-start" disabled={submitting}>
              {submitting ? 'Joining…' : 'Join early access'}
            </Button>

            {/* Non-field failures. Assertive, because the user just acted and
                nothing visible happened. */}
            <p role="alert" className="text-sm text-signal">
              {/* success and already_registered returned early above, so the
                  only cases left here are genuine failures. */}
              {result && result.status !== 'validation_error'
                ? (result.message ?? 'Something went wrong. Please try again.')
                : ''}
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-4 self-start rounded-lg border border-[var(--line)] bg-ink-raised p-6">
          <h3 className="label-z text-ti-600">What you are signing up for</h3>
          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-ti-400">
            <li>Early access when prototypes go out, in signup order.</li>
            <li>Development updates, including the ones where a date slips.</li>
            <li>First notice when preorders open. No obligation to buy anything.</li>
          </ul>
          <hr className="rule-z border-0" />
          <p className="text-xs leading-relaxed text-ti-700">
            We store your name, email, country and interest. Nothing else. No tracking
            pixels, no ad-network audiences, no sale of your data.
          </p>
          {localOnly && (
            <p className="text-xs leading-relaxed text-ti-700">
              Note: this deployment has no signup backend configured. Submissions are
              validated and remembered in your browser only, and are not sent anywhere.
            </p>
          )}
        </aside>
      </form>
    </Section>
  );
}

function Field({
  id,
  errorId,
  name,
  label,
  error,
  ...rest
}: {
  id: string;
  errorId: string;
  name: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-z text-ti-600">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-12 w-full rounded-md border bg-ink-raised px-3 text-paper placeholder:text-ti-700',
          'transition-colors duration-[var(--duration-fast)]',
          error ? 'border-signal' : 'border-[var(--line-strong)]',
        )}
        {...rest}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm text-signal">
      {/* Icon as well as colour — the error must not depend on seeing orange.
          The message is its own element so it stays one addressable string. */}
      <span aria-hidden="true">!</span>
      <span>{message}</span>
    </p>
  );
}
