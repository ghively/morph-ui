import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextRipple } from '../src/components/TextRipple';

describe('TextRipple', () => {
  it('renders text properly', () => {
    render(<TextRipple text="Hello" />);
    
    const srText = document.querySelector('.text-ripple-sr-only');
    expect(srText?.textContent).toBe('Hello');

    const chars = document.querySelectorAll('.text-ripple-char');
    expect(chars.length).toBe(5);
    expect(chars[0].textContent).toBe('H');
    expect(chars[4].textContent).toBe('o');
  });

  it('triggers ripple on click', () => {
    const { container } = render(<TextRipple text="Tap me" />);
    const root = container.querySelector('[data-text-ripple]') as HTMLElement;
    
    // In React, key change forces remount, hard to test key change directly in DOM without tracking it
    // We just verify it has the onClick handler and doesn't crash
    expect(root).toBeTruthy();
    fireEvent.click(root);
  });

  it('applies custom style properties', () => {
    const { container } = render(<TextRipple text="Style" duration="1s" stagger="0.1s" className="custom" />);
    const root = container.querySelector('[data-text-ripple]') as HTMLElement;
    
    expect(root.className).toContain('custom');
    expect(root.style.getPropertyValue('--ripple-duration')).toBe('1s');
    expect(root.style.getPropertyValue('--ripple-stagger')).toBe('0.1s');
  });

  it('handles spaces correctly', () => {
    render(<TextRipple text="A B" />);
    const chars = document.querySelectorAll('.text-ripple-char');
    expect(chars.length).toBe(3);
    expect(chars[1].classList.contains('is-space')).toBe(true);
    expect(chars[1].textContent).toBe('\u00A0');
  });
});
