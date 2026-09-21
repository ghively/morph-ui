import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingDock } from '../src/components/FloatingDock';

describe('FloatingDock', () => {
  const items = [
    { id: '1', label: 'Home', icon: <svg data-testid="icon-home" /> },
    { id: '2', label: 'Settings', icon: <svg data-testid="icon-settings" /> },
  ];

  it('renders correctly', () => {
    const { container, getByLabelText } = render(<FloatingDock items={items} />);
    
    expect(container.querySelector('.floating-dock-panel')).toBeTruthy();
    expect(getByLabelText('Home')).toBeTruthy();
    expect(getByLabelText('Settings')).toBeTruthy();
    expect(container.querySelector('[data-testid="icon-home"]')).toBeTruthy();
  });

  it('handles click and triggers bounce animation', () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const testItems = [{ id: '1', label: 'Home', icon: <div />, onClick }];
    
    const { getByLabelText } = render(<FloatingDock items={testItems} />);
    
    const btn = getByLabelText('Home');
    fireEvent.click(btn);
    
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(btn.classList.contains('bouncing')).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    
    expect(btn.classList.contains('bouncing')).toBe(false);
    vi.useRealTimers();
  });

  it('handles pointer move and leave gracefully (JSDOM rect 0)', () => {
    const { container } = render(<FloatingDock items={items} />);
    const dockContainer = container.querySelector('.floating-dock-container') as HTMLElement;
    
    // In JSDOM, getBoundingClientRect returns 0, so scale should default to 1.
    fireEvent.pointerMove(dockContainer, { clientX: 100, clientY: 100 });
    const btn = container.querySelector('.floating-dock-item') as HTMLElement;
    expect(btn.style.transform).toBe('scale(1)');
    
    fireEvent.pointerLeave(dockContainer);
    expect(btn.style.transform).toBe('scale(1)');
  });
});
