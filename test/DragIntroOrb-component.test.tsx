import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DragIntroOrb } from '../src/components/DragIntroOrb';

// Mock setPointerCapture/releasePointerCapture as jsdom doesn't support them
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = vi.fn();
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = vi.fn();
}

describe('DragIntroOrb', () => {
  it('renders correctly', () => {
    const { container } = render(<DragIntroOrb />);
    const orb = container.querySelector('.drag-orb');
    expect(orb).toBeTruthy();
    expect(container.querySelector('.drag-intro-skip')).toBeTruthy();
  });

  it('handles skip button click', () => {
    const onEnter = vi.fn();
    const { container, getByText } = render(<DragIntroOrb onEnter={onEnter} />);
    
    const skipBtn = getByText('Skip Intro');
    fireEvent.click(skipBtn);
    
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.drag-intro-container')?.classList.contains('entered')).toBe(true);
  });

  it('handles pointer drag interactions to enter', () => {
    const onEnter = vi.fn();
    const { container } = render(<DragIntroOrb onEnter={onEnter} dragThreshold={-50} />);
    
    const orb = container.querySelector('.drag-orb') as HTMLElement;
    
    fireEvent.pointerDown(orb, { pointerId: 1 });
    
    // Check dragging state
    expect(orb.classList.contains('dragging')).toBe(true);
    
    // Move up by 60
    fireEvent.pointerMove(orb, { movementY: -60, pointerId: 1 });
    
    // Should trigger enter
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.drag-intro-container')?.classList.contains('entered')).toBe(true);
  });

  it('springs back on pointer up if threshold not met', () => {
    const onEnter = vi.fn();
    const { container } = render(<DragIntroOrb onEnter={onEnter} dragThreshold={-100} />);
    
    const orb = container.querySelector('.drag-orb') as HTMLElement;
    
    fireEvent.pointerDown(orb, { pointerId: 1 });
    fireEvent.pointerMove(orb, { movementY: -50, pointerId: 1 });
    fireEvent.pointerUp(orb, { pointerId: 1 });
    
    expect(onEnter).not.toHaveBeenCalled();
    expect(orb.style.transform).toBe('translateY(0px)');
  });
});
