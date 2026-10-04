import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KeyboardShowcase } from '../src/components/KeyboardShowcase';

describe('KeyboardShowcase', () => {
  it('renders default ANSI layout correctly', () => {
    const { container, getByLabelText } = render(<KeyboardShowcase />);
    
    expect(container.querySelector('.layout-ansi')).toBeTruthy();
    expect(container.querySelector('.finish-silver')).toBeTruthy();
    
    // Contains enter key for ANSI
    expect(getByLabelText('Key return')).toBeTruthy();
  });

  it('renders ISO layout correctly', () => {
    const { container, getByLabelText } = render(<KeyboardShowcase layout="ISO" />);
    
    expect(container.querySelector('.layout-iso')).toBeTruthy();
    
    // Contains enter key for ISO
    expect(getByLabelText('Key enter-iso-top')).toBeTruthy();
  });

  it('ISO keeps `]` in the top row and adds the `#` key on the home row', () => {
    const { container, getByLabelText } = render(<KeyboardShowcase layout="ISO" />);
    const rows = container.querySelectorAll('.keyboard-row');
    const qwerty = Array.from(rows[2]!.querySelectorAll('.keyboard-key')).map(k => k.getAttribute('aria-label'));
    expect(qwerty.slice(-2)).toEqual(['Key ]', 'Key enter-iso-top']);
    const home = Array.from(rows[3]!.querySelectorAll('.keyboard-key')).map(k => k.getAttribute('aria-label'));
    expect(home.slice(-2)).toEqual(['Key #', 'Key enter-iso-bottom']);
    expect(getByLabelText('Key enter-iso-bottom', { selector: '[aria-hidden="true"]' })).toBeTruthy();
  });

  it('handles finishes', () => {
    const { container } = render(<KeyboardShowcase finish="space-gray" />);
    expect(container.querySelector('.finish-space-gray')).toBeTruthy();
  });

  it('handles key press interactions', () => {
    const { getByLabelText } = render(<KeyboardShowcase />);
    
    const spaceKey = getByLabelText('Key space');
    
    fireEvent.pointerDown(spaceKey);
    expect(spaceKey.classList.contains('pressed')).toBe(true);
    
    fireEvent.pointerUp(spaceKey);
    expect(spaceKey.classList.contains('pressed')).toBe(false);
  });

  it('shows caps lock LED when on', () => {
    const { container } = render(<KeyboardShowcase capsLockOn={true} />);
    const led = container.querySelector('.caps-led');
    
    expect(led).toBeTruthy();
    expect(led?.classList.contains('on')).toBe(true);
  });
});
