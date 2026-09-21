import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PulseOrb } from '../src/components/PulseOrb';

describe('PulseOrb', () => {
  it('renders default idle state correctly', () => {
    const { container, getByRole } = render(<PulseOrb />);
    
    const orb = container.querySelector('[data-pulse-orb]') as HTMLElement;
    expect(orb).toBeTruthy();
    expect(orb.getAttribute('data-state')).toBe('idle');
    
    const status = getByRole('status');
    expect(status.getAttribute('aria-label')).toBe('AI Status: idle');
  });

  it('renders thinking state correctly', () => {
    const { container } = render(<PulseOrb state="thinking" />);
    const orb = container.querySelector('[data-pulse-orb]');
    expect(orb?.getAttribute('data-state')).toBe('thinking');
  });

  it('renders speaking state correctly', () => {
    const { container } = render(<PulseOrb state="speaking" />);
    const orb = container.querySelector('[data-pulse-orb]');
    expect(orb?.getAttribute('data-state')).toBe('speaking');
  });

  it('applies custom size and color', () => {
    const { container } = render(<PulseOrb size={200} color="red" />);
    const orb = container.querySelector('[data-pulse-orb]') as HTMLElement;
    
    expect(orb.style.width).toBe('200px');
    expect(orb.style.height).toBe('200px');
    expect(orb.style.getPropertyValue('--orb-color')).toBe('red');
  });
});
