import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MagneticButton } from '../src/components/MagneticButton';

describe('MagneticButton', () => {
  it('renders content correctly', () => {
    const { container } = render(<MagneticButton>Click me</MagneticButton>);
    expect(container.textContent).toBe('Click me');
  });

  it('handles magnetic pull on mouse move', () => {
    const { getByRole } = render(<MagneticButton>Pull</MagneticButton>);
    const button = getByRole('button');
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 40,
      top: 0,
      left: 0,
      bottom: 40,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));

    fireEvent.mouseMove(button, { clientX: 100, clientY: 40 });
    // Center is 50, 20. Diff is 50, 20. Ratio 0.3 -> 15, 6
    expect(button.style.transform).toBe('translate(15px, 6px)');

    fireEvent.mouseLeave(button);
    expect(button.style.transform).toBe('translate(0px, 0px)');
  });

  it('respects disabled state', () => {
    const { getByRole } = render(<MagneticButton disabled>Disabled</MagneticButton>);
    const button = getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);

    fireEvent.mouseMove(button, { clientX: 100, clientY: 40 });
    expect(button.style.transform).toBe('translate(0px, 0px)');
  });

  it('applies variant classes correctly', () => {
    const { getByRole } = render(<MagneticButton variant="danger">Danger</MagneticButton>);
    expect(getByRole('button').getAttribute('data-variant')).toBe('danger');
  });
});
