import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TactileKeyboardShowcase } from '../src/components/TactileKeyboardShowcase';

describe('TactileKeyboardShowcase', () => {
  it('renders correctly with default colorway', () => {
    const { container } = render(<TactileKeyboardShowcase />);
    
    expect(container.querySelector('.colorway-classic')).toBeTruthy();
    // The space bar has no printed label but still needs an accessible name.
    expect(container.querySelector('.key-space')?.getAttribute('aria-label')).toBe('Space');
  });

  it('renders correctly with cyber colorway', () => {
    const { container } = render(<TactileKeyboardShowcase colorway="cyber" />);
    expect(container.querySelector('.colorway-cyber')).toBeTruthy();
  });

  it('handles key travel animation on press', () => {
    const { getByLabelText } = render(<TactileKeyboardShowcase />);
    
    const enterKey = getByLabelText('ENTER');
    expect(enterKey.classList.contains('pressed')).toBe(false);
    
    fireEvent.pointerDown(enterKey);
    expect(enterKey.classList.contains('pressed')).toBe(true);
    
    fireEvent.pointerUp(enterKey);
    expect(enterKey.classList.contains('pressed')).toBe(false);
  });

  it('supports sound prop (no error thrown)', () => {
    const { getByLabelText } = render(<TactileKeyboardShowcase enableSound={true} />);
    const escKey = getByLabelText('ESC');
    
    // Just verifying it doesn't crash
    fireEvent.pointerDown(escKey);
    expect(escKey.classList.contains('pressed')).toBe(true);
  });
});
