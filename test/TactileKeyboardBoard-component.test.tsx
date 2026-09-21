import './setup';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TactileKeyboardBoard } from '../src/components/TactileKeyboardBoard';

describe('TactileKeyboardBoard', () => {
  it('renders standard keys', () => {
    const { container, getByText } = render(<TactileKeyboardBoard />);
    
    expect(getByText('Esc')).toBeTruthy();
    expect(getByText('Enter')).toBeTruthy();
    
    const board = container.querySelector('[data-tactile-keyboard-board]');
    expect(board?.classList.contains('colorway-classic')).toBe(true);
  });

  it('handles physical keydown events', () => {
    const { container } = render(<TactileKeyboardBoard />);
    
    fireEvent.keyDown(window, { code: 'KeyA', key: 'a' });
    
    const aKey = Array.from(container.querySelectorAll('.key-top')).find(el => el.textContent === 'a');
    expect(aKey?.parentElement?.classList.contains('is-active')).toBe(true);
    
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' });
    expect(aKey?.parentElement?.classList.contains('is-active')).toBe(false);
  });

  it('updates shift legends on shift press', () => {
    const { container } = render(<TactileKeyboardBoard />);
    
    // Check initial state (e.g., lowercase 'a')
    expect(Array.from(container.querySelectorAll('.key-top')).find(el => el.textContent === 'a')).toBeTruthy();
    
    fireEvent.keyDown(window, { code: 'ShiftLeft', key: 'Shift' });
    
    // Check shifted state (e.g., uppercase 'A')
    expect(Array.from(container.querySelectorAll('.key-top')).find(el => el.textContent === 'A')).toBeTruthy();
  });
});
