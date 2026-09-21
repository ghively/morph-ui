import './setup';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PricingTierCard } from '../src/components/PricingTierCard';

describe('PricingTierCard', () => {
  it('renders title, price, and features', () => {
    const { container, getByText } = render(
      <PricingTierCard 
        title="Pro" 
        price="$29/mo" 
        features={['Feature A', 'Feature B']} 
      />
    );
    
    expect(getByText('Pro')).toBeTruthy();
    expect(getByText('$29/mo')).toBeTruthy();
    expect(getByText('Feature A')).toBeTruthy();
    
    const card = container.querySelector('[data-pricing-tier-card]');
    expect(card).toBeTruthy();
  });

  it('handles toggle', () => {
    const mockToggle = vi.fn();
    const { container } = render(
      <PricingTierCard 
        title="Pro" 
        price="$29/mo" 
        features={['Feature A']} 
        onToggle={mockToggle}
      />
    );
    
    const toggleInput = container.querySelector('input[type="checkbox"]');
    expect(toggleInput).toBeTruthy();
    
    if (toggleInput) {
      fireEvent.click(toggleInput);
      expect(mockToggle).toHaveBeenCalledWith(true);
    }
  });

  it('adds hover classes for shimmer', () => {
    const { container } = render(
      <PricingTierCard 
        title="Pro" 
        price="$29/mo" 
        features={['Feature A']} 
      />
    );
    
    const card = container.querySelector('[data-pricing-tier-card]');
    if (card) {
      fireEvent.mouseEnter(card);
    }
    
    const cta = container.querySelector('.pricing-cta');
    expect(cta?.classList.contains('is-approaching')).toBe(true);
  });
});
