import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spec } from '@/components/ui/Spec';
import { ClaimBadge } from '@/components/ui/ClaimBadge';
import { productConfig } from '@/content/product';
import { CLAIM_META } from '@/content/claims';

describe('<Spec>', () => {
  it('qualifies an unvalidated value on screen', () => {
    render(<Spec label="Vault capacity" claim={productConfig.specs.storage} />);
    expect(screen.getByText('Target:')).toBeInTheDocument();
    expect(screen.getByText('32 GB')).toBeInTheDocument();
  });

  it('renders a validated value without a qualifier', () => {
    render(<Spec label="Weight" claim={{ value: '4.8 g', level: 'production' }} />);
    expect(screen.queryByText('Target:')).not.toBeInTheDocument();
    expect(screen.getByText('4.8 g')).toBeInTheDocument();
  });

  it('shows the clarifying note when there is one', () => {
    render(<Spec label="Battery" claim={productConfig.specs.battery} />);
    expect(
      screen.getByText(/Mixed use, display off between glances/i),
    ).toBeInTheDocument();
  });

  it('associates the label with its value as a definition pair', () => {
    const { container } = render(<Spec label="Display" claim={productConfig.specs.display} />);
    expect(container.querySelector('dt')?.textContent).toBe('Display');
    expect(container.querySelector('dd')).toBeInTheDocument();
  });
});

describe('<ClaimBadge>', () => {
  it('states the level as text, not only as colour', () => {
    render(<ClaimBadge level="concept" />);
    expect(screen.getByText(CLAIM_META.concept.label)).toBeInTheDocument();
  });

  it('carries the full definition for anyone who needs it', () => {
    render(<ClaimBadge level="prototype" />);
    expect(screen.getByTitle(CLAIM_META.prototype.definition)).toBeInTheDocument();
  });
});
