export const INTERESTS = ['one', 'developer', 'enterprise', 'investment'] as const;
export type Interest = (typeof INTERESTS)[number];

export const INTEREST_LABELS: Record<Interest, string> = {
  one: 'ZWEAQ ONE',
  developer: 'Developer',
  enterprise: 'Enterprise',
  investment: 'Investment',
};

export interface WaitlistSubmission {
  firstName: string;
  email: string;
  country: string;
  interest: Interest;
  consent: boolean;
  /** Honeypot. Must be empty — bots fill it, humans never see it. */
  company?: string;
  /** Milliseconds the form was on screen before submit. */
  elapsedMs?: number;
}

export type WaitlistStatus =
  | 'success'
  | 'already_registered'
  | 'validation_error'
  | 'rate_limited'
  | 'server_error';

export interface WaitlistResult {
  status: WaitlistStatus;
  /** Field-keyed messages. Only present for validation_error. */
  errors?: Partial<Record<keyof WaitlistSubmission, string>>;
  message?: string;
}

export const HTTP_STATUS: Record<WaitlistStatus, number> = {
  success: 201,
  already_registered: 200,
  validation_error: 422,
  rate_limited: 429,
  server_error: 500,
};
